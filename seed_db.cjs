const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8']);
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('Error: MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

// 1. Define schemas to match backend/models
const EmployeeSchema = new mongoose.Schema({
  employeeId: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  skills: [String],
  joinDate: { type: String, required: true },
  status: { type: String, default: 'Active' },
  tasks: [{
    title: { type: String, required: true },
    deadline: { type: String, required: true },
    priority: { type: String, default: 'Medium' },
    status: { type: String, default: 'Pending' }
  }]
}, { timestamps: true });

const ClientSchema = new mongoose.Schema({
  company: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  projects: { type: Number, default: 0 },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'Backlog' },
  priority: { type: String, default: 'Medium' },
  due: { type: String, required: true }
}, { timestamps: true });

const ScheduleSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  date: { type: String, required: true },
  taskTitle: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  month: { type: String, required: true }
}, { timestamps: true });

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  client: { type: String, required: true },
  poc: { type: String, required: true },
  subject: { type: String, required: true },
  priority: { type: String, default: 'Medium' },
  date: { type: String, required: true },
  status: { type: String, default: 'Open' },
  text: { type: String, required: true },
  replies: [{
    sender: { type: String, required: true },
    senderRole: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Compile models
const Employee = mongoose.model('Employee', EmployeeSchema);
const Client = mongoose.model('Client', ClientSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Schedule = mongoose.model('Schedule', ScheduleSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);

// Data to insert
const defaultEmployees = [
  {
    employeeId: "AVON-EMP-1001",
    name: "T. Chitra Yadav",
    email: "employee@avon.co.in",
    role: "Associate AI Engineer",
    department: "AI Solutions",
    status: "Active",
    joinDate: "2026-06-01",
    skills: ["React.js", "Python", "Machine Learning", "Tailwind CSS", "Express.js"],
    tasks: [
      { title: "Design Dashboard wireframes", deadline: "2026-07-12", priority: "High", status: "Completed" },
      { title: "Implement Recharts Analytics components", deadline: "2026-07-18", priority: "Medium", status: "In Progress" }
    ]
  },
  {
    employeeId: "AVON-EMP-1002",
    name: "Amit Sharma",
    email: "amit.sharma@avon.co.in",
    role: "Senior Mobile Engineer",
    department: "Mobile Apps",
    status: "Active",
    joinDate: "2022-03-15",
    skills: ["React Native", "Flutter", "iOS Development", "Swift", "Dart"],
    tasks: [
      { title: "Optimize Android build size", deadline: "2026-07-25", priority: "High", status: "In Progress" },
      { title: "Fix splash screen layout glitch", deadline: "2026-07-30", priority: "Low", status: "Pending" }
    ]
  },
  {
    employeeId: "AVON-EMP-1003",
    name: "Pooja Hegde",
    email: "pooja.hegde@avon.co.in",
    role: "Frontend UI Specialist",
    department: "Web Development",
    status: "Active",
    joinDate: "2023-01-10",
    skills: ["React.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript (ES6)"],
    tasks: [
      { title: "Design dashboard layout dark mode", deadline: "2026-07-15", priority: "Medium", status: "Completed" },
      { title: "Integrate Area Charts with backend", deadline: "2026-07-20", priority: "High", status: "In Progress" }
    ]
  },
  {
    employeeId: "AVON-EMP-1004",
    name: "Rahul Deshmukh",
    email: "rahul.d@avon.co.in",
    role: "Lead DevOps Architect",
    department: "Cloud Computing",
    status: "Active",
    joinDate: "2021-08-20",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    tasks: [
      { title: "Configure SSL renewal cron job", deadline: "2026-07-18", priority: "High", status: "In Progress" },
      { title: "Set up multi-region backup", deadline: "2026-08-05", priority: "Medium", status: "Pending" }
    ]
  }
];

const defaultClients = [
  {
    company: "TechCorp Inc.",
    contact: "Aditi Rao",
    email: "aditi.r@techcorp.com",
    phone: "+91 80 4910 8274",
    location: "Bangalore, India",
    projects: 3,
    status: "Active"
  },
  {
    company: "FinHealth Corp.",
    contact: "Vikram Sen",
    email: "v.sen@finhealth.in",
    phone: "+91 40 2817 9928",
    location: "Hyderabad, India",
    projects: 2,
    status: "Active"
  },
  {
    company: "EduGlow India",
    contact: "Rajesh Kumar",
    email: "rajesh.k@eduglow.org",
    phone: "+91 44 9827 1029",
    location: "Chennai, India",
    projects: 1,
    status: "Active"
  },
  {
    company: "RetailHub Logistics",
    contact: "Sonia Patel",
    email: "s.patel@retailhub.com",
    phone: "+91 22 2847 9102",
    location: "Mumbai, India",
    projects: 0,
    status: "Active"
  },
  {
    company: "Global Core Apps",
    contact: "David Wright",
    email: "david.w@globalcore.com",
    phone: "+1 650 382 9102",
    location: "San Francisco, USA",
    projects: 2,
    status: "Active"
  }
];

const defaultProjects = [
  {
    name: "Mobile Banking Application",
    client: "FinHealth Corp.",
    progress: 75,
    status: "In Progress",
    priority: "High",
    due: "2026-07-25"
  },
  {
    name: "Smart Portal Frontend",
    client: "Global Core Apps",
    progress: 95,
    status: "In Review",
    priority: "Medium",
    due: "2026-07-10"
  },
  {
    name: "Predictive AI Core Pipeline",
    client: "RetailHub Logistics",
    progress: 45,
    status: "In Progress",
    priority: "High",
    due: "2026-08-02"
  },
  {
    name: "Cloud Migration Strategy",
    client: "EduGlow India",
    progress: 10,
    status: "Backlog",
    priority: "Low",
    due: "2026-09-15"
  },
  {
    name: "Secure SSO Client Module",
    client: "TechCorp Inc.",
    progress: 100,
    status: "Delivered",
    priority: "High",
    due: "2026-06-30"
  }
];

const currentYearMonth = new Date().toISOString().substring(0, 7);

const defaultSchedules = [
  {
    employeeId: "seed-emp-chitra",
    employeeName: "T. Chitra Yadav",
    date: `${currentYearMonth}-10`,
    taskTitle: "Design Dashboard wireframes",
    deadline: `${currentYearMonth}-12`,
    status: "Completed",
    month: currentYearMonth
  },
  {
    employeeId: "seed-emp-chitra",
    employeeName: "T. Chitra Yadav",
    date: `${currentYearMonth}-15`,
    taskTitle: "Implement Recharts Analytics components",
    deadline: `${currentYearMonth}-18`,
    status: "In Progress",
    month: currentYearMonth
  },
  {
    employeeId: "seed-emp-amit",
    employeeName: "Amit Sharma",
    date: `${currentYearMonth}-12`,
    taskTitle: "Android Native Bundle Optimization",
    deadline: `${currentYearMonth}-14`,
    status: "Pending",
    month: currentYearMonth
  },
  {
    employeeId: "seed-emp-pooja",
    employeeName: "Pooja Hegde",
    date: `${currentYearMonth}-18`,
    taskTitle: "Light/Dark CSS styles review",
    deadline: `${currentYearMonth}-20`,
    status: "Pending",
    month: currentYearMonth
  }
];

const defaultTickets = [
  {
    id: "AVON-2041",
    client: "TechCorp Inc.",
    poc: "Aditi Rao",
    subject: "Server connection timeout error during deployment.",
    priority: "High",
    date: "2026-06-03",
    status: "Open",
    text: "We are getting a database connection timeout error on the main API gateway whenever we attempt to run the deployment scripts. Logs show pool exhaustions. Need urgent review.",
    replies: []
  },
  {
    id: "AVON-2039",
    client: "FinHealth Corp.",
    poc: "Vikram Sen",
    subject: "Portal dashboard chart data lagging on Safari.",
    priority: "Medium",
    date: "2026-06-02",
    status: "In Progress",
    text: "The Recharts area graph under the Overview panel is failing to scale correctly on Safari mobile viewport layouts. Looks like custom Flexbox overrides are triggering layout shift warnings.",
    replies: []
  },
  {
    id: "AVON-2035",
    client: "EduGlow India",
    poc: "Rajesh Kumar",
    subject: "SSL certificate expiry warning emails.",
    priority: "Low",
    date: "2026-05-28",
    status: "Resolved",
    text: "We received an automated domain registry alert saying our SSL credentials will expire in 15 days. Need to verify automated certificate renewals on AWS.",
    replies: [
      {
        sender: "Rahul Deshmukh",
        senderRole: "Lead DevOps Architect",
        message: "I verified AWS ACM renewal settings. The SSL updates will execute on 2026-06-05 automatically. I will monitor it.",
        timestamp: new Date("2026-05-29T10:00:00Z")
      }
    ]
  }
];

// Run seeding
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully!');

    // Clear existing collections to start fresh
    console.log('Clearing existing collections...');
    await Employee.deleteMany({});
    await Client.deleteMany({});
    await Project.deleteMany({});
    await Schedule.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Collections cleared.');

    // Insert new seed documents
    console.log('Inserting default employee data...');
    const insertedEmployees = await Employee.insertMany(defaultEmployees);
    console.log(`Inserted ${insertedEmployees.length} employees.`);

    console.log('Inserting default client data...');
    const insertedClients = await Client.insertMany(defaultClients);
    console.log(`Inserted ${insertedClients.length} clients.`);

    console.log('Inserting default project data...');
    const insertedProjects = await Project.insertMany(defaultProjects);
    console.log(`Inserted ${insertedProjects.length} projects.`);

    // Map schedules to dynamic mock employee IDs
    const chitra = insertedEmployees.find(e => e.name.includes('Chitra'));
    const amit = insertedEmployees.find(e => e.name.includes('Amit'));
    const pooja = insertedEmployees.find(e => e.name.includes('Pooja'));

    if (chitra && amit && pooja) {
      defaultSchedules[0].employeeId = chitra._id.toString();
      defaultSchedules[1].employeeId = chitra._id.toString();
      defaultSchedules[2].employeeId = amit._id.toString();
      defaultSchedules[3].employeeId = pooja._id.toString();
    }

    console.log('Inserting default schedule data...');
    const insertedSchedules = await Schedule.insertMany(defaultSchedules);
    console.log(`Inserted ${insertedSchedules.length} schedules.`);

    console.log('Inserting default ticket data...');
    const insertedTickets = await Ticket.insertMany(defaultTickets);
    console.log(`Inserted ${insertedTickets.length} tickets.`);

    console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
