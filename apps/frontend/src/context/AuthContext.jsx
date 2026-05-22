import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const data = await loginService(usernameOrEmail, password);

      if (data?.user && data?.token) {
        setUser(data.user);

        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      }

      return {
        success: false,
        message: data?.message || 'Đăng nhập thất bại',
      };
    } catch (error) {
      console.error('Login failed', error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Đăng nhập thất bại',
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);

      if (data?.token) {
        return {
          success: true,
          data,
        };
      }

      return {
        success: false,
        message: data?.message || 'Đăng ký thất bại',
      };
    } catch (error) {
      console.error('Register failed', error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Đăng ký thất bại',
      };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);