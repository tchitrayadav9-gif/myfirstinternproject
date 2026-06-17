const createModel = require('./modelHelper');

const ScheduleSchema = {
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  taskTitle: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  month: { type: String, required: true } // Format: YYYY-MM
};

// Seed schedule events for the current year-month
const currentYearMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-06"
const prevYearMonth = new Date().toISOString().substring(0, 7);

const defaultSchedules = [
  {
    _id: "seed-sched-chitra-1",
    employeeId: "seed-emp-chitra",
    employeeName: "T. Chitra Yadav",
    date: `${currentYearMonth}-10`,
    taskTitle: "Design Dashboard wireframes",
    deadline: `${currentYearMonth}-12`,
    status: "Completed",
    month: currentYearMonth
  },
  {
    _id: "seed-sched-chitra-2",
    employeeId: "seed-emp-chitra",
    employeeName: "T. Chitra Yadav",
    date: `${currentYearMonth}-15`,
    taskTitle: "Implement Recharts Analytics components",
    deadline: `${currentYearMonth}-18`,
    status: "In Progress",
    month: currentYearMonth
  },
  {
    _id: "seed-sched-amit",
    employeeId: "seed-emp-amit",
    employeeName: "Amit Sharma",
    date: `${currentYearMonth}-12`,
    taskTitle: "Android Native Bundle Optimization",
    deadline: `${currentYearMonth}-14`,
    status: "Pending",
    month: currentYearMonth
  },
  {
    _id: "seed-sched-pooja",
    employeeId: "seed-emp-pooja",
    employeeName: "Pooja Hegde",
    date: `${currentYearMonth}-18`,
    taskTitle: "Light/Dark CSS styles review",
    deadline: `${currentYearMonth}-20`,
    status: "Pending",
    month: currentYearMonth
  }
];

module.exports = createModel('Schedule', ScheduleSchema, defaultSchedules);
