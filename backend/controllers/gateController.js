const { Op } = require('sequelize');
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

    const activity = await Gatelog.findAll({
      where: tenantId,
      timestamp: {
        [Op.between]: [startOfDay, endOfDay],
      },
      include: ['person', 'vehicle'],
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      activity,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { recordGateAction, getTodayActivity };
