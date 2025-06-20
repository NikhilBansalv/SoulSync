// frontend/src/contexts/AuthContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import {
  login as apiLogin,
  registerUser as apiRegister
} from '../api/api';

const AuthContext = createContext();

/**
 * Provides authentication state and actions:
 *  - user: the current username (or null)
 *  - login({ name, password })
 *  - register(profile)
 *  - logout()
 */
export function AuthProvider({ children }) {
  // Initialize user from localStorage, if present
  const [user, setUser] = useState(() => {
    return localStorage.getItem('user') || null;
  });

  // On mount, you could verify token validity if desired

  /**
   * Log in with name/password.
   * Stores JWT and username in localStorage on success.
   */
  const login = async ({ name, password }) => {
    const { data } = await apiLogin({ name, password });
    const token = data.access_token;
    // Persist to localStorage
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', name);
    setUser(name);
    return data;
  };

  /**
   * Register a new user profile (delegates to API).
   * Returns the raw API response data.
   */
  const register = async (profile) => {
    const { data } = await apiRegister(profile);
    return data;
  };

  /**
   * Clears auth data.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context:
 * const { user, login, register, logout } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
