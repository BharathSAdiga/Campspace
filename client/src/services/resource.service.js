import api from './api';

const resourceService = {
  /**
   * Get all resources
   */
  getResources: async (params = {}) => {
    return await api.get('/api/resources', { params });
  },

  /**
   * Get resource by ID
   */
  getResourceById: async (id) => {
    return await api.get(`/api/resources/${id}`);
  },

  /**
   * Create a new resource
   */
  createResource: async (resourceData) => {
    return await api.post('/api/resources', resourceData);
  },

  /**
   * Update a resource
   */
  updateResource: async (id, resourceData) => {
    return await api.put(`/api/resources/${id}`, resourceData);
  },

  /**
   * Delete a resource
   */
  deleteResource: async (id) => {
    return await api.delete(`/api/resources/${id}`);
  },
};

export default resourceService;
