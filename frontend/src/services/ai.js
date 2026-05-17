import api from './api';

export const explainCode = async (payload) => (await api.post('/ai/explain/', payload)).data;
export const debugCode = async (payload) => (await api.post('/ai/debug/', payload)).data;
