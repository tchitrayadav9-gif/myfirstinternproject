const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Schedule = require('../models/Schedule');

// @desc    Get consolidated dashboard metrics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const [employees, clients, projects, schedules] = await Promise.all([
      Employee.find({}),
      Client.find({}),
      Project.find({}),
      Schedule.find({})
    ]);

    const todayStr = new Date().toISOString().split('T')[0];

    // Compute tasks counts
    let pendingTasks = 0;
    let completedTasks = 0;
    employees.forEach(emp => {
      (emp.tasks || []).forEach(task => {
        if (task.status === 'Completed') {
          completedTasks++;
        } else {
          pendingTasks++;
        }
      });
    });

    // Compute today's schedules
    const todaySchedules = schedules.filter(s => s.date === todayStr).length;

    res.json({
      totalEmployees: employees.length,
      totalClients: clients.length,
      totalProjects: projects.length,
      pendingTasks,
      completedTasks,
      todaySchedules
    });
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard stats.' });
  }
};

// @desc    Get consolidated analytics chart data
// @route   GET /api/dashboard/charts
// @access  Private
const getDashboardCharts = async (req, res) => {
  try {
    const [employees, projects] = await Promise.all([
      Employee.find({}),
      Project.find({})
    ]);

    // 1. Employee Distribution by Department (Frontend, Backend, QA, HR, UI/UX, CRM, ERP)
    const departmentsMap = {
      'Frontend': 0,
      'Backend': 0,
      'QA': 0,
      'HR': 0,
      'UI/UX': 0,
      'CRM': 0,
      'ERP': 0
    };

    employees.forEach(emp => {
      const dept = (emp.department || '').toLowerCase();
      if (dept.includes('frontend') || dept.includes('web')) {
        departmentsMap['Frontend']++;
      } else if (dept.includes('backend') || dept.includes('aiml') || dept.includes('cse') || dept.includes('cloud') || dept.includes('devops') || dept.includes('mobile')) {
        departmentsMap['Backend']++;
      } else if (dept.includes('qa') || dept.includes('test') || dept.includes('quality')) {
        departmentsMap['QA']++;
      } else if (dept.includes('hr') || dept.includes('human') || dept.includes('talent')) {
        departmentsMap['HR']++;
      } else if (dept.includes('ui') || dept.includes('ux') || dept.includes('design')) {
        departmentsMap['UI/UX']++;
      } else if (dept.includes('crm')) {
        departmentsMap['CRM']++;
      } else if (dept.includes('erp')) {
        departmentsMap['ERP']++;
      } else {
        // Round robin or default fallbacks
        departmentsMap['Frontend']++;
      }
    });

    const employeeDistribution = Object.keys(departmentsMap).map(name => ({
      name,
      value: departmentsMap[name]
    }));

    // 2. Monthly Tasks Completed (January - June)
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTasksMap = { 'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0 };

    employees.forEach(emp => {
      (emp.tasks || []).forEach(task => {
        if (task.status === 'Completed' && task.deadline) {
          const parts = task.deadline.split('-');
          if (parts.length >= 2) {
            const monthIdx = parseInt(parts[1], 10) - 1;
            if (monthIdx >= 0 && monthIdx < 6) {
              const mName = monthsName[monthIdx];
              monthlyTasksMap[mName]++;
            }
          }
        }
      });
    });

    const monthlyTasksCompleted = monthsName.map(name => ({
      name,
      Tasks: monthlyTasksMap[name]
    }));

    // 3. Projects Completed Per Month (January - June)
    const monthlyProjectsMap = { 'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0 };

    projects.forEach(proj => {
      if ((proj.status === 'Delivered' || proj.progress === 100) && proj.due) {
        const parts = proj.due.split('-');
        if (parts.length >= 2) {
          const monthIdx = parseInt(parts[1], 10) - 1;
          if (monthIdx >= 0 && monthIdx < 6) {
            const mName = monthsName[monthIdx];
            monthlyProjectsMap[mName]++;
          }
        }
      }
    });

    const projectsCompleted = monthsName.map(name => ({
      name,
      Completed: monthlyProjectsMap[name]
    }));

    // 4. Monthly Employee Productivity (Area Chart)
    // Formula: Total completed tasks per month * 10 (productivity index)
    const monthlyProductivity = monthsName.map(name => ({
      name,
      Productivity: (monthlyTasksMap[name] || 0) * 10 || 15 // min fallback index for styling if empty
    }));

    res.json({
      employeeDistribution,
      monthlyTasksCompleted,
      projectsCompleted,
      monthlyProductivity
    });
  } catch (error) {
    console.error('Error calculating dashboard charts:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard charts.' });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardCharts
};
