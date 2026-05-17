import { create } from 'zustand';

const languageByExtension = {
  py: 'python',
  js: 'javascript',
  html: 'html',
  css: 'css',
  json: 'json',
  sh: 'shell',
};

const detectLanguage = (path) => {
  const ext = path.split('.').pop()?.toLowerCase();
  return languageByExtension[ext] || 'plaintext';
};

export const useEditorStore = create((set, get) => ({
  tabs: [],
  activeTabId: null,
  dirtyMap: {},

  openFileTab: (file) => {
    const existing = get().tabs.find((tab) => tab.path === file.path);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    const id = `tab-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const tab = {
      id,
      name: file.name,
      path: file.path,
      value: file.content ?? '',
      language: detectLanguage(file.path),
      lastSavedAt: Date.now(),
    };
    set((state) => ({ tabs: [...state.tabs, tab], activeTabId: id }));
  },

  closeTab: (id) => {
    const tabs = get().tabs.filter((tab) => tab.id !== id);
    const activeTabId = get().activeTabId === id ? tabs.at(-1)?.id || null : get().activeTabId;
    set({ tabs, activeTabId });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabValue: (id, value) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, value } : tab)),
      dirtyMap: { ...state.dirtyMap, [id]: true },
    }));
  },

  setLanguage: (id, language) => {
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, language } : tab)) }));
  },

  markSaved: (id) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, lastSavedAt: Date.now() } : tab)),
      dirtyMap: { ...state.dirtyMap, [id]: false },
    }));
  },

  getActiveTab: () => get().tabs.find((tab) => tab.id === get().activeTabId) || null,
}));
