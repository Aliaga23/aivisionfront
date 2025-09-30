import api from './api';

export const vehiclesService = {
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, active_only = true } = params;
    const response = await api.get(`/vehicles?skip=${skip}&limit=${limit}&active_only=${active_only}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  update: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  getByLicensePlate: async (licensePlate) => {
    const response = await api.get(`/vehicles/license/${licensePlate}`);
    return response.data;
  },

  getByResident: async (residentId) => {
    const response = await api.get(`/vehicles/resident/${residentId}`);
    return response.data;
  },

  getByVisitor: async (visitorId) => {
    const response = await api.get(`/vehicles/visitor/${visitorId}`);
    return response.data;
  }
};