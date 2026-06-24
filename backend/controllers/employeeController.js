const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');

// Helper to generate a unique employee ID
const generateEmployeeId = async () => {
  const employees = await Employee.find({});
  let maxId = 1000;
  employees.forEach(emp => {
    if (emp.employeeId && emp.employeeId.startsWith('AVON-EMP-')) {
      const numPart = parseInt(emp.employeeId.replace('AVON-EMP-', ''), 10);
      if (!isNaN(numPart) && numPart > maxId) {
        maxId = numPart;
      }
    }
  });
  const nextNum = String(maxId + 1).padStart(4, '0');
  return `AVON-EMP-${nextNum}`;
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error retrieving employee list.' });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
  const { name, email, department, role, skills, joinDate, status } = req.body;

  try {
    if (!name || !email || !department || !role || !joinDate) {
      return res.status(400).json({ message: 'Missing required employee fields.' });
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'An employee with this email is already registered.' });
    }

    // Auto-generate employeeId
    const employeeId = await generateEmployeeId();

    // Auto-generate secure temporary password
    const tempPassword = `Avon@${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Hash temporary password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create corresponding User credentials record
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Employee',
      department,
      employeeId,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'
    });

    // Create Employee profile
    const employee = await Employee.create({
      employeeId,
      name,
      email,
      department,
      role,
      skills: skills || [],
      joinDate,
      status: status || 'Active',
      tasks: []
    });

    res.status(201).json({
      employee,
      tempPassword
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error registering new employee.' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  const { name, email, department, role, skills, joinDate, status } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }

    const oldEmail = employee.email;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: name || employee.name,
        email: email || employee.email,
        department: department || employee.department,
        role: role || employee.role,
        skills: skills || employee.skills,
        joinDate: joinDate || employee.joinDate,
        status: status || employee.status
      },
      { new: true }
    );

    // Sync with User collection
    const user = await User.findOne({ email: oldEmail });
    if (user) {
      await User.findByIdAndUpdate(user._id || user.id, {
        name: name || employee.name,
        email: email || employee.email,
        department: department || employee.department
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error updating employee details.' });
  }
};

// @desc    Delete employee (Revoke)
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }

    // Delete corresponding User credentials record
    const user = await User.findOne({ email: employee.email });
    if (user) {
      await User.findByIdAndDelete(user._id || user.id);
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee credentials and record revoked successfully.' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error revoking employee.' });
  }
};

// @desc    Assign task to employee
// @route   POST /api/employees/:id/tasks
// @access  Private/Admin
const addTask = async (req, res) => {
  const { title, deadline, priority } = req.body;

  try {
    if (!title || !deadline) {
      return res.status(400).json({ message: 'Please provide task title and deadline.' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }

    const newTask = {
      title,
      deadline,
      priority: priority || 'Medium',
      status: 'Pending'
    };

    // Push task to tasks array
    const tasks = [...(employee.tasks || []), newTask];
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { tasks },
      { new: true }
    );

    res.status(201).json(updated);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Server error assigning task.' });
  }
};

// @desc    Update employee task status/details
// @route   PUT /api/employees/:id/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
  const { title, deadline, priority, status } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }

    const tasks = (employee.tasks || []).map(task => {
      // JSON db uses _id, Mongo uses ObjectIds
      const currentTaskId = String(task._id || task.id);
      if (currentTaskId === req.params.taskId) {
        return {
          ...task,
          title: title !== undefined ? title : task.title,
          deadline: deadline !== undefined ? deadline : task.deadline,
          priority: priority !== undefined ? priority : task.priority,
          status: status !== undefined ? status : task.status
        };
      }
      return task;
    });

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { tasks },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task details.' });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  addTask,
  updateTask
};
