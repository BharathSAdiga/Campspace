import api from './api';

export const eventService = {
  /**
   * Fetch paginated and filtered campus events
   * @param {Object} params - { search, category, status, startDate, endDate, sort, page, limit }
   * @returns {Promise<Object>} { success, count, total, pagination, data }
   */
  async getEvents(params = {}) {
    return await api.get('/api/events', { params });
  },

  /**
   * Fetch single event details by ID
   * @param {String} id
   * @returns {Promise<Object>} { success, data }
   */
  async getEventById(id) {
    return await api.get(`/api/events/${id}`);
  },
};

export default eventService;
