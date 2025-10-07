const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const { Gatelog, Breaklog, Person, Vehicle, Shift } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');

const getCurrentShift = async (tenantId) => {
  const now = new Date();

  return await Shift.findOne({
    where: {
      startTime: { [Op.lte]: now },
      endTime: { [Op.gte]: now },
    },
  });
};

const recordGateAction = async (req, res) => {
  const { personId, vehicleId, gateId, action, breakType } = req.body;

  try {
    const shift = await getCurrentShift(req.user.tenantId);

    const person = await Person.findOne({
      where: { id: personId, tenantId: req.user.tenantId },
    });
    if (!person) return res.status(404).json({ message: 'Person not found' });

    if (person.passExpiryDate && new Date(person.passExpiryDate) < new Date()) {
      return res.status(400).json({ message: 'Person pass has expired' });
    }

    let vehicle = null;
    if (vehicleId) {
      vehicle = await Vehicle.findOne({
        where: { id: vehicleId, tenantId: req.user.tenantId },
      });
      if (!vehicle)
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (
      ['breakExit', 'breakReentry'].includes(action) &&
      person.type !== 'employee'
    ) {
      return res
        .status(400)
        .json({ message: 'Only employees have break logs' });
    }

    const gateLog = await Gatelog.create({
      type: action,
      timestamp: new Date(),
      personId,
      vehicleId: vehicle ? vehicle.id : null,
      shiftId: shift ? shift.id : null,
      tenantId: req.user.tenantId,
    });

    if (person.type === 'employee') {
      if (action === 'breakExit') {
        if (!['tea', 'lunch'].includes(breakType)) {
          return res.status(400).json({ message: 'Invalid break type' });
        }
        await Breaklog.create({
          type: breakType,
          exitTime: new Date(),
          gateLogId: gateLog.id,
          tenantId: req.user.tenantId,
        });
      }

      if (action === 'breakReentry') {
        const breakLog = await Breaklog.findOne({
          where: {
            gateLogId: { [Op.ne]: null },
            reentryTime: null,
            tenantId: req.user.tenantId,
          },
          order: [['exitTime', 'DESC']],
        });

        if (!breakLog)
          return res.status(400).json({ message: 'No active break found' });

        const breakLimits = {
          tea: 15, // 15 minutes for tea break
          lunch: 1, // 60 minutes for lunch break
        };

        const reentryTime = new Date();
        const duration = Math.floor((reentryTime - breakLog.exitTime) / 60000); // duration in minutes
        const isLate = duration > breakLimits[breakLog.type] ? 1 : 0;

        breakLog.reentryTime = reentryTime;
        breakLog.duration = duration;
        breakLog.isLate = isLate;
        breakLog.gateLogId = gateLog.id;

        await breakLog.save();
      }
    }

    return res
      .status(201)
      .json({ message: 'Gate action recorded successfully', gateLog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getTodayActivity = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, offset } = parseQueryParams(
      req.query
    );
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const { count, rows } = await Gatelog.findAndCountAll({
      where: {
        tenantId: req.user.tenantId,
        timestamp: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: ['person', 'vehicle'],
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      activity: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
      count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, offset } = parseQueryParams(
      req.query
    );

    const { count, rows } = await Gatelog.findAndCountAll({
      where: { tenantId: req.user.tenantId },
      include: ['person', 'vehicle'],
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      activity: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
      count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const generateActiveReport = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      type,
      personId,
      vehicleId,
      timeGap,
      format,
      page,
      limit,
    } = req.query;

    const where = {
      tenantId: req.user.tenantId,
    };

    if (type) {
      where.type = type;
    } else {
      where.type = 'in';
    }

    if (fromDate && toDate) {
      where.timestamp = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    } else if (fromDate) {
      where.timestamp = { [Op.gte]: new Date(fromDate) };
    } else if (toDate) {
      where.timestamp = { [Op.lte]: new Date(toDate) };
    }

    if (personId) {
      where.personId = personId;
    }

    if (vehicleId) {
      where.vehicleId = vehicleId;
    }

    let gateLogs = await Gatelog.findAndCountAll({
      where,
      include: [
        {
          model: Person,
          as: 'person',
        },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'numberPlate'] },
      ],
      order: [['timestamp', 'ASC']],
      limit: parseInt(limit),
    });

    if (timeGap) {
      const hoursGap = parseInt(timeGap, 10);
      gateLogs.rows = gateLogs.rows.filter((log, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        const diffHours =
          (new Date(log.timestamp) - new Date(prev.timestamp)) / 36e5;
        return diffHours >= hoursGap;
      });
    }

    if (!gateLogs.rows.length) {
      return res.status(404).json({ message: 'No active records found' });
    }

    if (format === 'json') {
      return res.json({
        success: true,
        total: gateLogs.count,
        page,
        pageSize: limit,
        gateLogs: gateLogs.rows,
        totalPages: Math.ceil(gateLogs.count / limit),
      });
    }

    // Generate PDF
    const date = new Date().toLocaleDateString();
    const doc = new PDFDocument({ margin: 50 });
    res.header('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="active-report-${date}.pdf"`
    );
    doc.pipe(res);

    // Report Title
    doc
      .fontSize(18)
      .text(`Active Report - ${date}`, { align: 'center' })
      .moveDown();

    // Table headers
    doc.fontSize(12).text('Person', 50, 120);
    doc.text('Vehicle', 200, 120);
    doc.text('Action Type', 300, 120);
    doc.text('Timestamp', 400, 120);

    // Divider
    doc.moveTo(50, 140).lineTo(550, 140).stroke();

    // Table content
    let y = 160;
    const itemSpacing = 20;
    gateLogs.rows.forEach((log) => {
      doc.text(log.person ? log.person.name : '-', 50, y);
      doc.text(log.vehicle ? log.vehicle.plateNumber : '-', 200, y);
      doc.text(log.type, 300, y);
      doc.text(new Date(log.timestamp).toLocaleString(), 400, y);
      y += itemSpacing;
    });

    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const generateInOutReport = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      personId,
      vehicleId,
      timeGap,
      format,
      page = 1,
      limit = 50,
    } = req.query;

    const where = { tenantId: req.user.tenantId };

    // Date filtering
    if (fromDate && toDate) {
      where.timestamp = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    } else if (fromDate) {
      where.timestamp = { [Op.gte]: new Date(fromDate) };
    } else if (toDate) {
      where.timestamp = { [Op.lte]: new Date(toDate) };
    }

    if (personId) where.personId = personId;
    if (vehicleId) where.vehicleId = vehicleId;

    // Fetch both "in" and "out" logs
    let gateLogs = await Gatelog.findAll({
      where,
      include: [
        { model: Person, as: 'person' },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'numberPlate'] },
      ],
      order: [['timestamp', 'ASC']],
    });

    if (!gateLogs.length) {
      return res.status(404).json({ message: 'No active records found' });
    }

    // Apply timeGap filter if provided
    if (timeGap) {
      const hoursGap = parseInt(timeGap, 10);
      gateLogs = gateLogs.filter((log, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        const diffHours =
          (new Date(log.timestamp) - new Date(prev.timestamp)) / 36e5;
        return diffHours >= hoursGap;
      });
    }

    // Build person-wise in/out map
    const reportMap = {};
    gateLogs.forEach((log) => {
      const pid = log.personId;
      if (!reportMap[pid]) {
        reportMap[pid] = {
          person: log.person ? log.person.name : '-',
          vehicle: log.vehicle ? log.vehicle.numberPlate : '-',
          inTime: null,
          outTime: null,
        };
      }

      // First "in" and last "out"
      if (log.type === 'in' && !reportMap[pid].inTime) {
        reportMap[pid].inTime = log.timestamp;
      }
      if (log.type === 'out') {
        reportMap[pid].outTime = log.timestamp;
      }
    });

    const reportData = Object.values(reportMap);

    // Pagination
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const total = reportData.length;
    const paginatedData = reportData.slice(
      (pageNum - 1) * pageSize,
      pageNum * pageSize
    );

    if (format === 'json') {
      return res.json({
        success: true,
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        report: paginatedData,
      });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 20 });
    const dateStr = new Date().toLocaleDateString();
    res.header('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="person-in-out-report-${dateStr}.pdf"`
    );
    doc.pipe(res);

    doc
      .fontSize(18)
      .text(`Person In/Out Report - ${dateStr}`, { align: 'center' })
      .moveDown();

    // Table headers
    doc.fontSize(12).text('Person', 50, 100);
    doc.text('Vehicle', 200, 100);
    doc.text('In Time', 300, 100);
    doc.text('Out Time', 450, 100);
    doc.moveTo(50, 120).lineTo(550, 120).stroke();

    let y = 140;
    const itemSpacing = 20;
    paginatedData.forEach((item) => {
      doc.text(item.person, 50, y);
      doc.text(item.vehicle || '-', 200, y);
      doc.text(
        item.inTime ? new Date(item.inTime).toLocaleString() : '-',
        300,
        y
      );
      doc.text(
        item.outTime ? new Date(item.outTime).toLocaleString() : '-',
        450,
        y
      );
      y += itemSpacing;
    });

    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const whereToday = {
      tenantId,
      timestamp: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };

    const totalLogs = await Gatelog.count({ where: whereToday });

    const totalEmployees = await Gatelog.count({
      where: whereToday,
      include: [
        {
          model: Person,
          as: 'person',
          where: { type: 'employee' },
        },
      ],
    });

    const totalVisitors = await Gatelog.count({
      where: whereToday,
      include: [
        {
          model: Person,
          as: 'person',
          where: { type: 'visitor' },
        },
      ],
    });

    const totalVehicles = await Gatelog.count({
      where: whereToday,
      distinct: true,
      col: 'vehicleId',
    });

    return res.json({
      success: true,
      totalLogs,
      totalEmployees,
      totalVisitors,
      totalVehicles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  recordGateAction,
  getTodayActivity,
  getAllActivities,
  generateActiveReport,
  generateInOutReport,
  getDashboardSummary,
};
