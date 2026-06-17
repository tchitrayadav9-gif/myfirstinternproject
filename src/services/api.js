import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to inject Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('avon_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password, role) => {
    const response = await API.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  loginGoogle: async (payload) => {
    const response = await API.post('/auth/google', payload);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  }
};

export const employeeService = {
  getAll: async () => {
    const response = await API.get('/employees');
    return response.data;
  },
  create: async (data) => {
    const response = await API.post('/employees', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await API.put(`/employees/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/employees/${id}`);
    return response.data;
  },
  addTask: async (employeeId, taskData) => {
    const response = await API.post(`/employees/${employeeId}/tasks`, taskData);
    return response.data;
  },
  updateTask: async (employeeId, taskId, taskData) => {
    const response = await API.put(`/employees/${employeeId}/tasks/${taskId}`, taskData);
    return response.data;
  }
};

export const clientService = {
  getAll: async () => {
    const response = await API.get('/clients');
    return response.data;
  },
  create: async (data) => {
    const response = await API.post('/clients', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await API.put(`/clients/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/clients/${id}`);
    return response.data;
  }
};

export const projectService = {
  getAll: async () => {
    const response = await API.get('/projects');
    return response.data;
  },
  create: async (data) => {
    const response = await API.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await API.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  }
};

export const ticketService = {
  getAll: async () => {
    const response = await API.get('/tickets');
    return response.data;
  },
  create: async (data) => {
    const response = await API.post('/tickets', data);
    return response.data;
  },
  resolve: async (id) => {
    const response = await API.put(`/tickets/${id}/resolve`);
    return response.data;
  },
  reply: async (id, message) => {
    const response = await API.post(`/tickets/${id}/reply`, { message });
    return response.data;
  }
};

export const scheduleService = {
  getAll: async () => {
    const response = await API.get('/schedules');
    return response.data;
  },
  create: async (data) => {
    const response = await API.post('/schedules', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await API.put(`/schedules/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/schedules/${id}`);
    return response.data;
  }
};

export default API;
