const express = require('express');
const {
  createDepartment,
  getDepartments,
  getDeparmentEmployees,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  generateDepartmentReport,
  generateAllDepartmentsReport,
  getDepartmentEmployeeCounts,
} = require('../controllers/departmentController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDepartment);
router.get('/', getDepartments);
router.get('/employee-count', getDepartmentEmployeeCounts);
router.get('/employees', getDeparmentEmployees);
router.get('/full-report', generateAllDepartmentsReport);
router.get('/report/:id', generateDepartmentReport);
router.get('/:id', getDepartmentById);
router.put('/update/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
