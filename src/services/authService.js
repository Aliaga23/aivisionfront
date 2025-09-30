import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get('/auth/roles');
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await api.post('/auth/roles', roleData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};