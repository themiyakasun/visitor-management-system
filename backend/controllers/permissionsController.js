const { where } = require('sequelize');
const { Permission, User, Role } = require('../models');

const createPermissions = async (req, res) => {
  const { resource, action } = req.body;
  try {
    const isPermissionExists = await Permission.findOne({
      where: { resource, action },
    });

    if (isPermissionExists)
      return res.status(400).json({ message: 'Permission already exists' });

    if (resource == '' || action == '')
      return res
        .status(400)
        .json({ message: 'Resource or Action cannot be empty' });

    const permission = await Permission.create({
      resource,
      action,
    });

    return res
      .status(201)
      .json({ message: 'Permission created successfully', permission });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({});

    return res.status(200).json(permissions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const isPermissionExists = await Permission.findOne({ where: { id } });
    if (!isPermissionExists)
      return res.status(400).json({ message: 'Permission cannot be found' });

    await Permission.destroy({ where: { id } });

    return res.status(201).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { resource, action } = req.body;
  try {
    const isPermissionExists = await Permission.findOne({ where: { id } });
    if (!isPermissionExists)
      return res.status(400).json({ message: 'Permission cannot be found' });

    await Permission.update({ resource, action }, { where: { id } });

    return res.status(201).json({ message: 'Permission update successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    const role = await Role.findOne({ where: { id: roleId } });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    const permission = await Permission.findOne({
      where: { id: permissionId },
    });
    if (!permission)
      return res.status(404).json({ message: 'Permission not found' });

    const hasPermission = await role.hasPermission(permission);
    if (hasPermission) {
      return res
        .status(400)
        .json({ message: 'Role already has this permission' });
    }

    await role.addPermission(permission);

    return res.json({ message: 'Permission assigned successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const assignPermissionToUser = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const permission = await Permission.findOne({
      where: { id: permissionId },
    });
    if (!permission)
      return res.status(404).json({ message: 'Permission not found' });

    const hasPermission = await user.hasPermission(permission);
    if (hasPermission) {
      return res
        .status(400)
        .json({ message: 'User already has this permission' });
    }

    await user.addPermission(permission);

    return res.json({ message: 'Permission assigned successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const unAssignPermissionFromRole = async (req, res) => {
  const { roleId, permissionId } = req.params;
  try {
    const role = await Role.findOne({ where: { id: roleId } });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    const permission = await Permission.findOne({
      where: { id: permissionId },
    });
    if (!permission)
      return res.status(404).json({ message: 'Permission not found' });

    await role.removePermission(permission);
    return res.json({ message: 'Permission removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const unAssignPermissionFromUser = async (req, res) => {
  try {
    const { userId, permissionId } = req.params;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Role not found' });

    const permission = await Permission.findOne({
      where: { id: permissionId },
    });
    if (!permission)
      return res.status(404).json({ message: 'Permission not found' });

    await user.removePermission(permission);
    return res.json({ message: 'Permission removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPermissions,
  getAllPermissions,
  deletePermission,
  updatePermission,
  assignPermissionToRole,
  assignPermissionToUser,
  unAssignPermissionFromRole,
  unAssignPermissionFromUser,
};
