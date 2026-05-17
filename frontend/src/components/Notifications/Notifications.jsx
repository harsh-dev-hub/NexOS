import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

export function Notifications() {
  const notifications = useDesktopStore((s) => s.notifications);

  return (
    <div className="absolute right-4 top-4 z-[130] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {notifications.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border border-white/20 bg-slate-900/90 p-3 text-sm text-white shadow-lg">
            {item.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
