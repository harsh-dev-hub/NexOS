import api from './api';

export const createExecutionJob = async (payload) => (await api.post('/execution/', payload)).data;
export const getExecutionJob = async (jobId) => (await api.get(`/execution/${jobId}/`)).data;
