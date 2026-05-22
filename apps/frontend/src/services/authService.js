import api from './api';

export const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', {
    usernameOrEmail,
    password,
  });

  const data = response.data;

  if (data?.token) {
    const user = {
      id: data.id,
      UserID: data.id,

      username: data.username,
      Username: data.username,

      email: data.email,
      Email: data.email,

      fullName: data.fullName,
      FullName: data.fullName,

      role: data.role,
      RoleID: data.role === 'ADMIN' ? 1 : 3,

      Status: 'ACTIVE',
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      token: data.token,
      user,
    };
  }

  return data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
  });

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', {
    email,
  });

  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', {
    token,
    newPassword,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};