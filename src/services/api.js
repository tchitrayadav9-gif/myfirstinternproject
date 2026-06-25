import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

// Create Axios client instance pointing to Express server API gateway
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure Axios Request interceptor to dynamically inject the session JWT token 
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

// --- Authentication & Session Cloud Services ---
export const authService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },
  updateProfile: async (name, avatarUrl) => {
    const res = await API.put('/auth/profile', { name, avatarUrl });
    return res.data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await API.put('/auth/password', { currentPassword, newPassword });
    return res.data;
  },
  getDashboardStats: async () => {
    const res = await API.get('/auth/dashboard-stats');
    return res.data;
  }
};

// --- Employee Directory Cloud Services ---
export const employeeService = {
  getAll: async () => {
    const res = await API.get('/employees');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/employees', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/employees/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/employees/${id}`);
    return res.data;
  },
  addTask: async (employeeId, taskData) => {
    const res = await API.post(`/employees/${employeeId}/tasks`, taskData);
    return res.data;
  },
  updateTask: async (employeeId, taskId, taskData) => {
    const res = await API.put(`/employees/${employeeId}/tasks/${taskId}`, taskData);
    return res.data;
  }
};

// --- Client Account Management Cloud Services ---
export const clientService = {
  getAll: async () => {
    const res = await API.get('/clients');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/clients', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/clients/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/clients/${id}`);
    return res.data;
  }
};

// --- Enterprise Project Tracker Cloud Services ---
export const projectService = {
  getAll: async () => {
    const res = await API.get('/projects');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/projects', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/projects/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/projects/${id}`);
    return res.data;
  }
};

// --- Helpdesk Support Ticketing Cloud Services ---
export const ticketService = {
  getAll: async () => {
    const res = await API.get('/tickets');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/tickets', data);
    return res.data;
  },
  resolve: async (id) => {
    const res = await API.put(`/tickets/${id}/resolve`);
    return res.data;
  },
  reply: async (id, message) => {
    const res = await API.post(`/tickets/${id}/reply`, { message });
    return res.data;
  }
};

// --- Sprint Schedule Calendar Cloud Services ---
export const scheduleService = {
  getAll: async () => {
    const res = await API.get('/schedules');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/schedules', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/schedules/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/schedules/${id}`);
    return res.data;
  }
};

// --- Contact Form & Admin Notification Bell Cloud Services ---
export const contactService = {
  submit: async (data) => {
    const res = await API.post('/contact', data);
    return res.data;
  },
  getAll: async () => {
    const res = await API.get('/contact');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await API.put(`/contact/${id}/read`);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/contact/${id}`);
    return res.data;
  }
};
