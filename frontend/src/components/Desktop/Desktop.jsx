import { useDesktopStore } from '../../store/desktopStore';
import { DesktopIcons } from '../Common/DesktopIcons';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import { Notifications } from '../Notifications/Notifications';
import { StartMenu } from '../StartMenu/StartMenu';
import { Taskbar } from '../Taskbar/Taskbar';
import { WindowManager } from '../WindowManager/WindowManager';

export function Desktop() {
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const showContextMenu = useDesktopStore((s) => s.showContextMenu);
  const hideContextMenu = useDesktopStore((s) => s.hideContextMenu);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);

  const onDesktopContext = (event) => {
    event.preventDefault();
    closeStartMenu();
    showContextMenu(event.clientX, event.clientY, 'desktop');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: wallpaper }} onClick={hideContextMenu} onContextMenu={onDesktopContext}>
      <DesktopIcons />
      <WindowManager />
      <StartMenu />
      <Notifications />
      <Taskbar />
      <ContextMenu />
    </div>
  );
}
