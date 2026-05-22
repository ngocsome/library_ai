import api from './api';

export const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put('/users/change-password', data);
  return response.data;
};

export const getUserActivity = async () => {
  const response = await api.get('/users/activity');
  return response.data;
};
