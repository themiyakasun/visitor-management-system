const express = require('express');
const { login, changePassword } = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
