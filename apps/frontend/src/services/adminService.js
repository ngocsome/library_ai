import api from './api';

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/admin/users/${id}/status`, { status });
  return response.data;
};

export const updateUserRole = async (id, roleId) => {
  const response = await api.put(`/admin/users/${id}/role`, { roleId });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const getForumReports = async () => {
  const response = await api.get('/admin/forum/reports');
  return response.data;
};

export const handleForumModeration = async (reportId, action) => {
  const response = await api.post('/admin/forum/moderation', {
    reportId,
    action,
  });

  return response.data;
};