import { apiFetch } from './api';

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Log in an existing user
   */
  login: async (credentials) => {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Fetch current authenticated user profile
   */
  getMe: async () => {
    return await apiFetch('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    return await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};
