import api from './api';

export const getDocuments = async (params = {}) => {
  const response = await api.get('/documents', { params });
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/documents/favorites');
  return response.data;
};

export const getFavoriteDocuments = async () => {
  const response = await api.get('/documents/favorites');
  return response.data;
};

export const addFavoriteDocument = async (documentId) => {
  const response = await api.post(`/documents/${documentId}/favorite`);
  return response.data;
};

export const removeFavoriteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}/favorite`);
  return response.data;
};

export const createDocument = async (formData) => {
  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateDocument = async (documentId, formData) => {
  const response = await api.put(`/documents/${documentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};