const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenantController.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTenant);
router.get('/', getTenants);
router.get('/:id', getTenantById);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

module.exports = router;
