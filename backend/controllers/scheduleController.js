const Schedule = require('../models/Schedule');
const Employee = require('../models/Employee');

// @desc    Get monthly schedules
// @route   GET /api/schedules
// @access  Private
const getSchedules = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      // Admin gets all schedules
      const schedules = await Schedule.find({});
      return res.json(schedules);
    } else {
      // Employee gets only their own schedules matching their employee record email
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee) {
        return res.json([]);
      }
      const employeeId = String(employee._id || employee.id);
      const schedules = await Schedule.find({ employeeId });
      return res.json(schedules);
    }
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error retrieving schedules.' });
  }
};

// @desc    Create schedule entry
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
  const { employeeId, date, taskTitle, deadline, status } = req.body;

  try {
    if (!employeeId || !date || !taskTitle || !deadline) {
      return res.status(400).json({ message: 'Missing required schedule fields.' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }

    // Extract YYYY-MM month from date (YYYY-MM-DD)
    const month = date.substring(0, 7);

    const schedule = await Schedule.create({
      employeeId,
      employeeName: employee.name,
      date,
      taskTitle,
      deadline,
      status: status || 'Pending',
      month
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server error creating schedule entry.' });
  }
};

// @desc    Update schedule entry
// @route   PUT /api/schedules/:id
// @access  Private
const updateSchedule = async (req, res) => {
  const { date, taskTitle, deadline, status } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found.' });
    }

    // Authorization: Employees can only update status
    if (req.user.role !== 'Admin') {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee || String(employee._id || employee.id) !== String(schedule.employeeId)) {
        return res.status(403).json({ message: 'Forbidden: You cannot modify another employee\'s schedule.' });
      }

      // Employee can only update status
      const updated = await Schedule.findByIdAndUpdate(
        req.params.id,
        { status: status || schedule.status },
        { new: true }
      );
      return res.json(updated);
    }

    // Admin can update everything
    const month = date ? date.substring(0, 7) : schedule.month;
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      {
        date: date || schedule.date,
        taskTitle: taskTitle || schedule.taskTitle,
        deadline: deadline || schedule.deadline,
        status: status || schedule.status,
        month
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server error updating schedule.' });
  }
};

// @desc    Delete schedule entry
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found.' });
    }

    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule task removed successfully.' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Server error deleting schedule.' });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
