const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const { recordGateAction } = require('../controllers/gateController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', recordGateAction);

module.exports = router;
