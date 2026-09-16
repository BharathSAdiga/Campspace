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

  /**
   * Fetch listings created by the currently authenticated user
   * @param {Object} params - Optional { status, sort }
   * @returns {Promise<Object>} { data: Array, count: Number }
   */
  async getMyListings(params = {}) {
    return await api.get('/api/products/my-listings', { params });
  },

  /**
   * Create a new marketplace product listing
   * @param {Object} productData
   * @returns {Promise<Object>} Created product data
   */
  async createProduct(productData) {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  /**
   * Update an existing product listing (Owner / Admin)
   * @param {String} id
   * @param {Object} updateData
   * @returns {Promise<Object>} Updated product data
   */
  async updateProduct(id, updateData) {
    const response = await api.put(`/api/products/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete a product listing (Owner / Admin)
   * @param {String} id
   * @returns {Promise<Object>} Result message
   */
  async deleteProduct(id) {
    return await api.delete(`/api/products/${id}`);
  },

  /**
   * Update product listing status (Owner / Admin)
   * @param {String} id
   * @param {String} status - 'ACTIVE' | 'SOLD' | 'ARCHIVED'
   * @returns {Promise<Object>} Updated product
   */
  async updateStatus(id, status) {
    const response = await api.patch(`/api/products/${id}/status`, { status });
    return response.data;
  },
};

export default productService;
