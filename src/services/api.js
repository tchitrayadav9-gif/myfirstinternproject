import axios from 'axios';

// Keeping the original axios instance just in case any file imports default API,
// but all active calls will go through the client-side localStorage service implementation.
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;

// --- client-side database mock seeding ---

const defaultUsers = [];

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

const defaultClients = [
  {
    _id: "seed-client-techcorp",
    company: "TechCorp Inc.",
    contact: "Aditi Rao",
    email: "aditi.r@techcorp.com",
    phone: "+91 80 4910 8274",
    location: "Bangalore, India",
    projects: 3,
    status: "Active"
  },
  {
    _id: "seed-client-finhealth",
    company: "FinHealth Corp.",
    contact: "Vikram Sen",
    email: "v.sen@finhealth.in",
    phone: "+91 40 2817 9928",
    location: "Hyderabad, India",
    projects: 2,
    status: "Active"
  },
  {
    _id: "seed-client-eduglow",
    company: "EduGlow India",
    contact: "Rajesh Kumar",
    email: "rajesh.k@eduglow.org",
    phone: "+91 44 9827 1029",
    location: "Chennai, India",
    projects: 1,
    status: "Active"
  },
  {
    _id: "seed-client-retailhub",
    company: "RetailHub Logistics",
    contact: "Sonia Patel",
    email: "s.patel@retailhub.com",
    phone: "+91 22 2847 9102",
    location: "Mumbai, India",
    projects: 0,
    status: "Contract Review"
  },
  {
    _id: "seed-client-globalcore",
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
    _id: "seed-proj-mobile",
    name: "Mobile Banking Application",
    client: "Federal FinCo",
    progress: 75,
    status: "In Progress",
    priority: "High",
    due: "2026-06-25"
  },
  {
    _id: "seed-proj-portal",
    name: "Smart Portal Frontend",
    client: "Avon Technologies",
    progress: 95,
    status: "In Review",
    priority: "Medium",
    due: "2026-06-10"
  },
  {
    _id: "seed-proj-ai",
    name: "Predictive AI Core Pipeline",
    client: "RetailHub India",
    progress: 45,
    status: "In Progress",
    priority: "High",
    due: "2026-07-02"
  },
  {
    _id: "seed-proj-cloud",
    name: "Cloud Migration Strategy",
    client: "EduGlow Systems",
    progress: 10,
    status: "Backlog",
    priority: "Low",
    due: "2026-08-15"
  },
  {
    _id: "seed-proj-sso",
    name: "Secure SSO Client Module",
    client: "TechCorp Inc.",
    progress: 100,
    status: "Delivered",
    priority: "High",
    due: "2026-05-30"
  },
  {
    _id: "seed-proj-ecommerce",
    name: "E-Commerce Web Portal",
    client: "Zest Retailers",
    progress: 100,
    status: "Delivered",
    priority: "Medium",
    due: "2026-05-15"
  }
];

const defaultTickets = [
  {
    _id: "seed-ticket-1",
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
    _id: "seed-ticket-2",
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
    _id: "seed-ticket-3",
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

const currentYearMonth = new Date().toISOString().substring(0, 7);
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

// --- LocalStorage helpers ---
const loadStorage = (key, defaultData) => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(val);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
};

const saveStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Client-Side API Services implementations ---

export const authService = {
  login: async (email, password) => {
    const users = loadStorage('avon_users', defaultUsers);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw { response: { data: { message: 'Invalid credentials. User not found.' } } };
    }
    if (user.password !== password) {
      throw { response: { data: { message: 'Invalid credentials. Password incorrect.' } } };
    }
    const token = 'fake-jwt-token-' + user._id;
    localStorage.setItem('avon_current_user_email', user.email);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'Operations',
      avatarUrl: user.avatarUrl,
      token
    };
  },
  register: async (name, email, password, role) => {
    const users = loadStorage('avon_users', defaultUsers);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw { response: { data: { message: 'Corporate email is already registered.' } } };
    }
    const newUser = {
      _id: 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      email,
      password,
      role,
      department: role === 'Admin' ? 'Operations & IT' : 'Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'
    };
    users.push(newUser);
    saveStorage('avon_users', users);
    const token = 'fake-jwt-token-' + newUser._id;
    localStorage.setItem('avon_current_user_email', newUser.email);
    return {
      ...newUser,
      token
    };
  },
  loginGoogle: async (payload) => {
    const users = loadStorage('avon_users', defaultUsers);
    let user = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!user) {
      throw { response: { data: { message: 'This Google account is not registered. Please Sign Up first to create your corporate credentials.' } } };
    }
    // Link googleId if not already linked
    if (!user.googleId) {
      user.googleId = payload.googleId;
      if (payload.avatarUrl) {
        user.avatarUrl = payload.avatarUrl;
      }
      saveStorage('avon_users', users);
    }
    const token = 'fake-jwt-token-' + user._id;
    localStorage.setItem('avon_current_user_email', user.email);
    return {
      ...user,
      token
    };
  },
  getCurrentUser: async () => {
    const email = localStorage.getItem('avon_current_user_email');
    if (!email) throw new Error('No active session.');
    const users = loadStorage('avon_users', defaultUsers);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('User not found.');
    return user;
  }
};

export const employeeService = {
  getAll: async () => {
    return loadStorage('avon_employees', defaultEmployees);
  },
  create: async (data) => {
    const employees = loadStorage('avon_employees', defaultEmployees);
    const newEmp = {
      _id: 'emp-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...data,
      tasks: data.tasks || []
    };
    employees.push(newEmp);
    saveStorage('avon_employees', employees);
    return newEmp;
  },
  update: async (id, data) => {
    const employees = loadStorage('avon_employees', defaultEmployees);
    const idx = employees.findIndex(e => String(e._id || e.id) === String(id));
    if (idx === -1) throw new Error('Employee not found');
    employees[idx] = { ...employees[idx], ...data };
    saveStorage('avon_employees', employees);
    return employees[idx];
  },
  delete: async (id) => {
    const employees = loadStorage('avon_employees', defaultEmployees);
    const filtered = employees.filter(e => String(e._id || e.id) !== String(id));
    saveStorage('avon_employees', filtered);
    return { message: 'Employee credentials and record revoked successfully.' };
  },
  addTask: async (employeeId, taskData) => {
    const employees = loadStorage('avon_employees', defaultEmployees);
    const idx = employees.findIndex(e => String(e._id || e.id) === String(employeeId));
    if (idx === -1) throw new Error('Employee not found');
    const newTask = {
      _id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...taskData,
      status: taskData.status || 'Pending'
    };
    employees[idx].tasks = [...(employees[idx].tasks || []), newTask];
    saveStorage('avon_employees', employees);
    return employees[idx];
  },
  updateTask: async (employeeId, taskId, taskData) => {
    const employees = loadStorage('avon_employees', defaultEmployees);
    const idx = employees.findIndex(e => String(e._id || e.id) === String(employeeId));
    if (idx === -1) throw new Error('Employee not found');
    employees[idx].tasks = (employees[idx].tasks || []).map(task => {
      if (String(task._id || task.id) === String(taskId)) {
        return { ...task, ...taskData };
      }
      return task;
    });
    saveStorage('avon_employees', employees);
    return employees[idx];
  }
};

export const clientService = {
  getAll: async () => {
    return loadStorage('avon_clients', defaultClients);
  },
  create: async (data) => {
    const clients = loadStorage('avon_clients', defaultClients);
    const newClient = {
      _id: 'client-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...data
    };
    clients.push(newClient);
    saveStorage('avon_clients', clients);
    return newClient;
  },
  update: async (id, data) => {
    const clients = loadStorage('avon_clients', defaultClients);
    const idx = clients.findIndex(c => String(c._id || c.id) === String(id));
    if (idx === -1) throw new Error('Client not found');
    clients[idx] = { ...clients[idx], ...data };
    saveStorage('avon_clients', clients);
    return clients[idx];
  },
  delete: async (id) => {
    const clients = loadStorage('avon_clients', defaultClients);
    const filtered = clients.filter(c => String(c._id || c.id) !== String(id));
    saveStorage('avon_clients', filtered);
    return { message: 'Client deleted successfully.' };
  }
};

export const projectService = {
  getAll: async () => {
    return loadStorage('avon_projects', defaultProjects);
  },
  create: async (data) => {
    const projects = loadStorage('avon_projects', defaultProjects);
    const newProj = {
      _id: 'proj-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...data
    };
    projects.push(newProj);
    saveStorage('avon_projects', projects);
    return newProj;
  },
  update: async (id, data) => {
    const projects = loadStorage('avon_projects', defaultProjects);
    const idx = projects.findIndex(p => String(p._id || p.id) === String(id));
    if (idx === -1) throw new Error('Project not found');
    projects[idx] = { ...projects[idx], ...data };
    saveStorage('avon_projects', projects);
    return projects[idx];
  },
  delete: async (id) => {
    const projects = loadStorage('avon_projects', defaultProjects);
    const filtered = projects.filter(p => String(p._id || p.id) !== String(id));
    saveStorage('avon_projects', filtered);
    return { message: 'Project deleted successfully.' };
  }
};

export const ticketService = {
  getAll: async () => {
    return loadStorage('avon_tickets', defaultTickets);
  },
  create: async (data) => {
    const tickets = loadStorage('avon_tickets', defaultTickets);
    const newTicket = {
      _id: 'ticket-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      id: 'AVON-' + (2000 + tickets.length + 1),
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      replies: [],
      ...data
    };
    tickets.push(newTicket);
    saveStorage('avon_tickets', tickets);
    return newTicket;
  },
  resolve: async (id) => {
    const tickets = loadStorage('avon_tickets', defaultTickets);
    const idx = tickets.findIndex(t => String(t._id || t.id) === String(id));
    if (idx === -1) throw new Error('Ticket not found');
    tickets[idx].status = 'Resolved';
    saveStorage('avon_tickets', tickets);
    return tickets[idx];
  },
  reply: async (id, message) => {
    const tickets = loadStorage('avon_tickets', defaultTickets);
    const idx = tickets.findIndex(t => String(t._id || t.id) === String(id));
    if (idx === -1) throw new Error('Ticket not found');
    const newReply = {
      sender: 'System User',
      senderRole: 'User',
      message,
      timestamp: new Date().toISOString()
    };
    tickets[idx].replies = [...(tickets[idx].replies || []), newReply];
    saveStorage('avon_tickets', tickets);
    return tickets[idx];
  }
};

export const scheduleService = {
  getAll: async () => {
    return loadStorage('avon_schedules', defaultSchedules);
  },
  create: async (data) => {
    const schedules = loadStorage('avon_schedules', defaultSchedules);
    const newSch = {
      _id: 'sched-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...data,
      month: data.date.substring(0, 7)
    };
    schedules.push(newSch);
    saveStorage('avon_schedules', schedules);
    return newSch;
  },
  update: async (id, data) => {
    const schedules = loadStorage('avon_schedules', defaultSchedules);
    const idx = schedules.findIndex(s => String(s._id || s.id) === String(id));
    if (idx === -1) throw new Error('Schedule not found');
    schedules[idx] = { ...schedules[idx], ...data, month: (data.date || schedules[idx].date).substring(0, 7) };
    saveStorage('avon_schedules', schedules);
    return schedules[idx];
  },
  delete: async (id) => {
    const schedules = loadStorage('avon_schedules', defaultSchedules);
    const filtered = schedules.filter(s => String(s._id || s.id) !== String(id));
    saveStorage('avon_schedules', filtered);
    return { message: 'Schedule deleted successfully.' };
  }
};
