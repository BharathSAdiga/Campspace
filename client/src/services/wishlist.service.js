import api from './api';

export const wishlistService = {
  /**
   * Fetch current authenticated user's wishlist
   * @returns {Promise<Object>} { data: Array, count: Number }
   */
  async getWishlist() {
    const response = await api.get('/api/wishlist');
    return response.data;
  },

  /**
   * Add a product to the user's wishlist
   * @param {String} productId
   * @returns {Promise<Object>} { data: Array, count: Number, message: String }
   */
  async addToWishlist(productId) {
    const response = await api.post(`/api/wishlist/${productId}`);
    return response.data;
  },

  /**
   * Remove a product from the user's wishlist
   * @param {String} productId
   * @returns {Promise<Object>} { data: Array, count: Number, message: String }
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/api/wishlist/${productId}`);
    return response.data;
  },
};

export default wishlistService;
