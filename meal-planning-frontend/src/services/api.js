import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth API
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// Recipe API
export const recipeAPI = {
  getAll: () => api.get('/recipes'),
  create: (recipeData) => api.post('/recipes', recipeData),
  update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  delete: (id) => api.delete(`/recipes/${id}`),
  get: (id) => api.get(`/recipes/${id}`),
};

// Goal API
export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (goalData) => api.post('/goals', goalData),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
  get: (id) => api.get(`/goals/${id}`),
};

// Calendar API
export const calendarAPI = {
  getAll: () => api.get('/calendar'),
  create: (entryData) => api.post('/calendar', entryData),
  update: (id, entryData) => api.put(`/calendar/${id}`, entryData),
  delete: (id) => api.delete(`/calendar/${id}`),
  getDailySummary: (date) => api.get(`/calendar/daily-summary?date=${date}`),
};

// Biometric API
export const biometricAPI = {
  getAll: () => api.get('/biometric'),
  create: (data) => api.post('/biometric', data),
  update: (id, data) => api.put(`/biometric/${id}`, data),
  delete: (id) => api.delete(`/biometric/${id}`),
  getTrends: () => api.get('/biometric/trends'),
};

// Suggestion API
export const suggestionAPI = {
  getSuggestions: () => api.get('/suggestions'),
  getHistory: () => api.get('/suggestions/history'),
  markApplied: (id) => api.post(`/suggestions/${id}/apply`),
};