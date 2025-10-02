const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  generateAppointmentReport,
} = require('../controllers/appointmentController.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/report', generateAppointmentReport);
router.get('/:id', getAppointmentById);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
