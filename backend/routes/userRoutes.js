const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, createUser);
router.get('/', authMiddleware, getUsers);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
