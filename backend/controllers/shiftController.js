const { Shift } = require('../models');

const createShift = async (req, res) => {
  const { name, startTime, endTime } = req.body;

  try {
    const isShiftExists = await Shift.findOne({ where: { name } });
    if (isShiftExists)
      return res.status(400).json({ message: 'Shift already exists' });

    const shift = await Shift.create({
      name,
      startTime,
      endTime,
    });
    return res
      .status(200)
      .json({ message: 'Shift created successfully', shift });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.findAll({});

    return res.status(200).json(shifts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getShiftById = async (req, res) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findOne({ where: { id } });
    if (!shift) return res.status(404).json({ message: 'Shift cannot found' });

    return res.status(200).json(shift);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateShift = async (req, res) => {
  const { id } = req.params;
  const { name, startTime, endTime } = req.body;

  try {
    const isShiftExists = await Shift.findOne({ where: { id } });
    if (!isShiftExists)
      return res.status(404).json({ message: 'Shift cannot found' });

    const updatedShift = await Shift.update(
      {
        name,
        startTime,
        endTime,
      },
      {
        where: { id },
      }
    );

    return res
      .status(200)
      .json({ message: 'Shift updated successfully', shift: updatedShift });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteShift = async (req, res) => {
  const { id } = req.params;
  try {
    const isShiftExists = await Shift.findOne({ where: { id } });
    if (!isShiftExists)
      return res.status(404).json({ message: 'Shift cannot found' });

    await Shift.destroy({ where: { id } });

    return res.status(201).json({ message: 'Shift updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createShift,
  getAllShifts,
  getShiftById,
  deleteShift,
  updateShift,
};
