const express = require('express');
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  addTask,
  updateTask
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getEmployees)
  .post(protect, authorize('Admin'), createEmployee);

router.route('/:id')
  .put(protect, authorize('Admin'), updateEmployee)
  .delete(protect, authorize('Admin'), deleteEmployee);

router.route('/:id/tasks')
  .post(protect, authorize('Admin'), addTask);

router.route('/:id/tasks/:taskId')
  .put(protect, updateTask);

module.exports = router;
