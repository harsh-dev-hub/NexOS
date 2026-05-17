import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

export function StartMenu() {
  const isOpen = useDesktopStore((s) => s.isStartMenuOpen);
  const apps = useDesktopStore((s) => s.apps);
  const openApp = useDesktopStore((s) => s.openApp);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-16 left-1/2 z-[90] w-[560px] -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-900/85 p-5 text-white shadow-2xl backdrop-blur-2xl"
        >
          <h2 className="mb-4 text-sm font-semibold text-white/80">Pinned Apps</h2>
          <div className="grid grid-cols-3 gap-3">
            {apps.map((app) => (
              <button key={app.id} onClick={() => openApp(app.id)} className="rounded-xl bg-white/10 p-3 text-left hover:bg-white/20">
                <div className="text-xl">{app.icon}</div>
                <p className="mt-1 text-sm font-medium">{app.title}</p>
              </button>
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
