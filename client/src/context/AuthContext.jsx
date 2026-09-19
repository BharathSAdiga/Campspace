import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

/**
 * Campspace Shared Authentication Context
 * Shared by Marketplace, Events, Resources, and Clubs.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verify session validity against /api/auth/me on initial app load
   */
  useEffect(() => {
    const verifySession = async () => {
      const token = authService.getStoredToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const verifiedUser = await authService.getMe();
        setUser(verifiedUser);
      } catch (err) {
        console.warn('[AuthContext] Session validation failed or expired:', err.message);
        authService.clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Log in user with credentials
   */
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user account
   */
  const register = useCallback(async ({ name, email, password, role }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log in or register user with Google OAuth
   */
  const loginWithGoogle = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(payload);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.message || 'Google authentication failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out current user
   */
  const logout = useCallback(() => {
    authService.clearSession();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
