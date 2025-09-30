const express = require('express');

const userRoutes = require('./userRoutes.js');
const authRoutes = require('./authRoutes.js');
const departmentRoutes = require('./departmentRoutes.js');
const personRoutes = require('./personRoutes.js');
const vehicleRoutes = require('./vehicleRoutes.js');
const gatelogRoutes = require('./gateRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const shiftRoutes = require('./shiftRoutes.js');
const permissionRoutes = require('./permissionRoutes.js');
const appointmentRoutes = require('./appointmentRoutes.js');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/persons', personRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/gatelogs', gatelogRoutes);
router.use('/roles', roleRoutes);
router.use('/shifts', shiftRoutes);
router.use('/permissions', permissionRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
