import { apiFetch } from './api';

/**
 * Service for communicating with Campus Marketplace API
 */
export const marketplaceService = {
  /**
   * Fetch listings with optional search, filters, sorting, and pagination
   */
  async getListings(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/marketplace/listings?${queryString}` : '/marketplace/listings';
    return await apiFetch(endpoint);
  },

  /**
   * Get single listing by ID
   */
  async getListingById(id) {
    return await apiFetch(`/marketplace/listings/${id}`);
  },

  /**
   * Create a new campus marketplace listing
   */
  async createListing(listingData) {
    return await apiFetch('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  /**
   * Update an existing listing
   */
  async updateListing(id, updateData) {
    return await apiFetch(`/marketplace/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete an existing listing
   */
  async deleteListing(id) {
    return await apiFetch(`/marketplace/listings/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Fetch current user's listings
   */
  async getMyListings() {
    return await apiFetch('/marketplace/my-listings');
  },
};
