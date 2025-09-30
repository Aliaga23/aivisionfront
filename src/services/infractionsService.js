import api from './api';

export const infractionsService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100 } = params;
    const response = await api.get(`/infractions?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/infractions/${id}`);
    return response.data;
  },

  create: async (infractionData) => {
    const response = await api.post('/infractions', infractionData);
    return response.data;
  },

  update: async (id, infractionData) => {
    const response = await api.put(`/infractions/${id}`, infractionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/infractions/${id}`);
    return response.data;
  },

  getInfractionTypes: async () => {
    const response = await api.get('/infractions/types');
    return response.data;
  },

  createInfractionType: async (typeData) => {
    const response = await api.post('/infractions/types', typeData);
    return response.data;
  },

  addEvidence: async (infractionId, evidenceData) => {
    const response = await api.post(`/infractions/${infractionId}/evidence`, evidenceData);
    return response.data;
  },

  getEvidence: async (infractionId) => {
    const response = await api.get(`/infractions/${infractionId}/evidence`);
    return response.data;
  }
};