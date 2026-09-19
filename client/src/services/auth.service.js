import api from './api';

const TOKEN_KEY = 'campspace_token';
const USER_KEY = 'campspace_user';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, password, role }
   */
  async register(data) {
    const response = await api.post('/api/auth/register', data);
    if (response.token && response.user) {
      this.saveSession(response.token, response.user);
    }
    return response;
  },

  /**
   * Sign in existing user
   * @param {Object} data - { email, password }
   */
  async login(data) {
    const response = await api.post('/api/auth/login', data);
    if (response.token && response.user) {
      this.saveSession(response.token, response.user);
    }
    return response;
  },

  /**
   * Sign in or register with Google OAuth
   * @param {Object} payload - { credential, userInfo }
   */
  async googleLogin(payload) {
    const response = await api.post('/api/auth/google', payload);
    if (response.token && response.user) {
      this.saveSession(response.token, response.user);
    }
    return response;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/api/auth/me');
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    return response.user;
  },

  /**
   * Save session data to localStorage
   */
  saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Clear session data from localStorage
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get stored JWT token
   */
  getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user profile object
   */
  getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

export default authService;
