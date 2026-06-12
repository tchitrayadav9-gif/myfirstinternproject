const createModel = require('./modelHelper');

const EmployeeSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  skills: [{ type: String }],
  joinDate: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Remote', 'On Leave'], default: 'Active' },
  tasks: [{
    title: { type: String, required: true },
    deadline: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
  }]
};

const defaultEmployees = [
  {
    _id: "seed-emp-chitra",
    name: "T. Chitra Yadav",
    email: "employee@avon.co.in",
    role: "Associate AI Engineer",
    department: "CSE - AIML",
    status: "Active",
    joinDate: "2026-06-01",
    skills: ["React.js", "Python", "Machine Learning", "Tailwind CSS", "Express.js"],
    tasks: [
      { title: "Design Dashboard wireframes", deadline: "2026-06-12", priority: "High", status: "Completed" },
      { title: "Implement Recharts Analytics components", deadline: "2026-06-18", priority: "Medium", status: "In Progress" }
    ]
  },
  {
    _id: "seed-emp-amit",
    name: "Amit Sharma",
    email: "amit.sharma@avon.co.in",
    role: "Senior Mobile Engineer",
    department: "Mobile Apps",
    status: "Active",
    joinDate: "2022-03-15",
    skills: ["React Native", "Flutter", "iOS Development", "Swift", "Dart"],
    tasks: [
      { title: "Optimize Android build size", deadline: "2026-06-25", priority: "High", status: "In Progress" },
      { title: "Fix splash screen layout glitch", deadline: "2026-06-30", priority: "Low", status: "Pending" }
    ]
  },
  {
    _id: "seed-emp-pooja",
    name: "Pooja Hegde",
    email: "pooja.hegde@avon.co.in",
    role: "Frontend UI Specialist",
    department: "Web Development",
    status: "Remote",
    joinDate: "2023-01-10",
    skills: ["React.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript (ES6)"],
    tasks: [
      { title: "Design dashboard layout dark mode", deadline: "2026-06-15", priority: "Medium", status: "Completed" },
      { title: "Integrate Area Charts with backend", deadline: "2026-06-20", priority: "High", status: "In Progress" }
    ]
  },
  {
    _id: "seed-emp-rahul",
    name: "Rahul Deshmukh",
    email: "rahul.d@avon.co.in",
    role: "Lead DevOps Architect",
    department: "Cloud Computing",
    status: "Active",
    joinDate: "2021-08-20",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    tasks: [
      { title: "Configure SSL renewal cron job", deadline: "2026-06-18", priority: "High", status: "In Progress" },
      { title: "Set up multi-region backup", deadline: "2026-07-05", priority: "Medium", status: "Pending" }
    ]
  }
];

module.exports = createModel('Employee', EmployeeSchema, defaultEmployees);
