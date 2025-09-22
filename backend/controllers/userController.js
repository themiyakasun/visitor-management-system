const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Role, Permission } = require('../models');
const { parseQueryParams } = require('../utils/helpers.js');

const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    roleNames = [],
    permissionData = [],
    tenantId,
  } = req.body;

  try {
    const isExist = await User.findOne({ where: { email } });
    if (isExist)
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });

    let permissions = [];
    let roles = [];

    if (roleNames.length > 0) {
      roles = await Role.findAll({
        where: { name: { [Op.in]: roleNames } },
      });

      if (roleNames.length !== roles.length) {
        return res
          .status(400)
          .json({ message: 'One or more roles cannot found' });
      }
    }

    if (permissionData.length > 0) {
      const permissionFilters = permissionData.map((p) => ({
        [Op.and]: [{ resource: p.resource, action: p.action }],
      }));

      permissions = await Permission.findAll({
        where: { [Op.or]: permissionFilters },
      });

      if (permissionData.length !== permissions.length) {
        return res
          .status(400)
          .json({ message: 'One or more permissions cannot found' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tenantId,
    });

    // Associate roles and permissions
    if (roles.length > 0) await user.addRoles(roles);
    if (permissions.length > 0) await user.addPermissions(permissions);

    // Fetch user with roles & permissions
    const userWithAssociations = await User.findByPk(user.id, {
      include: ['roles', 'permissions'],
    });

    return res
      .status(201)
      .json({ message: 'User created successfully', userWithAssociations });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search, offset } = parseQueryParams(
      req.query
    );

    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      include: ['roles', 'permissions'],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
      users: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
      include: ['roles', 'permissions'],
    });

    if (!user) res.status(404).json({ message: 'User cannot be found' });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    isEmailVerified,
    roleNames = [],
    permissionData = [],
  } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { id },
    });
    if (!existingUser)
      return res.status(404).json({ message: 'User cannot be found' });

    if (email && email !== existingUser.email) {
      const isEmailTaken = await User.findOne({
        where: { email },
      });

      if (isEmailTaken)
        return res.status(400).json({ message: 'Email already taken' });
    }

    let roles = [];
    let permissions = [];

    if (roleNames.length > 0) {
      roles = await Role.findAll({
        where: { name: { [Op.in]: roleNames } },
      });

      if (roleNames.length !== roles.length) {
        return res
          .status(400)
          .json({ message: 'One or more roles cannot found' });
      }
    }

    if (permissionData.length > 0) {
      const permissionFilters = permissionData.map((p) => ({
        [Op.and]: [{ resource: p.resource, action: p.action }],
      }));

      permissions = await Permission.findAll({
        where: { [Op.or]: permissionFilters },
      });

      if (permissionData.length !== permissions.length) {
        return res
          .status(400)
          .json({ message: 'One or more permissions cannot found' });
      }
    }

    if (name !== undefined) existingUser.name = name;
    if (email !== undefined) existingUser.email = email;
    if (isEmailVerified !== undefined)
      existingUser.isEmailVerified = isEmailVerified;

    await existingUser.save();

    // Update roles if provided
    if (roleNames.length > 0) {
      await existingUser.addRoles(roles);
    }

    // Update permissions if provided
    if (permissionData.length > 0) {
      await existingUser.addPermissions(permissions);
    }

    const updatedUser = await User.findOne({
      where: { id },
      include: ['roles', 'permissions'],
    });

    return res.status(201).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) return res.status(404).json({ message: 'User cannot be found' });

    if (id === req.user.id)
      return res
        .status(400)
        .json({ message: 'Cannot delete your own account' });

    await User.distroy({
      where: { id },
    });

    return res.status(201).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
