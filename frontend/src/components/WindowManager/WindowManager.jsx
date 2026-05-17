import { useDesktopStore } from '../../store/desktopStore';
import { AppWindow } from './Window';

export function WindowManager() {
  const windows = useDesktopStore((s) => s.windows);
  return (
    <section className="absolute inset-0 z-20">
      {windows.filter((w) => !w.minimized).map((window) => <AppWindow key={window.id} window={window} />)}
    </section>
  );
}
