const { Op } = require('sequelize');
const { Gatelog, Breaklog, Person, Vehicle, Shift } = require('../models');

const getCurrentShift = async (tenantId) => {
  const now = new Date();

  return await Shift.findOne({
    where: {
      tenantId,
      startTime: { [Op.lte]: now },
      endTime: { [Op.gte]: now },
    },
  });
};

const recordGateAction = async (req, res) => {
  const { personId, vehicleId, gateId, action, breakType } = req.body;

  try {
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

    const gateLog = await Gatelog.create({
      type: action, // 'in', 'out', 'breakExit', 'breakReentry'
      timestamp: new Date(),
      personId,
      vehicleId: vehicle ? vehicle.id : null,
      shiftId: shift ? shift.id : null,
      tenantId: req.user.tenantId,
    });

    const shift = await getCurrentShift(req.user.tenantId);

    if (person.type === 'employee') {
      if (action === 'breakExit') {
        if (!['tea', 'lunch'].includes(breakType)) {
          return res.status(400).json({ message: 'Invalid break type' });
        }
        await Breaklog.create({
          type: breakType,
          exitTime: new Date(),
          gateLogId: gateLog.id,
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

        const reentryTime = new Date();
        const duration = Math.floor((reentryTime - breakLog.exitTime) / 60000); // duration in minutes
        const isLate = duration > 30 ? 1 : 0; // optional: mark late if >30 min

        breakLog.reentryTime = reentryTime;
        breakLog.duration = duration;
        breakLog.isLate = isLate;

        await breakLog.save();
      }
    } else if (
      ['visitor', 'helper'].includes(person.type) &&
      ['breakExit', 'breakReentry'].includes(action)
    ) {
      return res
        .status(400)
        .json({ message: 'Only employees have break logs' });
    }

    return res
      .status(201)
      .json({ message: 'Gate action recorded successfully', gateLog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { recordGateAction };
