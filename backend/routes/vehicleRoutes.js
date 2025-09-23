const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  createVehicle,
  getAllVehicles,
  deleteVehicle,
  getVehicleById,
  updateVehicle,
} = require('../controllers/vehicleController.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createVehicle);
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.delete('/:id', deleteVehicle);
router.put('/:id', updateVehicle);

module.exports = router;
