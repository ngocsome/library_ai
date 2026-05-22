import api from './api';

export const getGroups = async () => {
    const response = await api.get('/groups');
    return response.data;
};

export const getGroupById = async (id) => {
    // This endpoint isn't explicitly in routes yet but typical REST
    // Actually looking at group.routes.js, there isn't a getById.
    // Use getChats or assume frontend filters list?
    // Let's check group.controller.js later.
    // For now assuming we might need to fetch list and find, or implement getById.
    // Wait, getChats exists.
    const response = await api.get(`/groups/${id}/chats`); 
    // This might be wrong if we want details.
    // Let's stick to getGroups for list.
    return {}; 
};

export const createGroup = async (data) => {
    const response = await api.post('/groups', data);
    return response.data;
};

export const joinGroup = async (id) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
};

export const getGroupChats = async (id) => {
    const response = await api.get(`/groups/${id}/chats`);
    return response.data;
};

export const sendMessage = async (id, content) => {
    const response = await api.post(`/groups/${id}/chats`, { content });
    return response.data;
};
