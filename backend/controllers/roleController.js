const { Role } = require('../models');

const createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const isRoleExists = await Role.findOne({ where: { name } });
    if (isRoleExists)
      return res.status(400).json({ message: 'Role already exists' });

    const role = await Role.create({
      name,
    });

    return res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ include: 'permissions' });

    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({ where: { id } });
    if (!role) return res.status(404).json({ message: 'Role cannot be found' });

    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const isRoleExists = await Role.findOne({ where: { id } });
    if (!isRoleExists)
      return res.status(404).json({ message: 'Role cannot be found' });

    const updatedRole = await Role.update(
      {
        name,
      },
      {
        where: { id },
      }
    );

    return res
      .status(201)
      .json({ message: 'Role updated successfully', role: updateRole });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const isRoleExists = await Role.findOne({ where: { id } });
    if (!isRoleExists)
      return res.status(404).json({ message: 'Role cannot be found' });

    await Role.destroy({ where: { id } });

    return res.status(201).json({ message: 'Role deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createRole, getRoleById, getRoles, deleteRole, updateRole };
