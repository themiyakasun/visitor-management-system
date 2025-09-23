const express = require('express');

const userRoutes = require('./userRoutes.js');
const authRoutes = require('./authRoutes.js');
const departmentRoutes = require('./departmentRoutes.js');
const personRoutes = require('./personRoutes.js');
const vehicleRoutes = require('./vehicleRoutes.js');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/persons', personRoutes);
router.use('/vehicles', vehicleRoutes);

module.exports = router;
