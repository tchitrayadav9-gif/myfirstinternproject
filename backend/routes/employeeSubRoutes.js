const express = require('express');
const { getMyTasks, getMySchedule } = require('../controllers/employeeSubController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/tasks', protect, getMyTasks);
router.get('/schedule', protect, getMySchedule);

module.exports = router;
