import api from './api';

export const listProjects = async () => (await api.get('/projects/')).data;
export const createProject = async (payload) => (await api.post('/projects/', payload)).data;
export const fetchProjectTree = async (projectId) => (await api.get(`/projects/${projectId}/tree/`)).data;
export const createNode = async (projectId, payload) => (await api.post(`/projects/${projectId}/nodes/`, payload)).data;
export const updateNode = async (projectId, nodeId, payload) => (await api.patch(`/projects/${projectId}/nodes/${nodeId}/`, payload)).data;
export const deleteNode = async (projectId, nodeId) => api.delete(`/projects/${projectId}/nodes/${nodeId}/`);
