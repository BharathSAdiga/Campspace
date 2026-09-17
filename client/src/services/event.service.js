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

  /**
   * Register authenticated student for an event
   * @param {String} id
   * @returns {Promise<Object>}
   */
  async register(id) {
    return await api.post(`/api/events/${id}/register`);
  },

  /**
   * Cancel authenticated student's event registration
   * @param {String} id
   * @returns {Promise<Object>}
   */
  async cancelRegistration(id) {
    return await api.delete(`/api/events/${id}/register`);
  },

  /**
   * Create a new campus event (Organizer or Admin)
   * @param {Object} data
   * @returns {Promise<Object>} { success, data, message }
   */
  async createEvent(data) {
    return await api.post('/api/events', data);
  },

  /**
   * Update an existing event (Event Owner or Admin)
   * @param {String} id
   * @param {Object} data
   * @returns {Promise<Object>} { success, data, message }
   */
  async updateEvent(id, data) {
    return await api.put(`/api/events/${id}`, data);
  },

  /**
   * Fetch events organized by the authenticated user
   * @param {Object} params - { status, sort }
   * @returns {Promise<Object>} { success, count, data }
   */
  async getMyEvents(params = {}) {
    return await api.get('/api/events/my-events', { params });
  },

  /**
   * Fetch registrations / attendee list for an event (Owner or Admin)
   * @param {String} id
   * @returns {Promise<Object>} { success, eventId, eventTitle, count, maximumParticipants, data }
   */
  async getRegistrations(id) {
    return await api.get(`/api/events/${id}/registrations`);
  },

  /**
   * Permanently delete an event and its registrations (Owner or Admin)
   * @param {String} id
   * @returns {Promise<Object>} { success, message }
   */
  async deleteEvent(id) {
    return await api.delete(`/api/events/${id}`);
  },
};

export default eventService;
