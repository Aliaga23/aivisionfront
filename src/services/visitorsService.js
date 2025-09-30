import api from './api';

export const visitorsService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, active_only = true } = params;
    const response = await api.get(`/visitors?skip=${skip}&limit=${limit}&active_only=${active_only}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/visitors/${id}`);
    return response.data;
  },

  create: async (visitorData) => {
    const response = await api.post('/visitors', visitorData);
    return response.data;
  },

  update: async (id, visitorData) => {
    const response = await api.put(`/visitors/${id}`, visitorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/visitors/${id}`);
    return response.data;
  },

  createVisit: async (visitData) => {
    const response = await api.post('/visitors/visits', visitData);
    return response.data;
  },

  updateVisit: async (visitId, visitData) => {
    const response = await api.put(`/visitors/visits/${visitId}`, visitData);
    return response.data;
  },

  getVisits: async (params = {}) => {
    const { skip = 0, limit = 100 } = params;
    const response = await api.get(`/visitors/visits?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getVisitById: async (visitId) => {
    const response = await api.get(`/visitors/visits/${visitId}`);
    return response.data;
  }
};