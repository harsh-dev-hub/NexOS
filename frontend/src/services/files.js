import api from './api';

export const listFiles = async (folder = 'root') => (await api.get('/files/', { params: { folder } })).data;
export const uploadFile = async (file, folder = 'root') => {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  return (await api.post('/files/', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
};
export const renameFile = async (id, name) => (await api.patch(`/files/${id}/`, { name })).data;
export const deleteFile = async (id) => api.delete(`/files/${id}/`);
