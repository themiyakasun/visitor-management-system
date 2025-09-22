const { where } = require('sequelize');
const { Department } = require('../models');

const createDepartment = async (req, res) => {
  const { name, description, employeeList } = req.body;

  try {
    const isDepartmentExists = await Department.findOne({
      where: { name, tenantId: req.user.tenantId },
    });
    if (isDepartmentExists)
      return res.status(400).json({ message: 'Department already exists' });

    const department = await Department.create({
      name,
      description,
      tenantId: req.user.tenantId,
    });

    return res
      .status(201)
      .json({ message: 'Department created successfully', department });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getDepartments = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
        }
      : {};

    const { count, rows } = await Department.findAll({
      where: { tenantId: req.user.tenantId, whereCondition },
      include: 'persons',
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      total: count,
      departments: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findOne({
      where: { id, tenantId: req.user.tenantId },
      include: ['persons'],
    });
    if (!department)
      return res.status(404).json({ message: 'Department cannot be found' });

    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getDeparmentEmployees = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
        }
      : {};

    const { count, rows } = await Department.findAll({
      where: { tenantId: req.user.tenantId, whereCondition },
      include: [
        {
          association: 'persons',
          where: { type: 'employee' },
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      total: count,
      departments: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const department = await Department.findOne({
      where: { id, tenantId: req.user.tenantId },
    });

    if (!department)
      return res.status(404).json({ message: 'Department cannot be found' });

    department.name = name;
    department.description = description;

    await department.save();

    return res.status(201).json({ message: 'Department updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const isDepartmentExist = await Department.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isDepartmentExist)
      return res.status(404).json({ message: 'Department cannot be found' });

    await Department.distroy({ where: { id, tenantId: req.user.tenantId } });

    return res.status(201).json({ message: 'Department deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDeparmentEmployees,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
};
