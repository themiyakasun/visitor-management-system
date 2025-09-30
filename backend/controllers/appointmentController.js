const { Appointment, Person } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');

const createAppointment = async (req, res) => {
  const {
    datetime,
    purpose,
    expectedDuration,
    visitorId,
    employeeId,
    visitorDetails = [],
  } = req.body;
  try {
    let visitor;

    const isVisitorExists = await Person.findOne({
      where: { id: visitorId, tenantId: req.user.tenantId },
    });

    if (!isVisitorExists) {
      visitor = await Person.create({
        name: visitorDetails.name,
        nic: visitorDetails.nic,
        type: 'visitor',
        phone: visitorDetails.phone,
        email: visitorDetails.email,
        companyName: visitorDetails.companyName,
        purpose: visitorDetails.purpose,
        passType: 'visitorPass',
        passExpiryDate: visitorDetails.passExpiryDate
          ? new Date(visitorDetails.passExpiryDate)
          : null,
        tenantId: req.user.tenantId,
        isActive: true,
      });
    }

    function toDateOrNull(value) {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString();
    }

    const appointment = await Appointment.create({
      datetime: toDateOrNull(datetime),
      purpose,
      expectedDuration,
      visitorId: visitorId ? visitorId : visitor.id,
      employeeId: employeeId ? employeeId : null,
      tenantId: req.user.tenantId,
    });

    return res
      .status(201)
      .json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [
            { actualArrival: { [Op.like]: `%${search}%` } },
            { actualDeparture: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Appointment.findAndCountAll({
      where: { tenantId: req.user.tenantId, ...whereCondition },
      include: ['visitor', 'employee'],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(201).json({
      message: 'Appointment created',
      appointments: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({
      where: { id, tenantId: req.user.tenantId },
      include: ['visitor', 'employee'],
    });
    if (!appointment)
      return res.status(404).json({ message: 'Appointment cannot be found' });

    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    datetime,
    status,
    purpose,
    expectedDuration,
    actualArrival,
    notificationSent,
  } = req.body;

  try {
    const isAppointmentExists = await Appointment.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isAppointmentExists)
      return res.status(404).json({ message: 'Appointment cannot be found' });

    const payload = Object.fromEntries(
      Object.entries({
        datetime,
        status,
        purpose,
        expectedDuration,
        actualArrival,
        notificationSent,
      }).filter(([_, v]) => v != null && v !== '')
    );

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided' });
    }

    const [affectedRows] = await Appointment.update(payload, {
      where: { id, tenantId: req.user.tenantId },
    });

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Appointment not found or not updated' });
    }

    return res.status(201).json({
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const isAppointmentExists = await Appointment.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isAppointmentExists)
      return res.status(404).json({ message: 'Appointment cannot be found' });

    await Appointment.destroy({ where: { id, tenantId: req.user.tenantId } });

    return res
      .status(201)
      .json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
};
