const express = require('express');

const userRoutes = require('./userRoutes.js');
const authRoutes = require('./authRoutes.js');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
