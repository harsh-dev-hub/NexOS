import { create } from 'zustand';
import api from '../services/api';
import { fetchMe, login, refresh, signup } from '../services/auth';

const ACCESS_KEY = 'nexos_access_token';
const REFRESH_KEY = 'nexos_refresh_token';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem(ACCESS_KEY),
  refreshToken: localStorage.getItem(REFRESH_KEY),
  loading: false,
  error: null,
  isAuthenticated: false,

  persistTokens: ({ access, refresh: refreshValue }) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refreshValue);
    set({ accessToken: access, refreshToken: refreshValue, isAuthenticated: true });
    api.defaults.headers.common.Authorization = `Bearer ${access}`;
  },

  clearSession: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    delete api.defaults.headers.common.Authorization;
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await signup(payload);
      get().persistTokens(data.tokens);
      set({ user: data.user, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.response?.data || { detail: 'Signup failed' } });
      return false;
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await login(payload);
      get().persistTokens(data.tokens);
      await get().hydrateUser();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.response?.data || { detail: 'Login failed' } });
      return false;
    }
  },

  hydrateUser: async () => {
    try {
      const user = await fetchMe();
      set({ user, isAuthenticated: true });
      return user;
    } catch {
      get().clearSession();
      return null;
    }
  },

  bootstrapSession: async () => {
    const { accessToken, refreshToken } = get();
    if (!accessToken && !refreshToken) return;
    try {
      if (accessToken) {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        const user = await fetchMe();
        set({ user, isAuthenticated: true });
        return;
      }
      if (refreshToken) {
        const tokens = await refresh(refreshToken);
        get().persistTokens({ access: tokens.access, refresh: refreshToken });
        await get().hydrateUser();
      }
    } catch {
      get().clearSession();
    }
  },
}));
