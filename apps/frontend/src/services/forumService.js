import api from './api';

export const getPosts = async (params) => {
  const response = await api.get('/forum/posts', { params });
  return response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/forum/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/forum/posts', postData);
  return response.data;
};

export const getForumCategories = async () => {
  const response = await api.get('/forum/categories');
  return response.data;
};

export const addComment = async (postId, content, parentId = null) => {
  const response = await api.post(`/forum/posts/${postId}/comments`, {
    content,
    parentId,
  });

  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/forum/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await api.delete(`/forum/posts/${postId}/like`);
  return response.data;
};

export const reportPost = async (postId, reportData) => {
  const response = await api.post(`/forum/posts/${postId}/report`, {
    reason: reportData.reason,
    description: reportData.description || '',
  });

  return response.data;
};
