const express = require('express');
const {
  createDepartment,
  getDepartments,
  getDeparmentEmployees,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDepartment);
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.get('/employees', getDeparmentEmployees);
router.put('/update/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
