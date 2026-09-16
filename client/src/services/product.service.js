import api from './api';

export const productService = {
  /**
   * Fetch paginated and filtered marketplace product listings
   * @param {Object} params - { search, category, condition, minPrice, maxPrice, sort, page, limit }
   * @returns {Promise<Object>} { data: Array, pagination: Object }
   */
  async getProducts(params = {}) {
    return await api.get('/api/products', { params });
  },

  /**
   * Fetch single product listing by ID
   * @param {String} id
   * @returns {Promise<Object>} product
   */
  async getProductById(id) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
};

export default productService;
