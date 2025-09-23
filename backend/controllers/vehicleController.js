const { where } = require('sequelize');
const { Vehicle, Person } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');

const createVehicle = async (req, res) => {
  const { numberPlate, type, make, model, color, year, driverId } = req.body;
  try {
    const isVehicleExists = await Vehicle.findOne({ where: { numberPlate } });
    if (isVehicleExists)
      return res.status(400).json({ message: 'Vehicle already exists' });

    const isDriverExists = await Person.findOne({ where: { id: driverId } });
    if (!isDriverExists)
      return res.status(404).json({ message: 'Driver cannot be found' });

    const vehicle = await Vehicle.create({
      numberPlate,
      type,
      make,
      model,
      color,
      year,
      driverId,
      tenantId: req.user.tenantId,
    });

    return res
      .status(201)
      .json({ message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [{ numberPlate: { [Op.like]: `%${search}%` } }],
        }
      : {};

    const vehicles = await Vehicle.findAll({
      where: { tenantId: req.user.tenantId, ...whereCondition },
      include: ['driver', 'tenant', 'gateLogs'],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(201).json({
      vehicles,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findOne({
      where: { id, tenantId: req.user.tenantId },
      include: ['driver', 'gateLogs'],
    });

    if (!vehicle)
      return res.status(404).json({ message: 'Vehicle cannot be found' });

    return res.status(200).json(vehicle);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const isVehicleExists = await Vehicle.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isVehicleExists)
      return res.status(404).json({ message: 'Vehicle cannot be found' });

    await Vehicle.destroy({ where: { id, tenantId: req.user.tenantId } });

    return res.status(201).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { numberPlate, type, make, model, color, year, isActive, driverId } =
    req.body;

  try {
    const isVehicleExists = await Vehicle.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isVehicleExists)
      return res.status(404).json({ message: 'Vehicle cannot be found' });

    const updatedVehicle = await Vehicle.update(
      {
        numberPlate,
        type,
        make,
        model,
        color,
        year,
        isActive,
        driverId,
      },
      { where: { id, tenantId: req.user.tenantId } }
    );
    return res.status(201).json({
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  updateVehicle,
};
