import { create } from 'zustand';

const appRegistry = {
  browser: { id: 'browser', title: 'Browser', icon: '🌐', content: 'Web browser app is coming soon.' },
  terminal: { id: 'terminal', title: 'Terminal', icon: '🖥️', content: 'Linux terminal integration is in Phase 8.' },
  editor: { id: 'editor', title: 'Editor', icon: '🧠', content: 'Monaco cloud editor is in Phase 7.' },
  files: { id: 'files', title: 'Files', icon: '📁', content: 'Cloud file manager is in Phase 4/10.' },
  notes: { id: 'notes', title: 'Notes', icon: '📝', content: 'Notes app module is planned.' },
  settings: { id: 'settings', title: 'Settings', icon: '⚙️', content: 'Personalization options coming soon.' },
  execution: { id: 'execution', title: 'Execution', icon: '▶️', content: 'Run code in isolated containers.' },
  projects: { id: 'projects', title: 'Projects', icon: '🗂️', content: 'Project dashboard.' },
  ai: { id: 'ai', title: 'AI Assistant', icon: '🤖', content: 'AI coding assistant.' },
};

const initialIcons = [
  { id: 'files', label: 'Files', x: 24, y: 24 },
  { id: 'editor', label: 'Editor', x: 24, y: 120 },
  { id: 'terminal', label: 'Terminal', x: 24, y: 216 },
  { id: 'browser', label: 'Browser', x: 24, y: 312 },
];

export const useDesktopStore = create((set, get) => ({
  wallpaper: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0b1120 100%)',
  windows: [],
  icons: initialIcons,
  activeWindowId: null,
  isStartMenuOpen: false,
  contextMenu: null,
  notifications: [],

  toggleStartMenu: () => set((s) => ({ isStartMenuOpen: !s.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  openApp: (appId) => {
    const { windows } = get();
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      return get().focusWindow(existing.id);
    }
    const app = appRegistry[appId];
    if (!app) return;
    const id = `${appId}-${Date.now()}`;
    const zIndex = windows.length + 20;
    set({
      windows: [
        ...windows,
        {
          id,
          appId,
          title: app.title,
          icon: app.icon,
          content: app.content,
          x: 120 + windows.length * 28,
          y: 80 + windows.length * 22,
          width: 720,
          height: 460,
          minimized: false,
          maximized: false,
          zIndex,
        },
      ],
      activeWindowId: id,
      isStartMenuOpen: false,
    });
  },

  focusWindow: (id) => {
    const windows = get().windows;
    const maxZ = Math.max(10, ...windows.map((w) => w.zIndex));
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: maxZ + 1 } : w)),
      activeWindowId: id,
    });
  },

  closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id), activeWindowId: s.activeWindowId === id ? null : s.activeWindowId })),
  minimizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)) })),
  toggleMaximize: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),
  moveWindow: (id, x, y) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) })),
  resizeWindow: (id, width, height) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)) })),

  showContextMenu: (x, y, target) => set({ contextMenu: { x, y, target } }),
  hideContextMenu: () => set({ contextMenu: null }),

  pushNotification: (message, type = 'info') => {
    const id = `n-${Date.now()}`;
    set((s) => ({ notifications: [...s.notifications, { id, message, type }] }));
    setTimeout(() => get().dismissNotification(id), 3500);
  },
  dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  apps: Object.values(appRegistry),
}));
