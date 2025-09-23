const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
} = require('../controllers/appointmentController.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
