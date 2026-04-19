import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios instance with base URL
export const api = axios.create({ baseURL: API_BASE });

// Attach token from localStorage to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('mb_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mb_token');
      localStorage.removeItem('mb_user');
    }
    return Promise.reject(err);
  }
);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage on mount
  useEffect(() => {
    const token  = localStorage.getItem('mb_token');
    const stored = localStorage.getItem('mb_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const _persist = (userData, token) => {
    localStorage.setItem('mb_token', token);
    localStorage.setItem('mb_user',  JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    _persist(data, data.token);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    _persist(data, data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('mb_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
