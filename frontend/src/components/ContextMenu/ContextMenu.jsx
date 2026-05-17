import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

export function ContextMenu() {
  const contextMenu = useDesktopStore((s) => s.contextMenu);
  const hideContextMenu = useDesktopStore((s) => s.hideContextMenu);
  const pushNotification = useDesktopStore((s) => s.pushNotification);

  return (
    <AnimatePresence>
      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute z-[120] w-52 rounded-xl border border-white/15 bg-slate-900/95 p-2 text-sm text-white shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button className="w-full rounded px-3 py-2 text-left hover:bg-white/10" onClick={() => { pushNotification('Desktop refreshed'); hideContextMenu(); }}>Refresh</button>
          <button className="w-full rounded px-3 py-2 text-left hover:bg-white/10" onClick={() => { pushNotification('Personalization panel in upcoming phase'); hideContextMenu(); }}>Personalize</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
