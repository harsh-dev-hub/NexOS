import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

export function Taskbar() {
  const toggleStartMenu = useDesktopStore((s) => s.toggleStartMenu);
  const windows = useDesktopStore((s) => s.windows);
  const focusWindow = useDesktopStore((s) => s.focusWindow);

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-[100] border-t border-white/15 bg-slate-900/60 px-4 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <motion.button whileTap={{ scale: 0.92 }} onClick={toggleStartMenu} className="rounded-xl bg-indigo-500/80 px-3 py-2 text-sm font-semibold text-white">Nex</motion.button>
        <div className="flex items-center gap-2">
          {windows.map((win) => (
            <button key={win.id} onClick={() => focusWindow(win.id)} className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20">{win.icon} {win.title}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
