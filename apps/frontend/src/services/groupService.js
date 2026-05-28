import api from './api';

export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const getGroupById = async (id) => {
  const response = await api.get('/groups');
  const groups = response.data;

  if (!Array.isArray(groups)) {
    return null;
  }

  return (
    groups.find((group) => {
      const groupId = group.GroupID || group.groupId || group.id;
      return String(groupId) === String(id);
    }) || null
  );
};

export const createGroup = async (data) => {
  const response = await api.post('/groups', data);
  return response.data;
};

export const updateGroup = async (id, data) => {
  const response = await api.put(`/groups/${id}`, data);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await api.delete(`/groups/${id}`);
  return response.data;
};

export const joinGroup = async (id) => {
  const response = await api.post(`/groups/${id}/join`);
  return response.data;
};

export const leaveGroup = async (id) => {
  const response = await api.delete(`/groups/${id}/leave`);
  return response.data;
};

export const getGroupChats = async (id, channel = 'general') => {
  const response = await api.get(`/groups/${id}/chats`, {
    params: {
      channel,
    },
  });

  return response.data;
};

export const sendMessage = async (id, content, channel = 'general') => {
  const response = await api.post(`/groups/${id}/chats`, {
    content,
    channel,
  });

  return response.data;
};

export const getJoinRequests = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/join-requests`);
  return response.data;
};

export const approveJoinRequest = async (groupId, memberId) => {
  const response = await api.post(
    `/groups/${groupId}/join-requests/${memberId}/approve`
  );
  return response.data;
};

export const rejectJoinRequest = async (groupId, memberId) => {
  const response = await api.post(
    `/groups/${groupId}/join-requests/${memberId}/reject`
  );
  return response.data;
};