const express = require('express');

const {
  createRole,
  getRoles,
  getRoleById,
  deleteRole,
  updateRole,
} = require('../controllers/roleController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRole);
router.get('/', getRoles);
router.get('/:id', getRoleById);
router.delete('/:id', deleteRole);
router.put('/:id', updateRole);

module.exports = router;
