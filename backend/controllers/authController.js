const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { getUserPermissions } = require('../utils/helpers.js');

const generateToken = ({ userId, tenantId }) => {
  return jwt.sign({ userId, tenantId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: ['roles', 'permissions', 'tenant'],
    });

    if (!user)
      return res
        .status(404)
        .json({ message: 'User cannot be found for this email' });

    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id, user.tenant.id);
    const userPermissions = getUserPermissions(user);

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        user,
        token,
        userPermissions,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  login,
};
