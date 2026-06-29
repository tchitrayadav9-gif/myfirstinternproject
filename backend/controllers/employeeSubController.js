const Employee = require('../models/Employee');
const Schedule = require('../models/Schedule');

// @desc    Get current employee's tasks
// @route   GET /api/employee/tasks
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email.toLowerCase() });
    if (!employee) {
      return res.json([]);
    }
    res.json(employee.tasks || []);
  } catch (error) {
    console.error('Error fetching employee tasks:', error);
    res.status(500).json({ message: 'Server error retrieving your tasks.' });
  }
};

// @desc    Get current employee's schedules
// @route   GET /api/employee/schedule
// @access  Private
const getMySchedule = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email.toLowerCase() });
    if (!employee) {
      return res.json([]);
    }
    const schedules = await Schedule.find({ employeeId: String(employee._id || employee.id) });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching employee schedule:', error);
    res.status(500).json({ message: 'Server error retrieving your schedule.' });
  }
};

module.exports = {
  getMyTasks,
  getMySchedule
};
