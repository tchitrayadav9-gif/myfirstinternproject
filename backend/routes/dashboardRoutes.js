const express = require('express');
const { getDashboardStats, getDashboardCharts } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/charts', protect, getDashboardCharts);

module.exports = router;
