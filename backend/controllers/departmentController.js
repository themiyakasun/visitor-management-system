const { Op } = require('sequelize');
const { Department } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');
const PDFDocument = require('pdfkit');

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
    console.log(error);
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

    const { count, rows } = await Department.findAndCountAll({
      where: { tenantId: req.user.tenantId, ...whereCondition },
      include: 'persons',
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      total: count - 1,
      departments: rows,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const generateAllDepartmentsReport = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { tenantId: req.user.tenantId },
      include: [
        {
          association: 'persons',
          where: { type: 'employee' },
          required: false,
        },
      ],
    });

    if (!departments.length) {
      return res.status(404).json({ message: 'No departments found' });
    }

    const date = new Date().toLocaleDateString();

    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="departments-${date}.pdf"`
    );
    doc.pipe(res);

    doc
      .fontSize(18)
      .text(`Departments Report - ${date}`, {
        align: 'center',
      })
      .moveDown();

    const tableTop = 100;
    const itemSpacing = 20;
    const startX = 50;
    let y = tableTop + 25;

    doc.fontSize(12);

    // Divider line
    doc
      .moveTo(startX, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    departments.forEach((department) => {
      doc.text(department.name, startX, y);
      y += itemSpacing;

      const persons = department.persons || [];
      persons.forEach((person) => {
        doc.text(person.name, startX + 0, y);
        doc.text(person.phone || '-', startX + 100, y);
        doc.text(person.nic || '-', startX + 200, y);
        doc.text(person.email || '-', startX + 300, y);
        y += itemSpacing;
      });

      y += itemSpacing;
    });
    doc.end();
  } catch (error) {
    console.log(error);
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

const generateDepartmentReport = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findOne({
      where: { id, tenantId: req.user.tenantId },
      include: [
        {
          association: 'persons',
          where: { type: 'employee' },
          required: false,
        },
      ],
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const date = new Date().toISOString().split('T')[0];

    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${department.name}-departments-${date}.pdf"`
    );
    doc.pipe(res);

    doc
      .fontSize(18)
      .text(`${department.name} Department Report - ${date}`, {
        align: 'center',
      })
      .moveDown();

    const tableTop = 100;
    const itemSpacing = 20;
    const startX = 50;

    doc.fontSize(12);

    doc.text('Name', startX + 0, tableTop);
    doc.text('Phone', startX + 100, tableTop);
    doc.text('NIC', startX + 200, tableTop);
    doc.text('Email', startX + 300, tableTop);

    // Divider line
    doc
      .moveTo(startX, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Table rows
    const persons = department.persons || [];
    let y = tableTop + 25;

    persons.forEach((person, i) => {
      doc.text(person.name, startX + 0, y);
      doc.text(person.phone || '-', startX + 100, y);
      doc.text(person.nic || '-', startX + 200, y);
      doc.text(person.email || '-', startX + 300, y);
      y += itemSpacing;
    });
    doc.end();
  } catch (error) {
    console.log(error);
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
      where: { tenantId: req.user.tenantId, ...whereCondition },
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

    await Department.update(
      { name, description },
      { where: { id, tenantId: req.user.tenantId } }
    );

    return res
      .status(201)
      .json({ message: 'Department updated successfully', department });
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

    await Department.destroy({ where: { id, tenantId: req.user.tenantId } });

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
  generateDepartmentReport,
  generateAllDepartmentsReport,
};
