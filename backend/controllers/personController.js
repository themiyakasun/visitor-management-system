const xlsx = require('xlsx');
const { Person, Vehicle, Department } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');
const { Op } = require('sequelize');

const createPerson = async (req, res) => {
  const {
    name,
    nic,
    type,
    phone,
    email,
    address,
    departmentId,
    companyName,
    purpose,
    passType,
    passExpiryDate,
    vehicleData,
  } = req.body;

  try {
    console.log(type);
    if (!['employee', 'driver', 'helper', 'visitor'].includes(type))
      return res.status(400).json({ message: 'Invalid person type' });

    const existingPerson = await Person.findOne({
      where: { nic, tenantId: req.user.tenantId },
    });
    if (existingPerson)
      return res.status(400).json({ message: 'Person already exists' });

    if (email) {
      const existing = await Person.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
    }

    if (type === 'employee' && !departmentId)
      return res
        .status(400)
        .json({ message: 'Employee must jave departmentId' });

    if (type === 'visitor' && !purpose)
      return res.status(400).json({ message: 'Visitor must have a purpose' });

    if (passExpiryDate && new Date(passExpiryDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Pass expiry must be a future date.' });
    }

    const person = await Person.create({
      name,
      nic,
      type,
      phone,
      email,
      address,
      tenantId: req.user.tenantId,
      departmentId: type === 'employee' ? departmentId : null,
      companyName:
        type === 'visitor' || type === 'contractor' ? companyName : null,
      purpose: purpose,
      passType: type === 'employee' ? 'employee' : passType,
      passExpiryDate,
    });

    if (type === 'driver' && vehicleData?.length > 0) {
      const vehiclesToCreate = vehicleData.map((v) => ({
        ...v,
        driverId: person.id,
        tenantId: req.user.tenantId,
      }));

      await Vehicle.bulkCreate(vehiclesToCreate);
    }

    return res
      .status(201)
      .json({ message: 'Person created successfully', person });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const bulkUploadPersons = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length)
      return res
        .status(400)
        .json({ message: 'File is empty or invalid format' });

    const validPersons = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      const {
        name,
        nic,
        type,
        phone,
        email,
        departmentId,
        companyName,
        purpose,
        passType,
        passExpiryDate,
      } = row;

      if (!name || !type) {
        errors.push({ row: rowNumber, error: 'Name and type are required' });
        continue;
      }

      if (type === 'employee') {
        if (!departmentId) {
          errors.push({
            row: rowNumber,
            error: 'Employee must have departmentId',
          });
          continue;
        }
        const dept = await Department.findOne({
          where: { id: departmentId, tenantId: req.user.tenantId },
        });
        if (!dept) {
          errors.push({ row: rowNumber, error: 'Invalid departmentId' });
          continue;
        }
      }

      if (type === 'visitor' && !purpose) {
        errors.push({ row: rowNumber, error: 'Visitor must have purpose' });
        continue;
      }

      if (email) {
        const exists = await Person.findOne({
          where: { email, tenantId: req.user.tenantId },
        });
        if (exists) {
          errors.push({ row: rowNumber, error: 'Email already exists' });
          continue;
        }
      }

      validPersons.push({
        tenantId: req.user.tenantId,
        name,
        nic,
        type,
        phone,
        email,
        departmentId: type === 'employee' ? departmentId : null,
        companyName: type === 'visitor' ? companyName : null,
        purpose: type === 'visitor' ? purpose : null,
        passType: passType,
        passExpiryDate: passExpiryDate ? new Date(passExpiryDate) : null,
        isActive: true,
      });
    }

    if (validPersons.length > 0) {
      await Person.bulkCreate(validPersons, { validate: true });
    }

    return res.status(201).json({
      successCount: validPersons.length,
      errorCount: errors.length,
      errors,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getPersons = async (req, res) => {
  const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
    req.query
  );
  const { type } = req.params;

  try {
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const baseQuery = {
      where: { tenantId: req.user.tenantId, ...whereCondition },
      include: ['department', 'gateLogs', 'appointments', 'vehicles'],
      order: [[sortBy || 'createdAt', sortOrder || 'DESC']],
      limit,
      offset,
    };

    let personsData;
    if (type === 'all') {
      personsData = await Person.findAndCountAll({ ...baseQuery });
    } else {
      personsData = await Person.findAndCountAll({
        ...baseQuery,
        where: { type, tenantId: req.user.tenantId, ...whereCondition },
      });
    }

    return res.status(200).json({
      total: personsData.count - 1,
      page,
      pageSize: limit,
      persons: personsData.rows,
      totalPages: Math.ceil(personsData.count / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getPersonById = async (req, res) => {
  const { id } = req.params;

  try {
    const person = await Person.findOne({
      where: { id, tenantId: req.user.tenantId },
      include: ['department', 'gateLogs', 'appointments', 'vehicles'],
    });

    if (!person)
      return res.status(404).json({ message: 'Person cannot be found' });

    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deletePerson = async (req, res) => {
  const { id } = req.params;

  try {
    const isPersonExists = await Person.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!isPersonExists)
      return res.status(404).json({ message: 'Person cannot be found' });

    await Person.destroy({ where: { id, tenantId: req.user.tenantId } });

    return res.status(201).json({ message: 'Person deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updatePerson = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      nic,
      phone,
      email,
      address,
      photoUrl,
      passExpiryDate,
      isActive,
      companyName,
      purpose,
    } = req.body;

    const person = await Person.findOne({
      where: { id, tenantId: req.user.tenantId },
    });
    if (!person)
      return res.status(404).json({ message: 'Person cannot be found' });

    const isEmailExists = await Person.findOne({
      where: { email, tenantId: req.user.tenantId },
    });
    if (isEmailExists)
      return res.status(400).json({ message: 'Email already exists' });

    if (passExpiryDate && new Date(passExpiryDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Pass expiry must be a future date.' });
    }

    person.name = name;
    person.nic = nic;
    person.phone = phone;
    person.email = email;
    person.address = address;
    person.photoUrl = photoUrl;
    person.passExpiryDate = passExpiryDate;
    person.isActive = isActive;
    person.companyName = companyName;
    person.purpose = purpose;

    await person.save();

    return res
      .status(201)
      .json({ message: 'Person updated successfully', person });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createPerson,
  getPersons,
  getPersonById,
  deletePerson,
  bulkUploadPersons,
  updatePerson,
};
