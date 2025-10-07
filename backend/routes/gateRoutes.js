const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  recordGateAction,
  getTodayActivity,
  getAllActivities,
  generateActiveReport,
  generateInOutReport,
  getDashboardSummary,
} = require('../controllers/gateController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', recordGateAction);
router.get('/', getAllActivities);
router.get('/today', getTodayActivity);
router.get('/report/active', generateActiveReport);
router.get('/report/in-out', generateInOutReport);
router.get('/get-dashboard-summary', getDashboardSummary);

module.exports = router;
