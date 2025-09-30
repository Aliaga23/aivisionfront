import api from './api';

export const residentsService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, active_only = true } = params;
    const response = await api.get(`/residents?skip=${skip}&limit=${limit}&active_only=${active_only}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/residents/${id}`);
    return response.data;
  },

  create: async (residentData) => {
    const response = await api.post('/residents', residentData);
    return response.data;
  },

  update: async (id, residentData) => {
    const response = await api.put(`/residents/${id}`, residentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/residents/${id}`);
    return response.data;
  }
};