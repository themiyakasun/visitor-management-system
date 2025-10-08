const { Op } = require('sequelize');
const { Tenant } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');

const createTenant = async (req, res) => {
  const {
    name,
    slug,
    description,
    email,
    address,
    city,
    state,
    zipCode,
    country,
    latitude,
    longitude,
    phone,
    altPhone,
    fax,
    website,
    logo,
    businessId,
    taxId,
    acPushUsername,
    acPushPassword,
    acPushUrl,
    registrationFee,
  } = req.body;

  try {
    const isExist = await Tenant.findOne({
      where: {
        [Op.or]: [{ email }, { slug }],
      },
    });

    if (isExist)
      return res
        .status(400)
        .json({ message: 'Tenant with this email or slug already exists' });

    const tenant = await Tenant.create({
      name,
      slug,
      description,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      phone,
      altPhone,
      fax,
      website,
      logo,
      businessId,
      taxId,
      acPushUsername,
      acPushPassword,
      acPushUrl,
      registrationFee,
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      message: 'Tenant created successfully',
      tenant,
    });
  } catch (error) {
    console.error('CreateTenant error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const getTenants = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { slug: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Tenant.findAndCountAll({
      where: whereCondition,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
      tenants: rows,
    });
  } catch (error) {
    console.error('GetTenants error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const getTenantById = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findOne({
      where: { id },
    });

    if (!tenant)
      return res.status(404).json({ message: 'Tenant cannot be found' });

    return res.status(200).json(tenant);
  } catch (error) {
    console.error('GetTenantById error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateTenant = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const tenant = await Tenant.findOne({ where: { id } });

    if (!tenant)
      return res.status(404).json({ message: 'Tenant cannot be found' });

    await tenant.update(updatedData);

    return res.status(200).json({
      message: 'Tenant updated successfully',
      tenant,
    });
  } catch (error) {
    console.error('UpdateTenant error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findOne({ where: { id } });

    if (!tenant)
      return res.status(404).json({ message: 'Tenant cannot be found' });

    await Tenant.destroy({ where: { id } });

    return res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('DeleteTenant error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
