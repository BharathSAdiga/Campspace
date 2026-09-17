import axios from 'axios';

/**
 * Axios HTTP client configured for Campspace API
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for attaching auth token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
