const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  recordGateAction,
  getTodayActivity,
} = require('../controllers/gateController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', recordGateAction);
router.get('/', getTodayActivity);

module.exports = router;
