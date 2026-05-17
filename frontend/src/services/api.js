import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

export default api;

api.interceptors.response.use((response) => response, (error) => {
  console.error('API_ERROR', { status: error?.response?.status, url: error?.config?.url });
  return Promise.reject(error);
});
