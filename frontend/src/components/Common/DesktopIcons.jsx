import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

export function DesktopIcons() {
  const icons = useDesktopStore((s) => s.icons);
  const openApp = useDesktopStore((s) => s.openApp);

  return (
    <div className="absolute inset-0 p-4">
      {icons.map((icon) => (
        <motion.button
          key={icon.id}
          type="button"
          className="absolute flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-white/90 transition hover:bg-white/15"
          style={{ left: icon.x, top: icon.y }}
          onDoubleClick={() => openApp(icon.id)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="text-3xl">{icon.id === 'files' ? '📁' : icon.id === 'editor' ? '🧠' : icon.id === 'terminal' ? '🖥️' : '🌐'}</span>
          <span className="text-xs font-medium">{icon.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
