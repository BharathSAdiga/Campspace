import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { getStoredToken, setStoredToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  // Load and verify existing session on mount
  const loadUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        // Clear invalid token
        setStoredToken(null);
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.warn('Session verification failed:', error.message);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { user: userData, token: jwtToken } = response.data;
      setStoredToken(jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.message || 'Login failed');
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success && response.data) {
      const { user: newUser, token: jwtToken } = response.data;
      setStoredToken(jwtToken);
      setToken(jwtToken);
      setUser(newUser);
      return newUser;
    }
    throw new Error(response.message || 'Registration failed');
  };

  /**
   * Log out user
   */
  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  /**
   * Update local user state
   */
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isOrganizer: user?.role === 'organizer',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
