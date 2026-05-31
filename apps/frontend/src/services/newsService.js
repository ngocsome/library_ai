import api from './api';

// ==========================
// USER - Xem tin tức
// ==========================

export const getNews = async () => {
  const response = await api.get('/news');
  return response.data;
};

export const getFeaturedNews = async () => {
  const response = await api.get('/news/featured');
  return response.data;
};

export const getNewsById = async (id) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const getNewsBySlug = async (slug) => {
  const response = await api.get(`/news/slug/${slug}`);
  return response.data;
};

// ==========================
// ADMIN - CRUD tin tức
// ==========================

export const getAdminNews = async () => {
  const response = await api.get('/admin/news');
  return response.data;
};

export const createNews = async (data) => {
  const response = await api.post('/admin/news', data);
  return response.data;
};

export const updateNews = async (id, data) => {
  const response = await api.put(`/admin/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await api.delete(`/admin/news/${id}`);
  return response.data;
};