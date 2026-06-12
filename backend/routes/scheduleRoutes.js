const express = require('express');
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getSchedules)
  .post(protect, authorize('Admin'), createSchedule);

router.route('/:id')
  .put(protect, updateSchedule)
  .delete(protect, authorize('Admin'), deleteSchedule);

module.exports = router;
