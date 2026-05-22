import api from './api';

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateAdminUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/admin/users/${id}/status`, {
    status,
    enabled:
      status === true ||
      status === 'ACTIVE' ||
      status === 'active' ||
      status === 'Enabled' ||
      status === 'enabled',
  });
  return response.data;
};

export const updateAdminUserStatus = async (id, enabled) => {
  const response = await api.put(`/admin/users/${id}/status`, {
    enabled,
    status: enabled ? 'ACTIVE' : 'LOCKED',
  });
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

export const exportDashboardReport = async () => {
  const response = await api.get('/analytics/dashboard');
  const data = response.data || {};

  const headers = [
    'Tong nguoi dung',
    'Tai lieu so',
    'Bai viet dien dan',
    'Nhom hoc tap',
    'Tong luot xem',
  ];

  const row = [
    data.totalUsers || 0,
    data.totalDocuments || 0,
    data.totalForumPosts || 0,
    data.totalGroups || 0,
    data.totalViews || 0,
  ];

  const csvContent = [headers, row]
    .map((items) =>
      items
        .map((item) => `"${String(item).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bao-cao-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
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
