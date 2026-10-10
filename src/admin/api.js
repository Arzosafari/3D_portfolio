import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (name, email, password) => api.post('/register', { name, email, password }),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const teamMembersAPI = {
  getAll: () => api.get('/team-members'),
  get: (id) => api.get(`/team-members/${id}`),
  create: (data) => api.post('/team-members', data),
  update: (id, data) => api.put(`/team-members/${id}`, data),
  delete: (id) => api.delete(`/team-members/${id}`),
};

export default api;
