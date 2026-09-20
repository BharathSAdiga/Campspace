import api from './api';

const clubService = {
  /**
   * Get all clubs
   */
  getClubs: async (params = {}) => {
    return await api.get('/api/clubs', { params });
  },

  /**
   * Get club by ID
   */
  getClubById: async (id) => {
    return await api.get(`/api/clubs/${id}`);
  },

  /**
   * Get current user's joined clubs
   */
  getMyClubs: async () => {
    return await api.get('/api/clubs/my-clubs');
  },

  /**
   * Create a new club
   */
  createClub: async (clubData) => {
    return await api.post('/api/clubs', clubData);
  },

  /**
   * Update a club
   */
  updateClub: async (id, clubData) => {
    return await api.put(`/api/clubs/${id}`, clubData);
  },

  /**
   * Delete a club
   */
  deleteClub: async (id) => {
    return await api.delete(`/api/clubs/${id}`);
  },

  /**
   * Join a club
   */
  joinClub: async (id) => {
    return await api.post(`/api/clubs/${id}/join`);
  },

  /**
   * Leave a club
   */
  leaveClub: async (id) => {
    return await api.delete(`/api/clubs/${id}/leave`);
  },
};

export default clubService;
