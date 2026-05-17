import api from './api';

export const signup = async (payload) => {
  const { data } = await api.post('/auth/signup/', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login/', payload);
  return data;
};

export const refresh = async (refreshToken) => {
  const { data } = await api.post('/auth/refresh/', { refresh: refreshToken });
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me/');
  return data;
};
