/**
 * Central API Client for CampusConnect
 */

const API_BASE = '/api/v1';

/**
 * Get stored JWT authentication token
 */
export const getStoredToken = () => {
  return localStorage.getItem('campusconnect_token');
};

/**
 * Save JWT authentication token
 */
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('campusconnect_token', token);
  } else {
    localStorage.removeItem('campusconnect_token');
  }
};

/**
 * Generic API Fetcher with standardized error handling and authorization header
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (error) {
    // Rethrow standard structured error
    if (!error.status && error.message === 'Failed to fetch') {
      const networkError = new Error('Cannot connect to CampusConnect server. Please check your connection.');
      networkError.status = 503;
      throw networkError;
    }
    throw error;
  }
};
