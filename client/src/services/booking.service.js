import api from './api';

const bookingService = {
  /**
   * Get all bookings (admin/organizer)
   */
  getAllBookings: async (params = {}) => {
    return await api.get('/api/bookings', { params });
  },

  /**
   * Get current user's bookings
   */
  getMyBookings: async () => {
    return await api.get('/api/bookings/my');
  },

  /**
   * Create a new booking
   */
  createBooking: async (bookingData) => {
    return await api.post('/api/bookings', bookingData);
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (id) => {
    return await api.patch(`/api/bookings/${id}/cancel`);
  },

  /**
   * Approve a booking (admin/organizer)
   */
  approveBooking: async (id) => {
    return await api.patch(`/api/bookings/${id}/approve`);
  },

  /**
   * Reject a booking (admin/organizer)
   */
  rejectBooking: async (id) => {
    return await api.patch(`/api/bookings/${id}/reject`);
  },
};

export default bookingService;
