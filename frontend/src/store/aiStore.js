import { create } from 'zustand';
import { debugCode, explainCode } from '../services/ai';

export const useAIStore = create((set) => ({
  loading: false,
  result: null,
  error: null,

  runExplain: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await explainCode(payload);
      set({ loading: false, result });
    } catch (error) {
      set({ loading: false, error: error.response?.data || { detail: 'Explain failed' } });
    }
  },

  runDebug: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await debugCode(payload);
      set({ loading: false, result });
    } catch (error) {
      set({ loading: false, error: error.response?.data || { detail: 'Debug failed' } });
    }
  },
}));
