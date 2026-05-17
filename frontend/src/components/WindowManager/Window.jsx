import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';
import { FileManagerApp } from '../../apps/Files/FileManagerApp';
import { CodeEditorApp } from '../../apps/Editor/CodeEditorApp';
import { TerminalApp } from '../../apps/Terminal/TerminalApp';
import { ExecutionApp } from '../../apps/Execution/ExecutionApp';
import { ProjectDashboardApp } from '../../apps/Projects/ProjectDashboardApp';
import { AIAssistantApp } from '../../apps/AIAssistant/AIAssistantApp';

export function AppWindow({ window: appWindow }) {
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);
  const moveWindow = useDesktopStore((s) => s.moveWindow);
  const resizeWindow = useDesktopStore((s) => s.resizeWindow);

  const onDragEnd = (_event, info) => {
    moveWindow(appWindow.id, appWindow.x + info.offset.x, appWindow.y + info.offset.y);
  };

  const onResizeMouseDown = (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startW = appWindow.width;
    const startH = appWindow.height;

    const onMove = (moveEvent) => {
      const width = Math.max(420, startW + (moveEvent.clientX - startX));
      const height = Math.max(300, startH + (moveEvent.clientY - startY));
      resizeWindow(appWindow.id, width, height);
    };

    const onUp = () => {
      globalThis.window.removeEventListener('mousemove', onMove);
      globalThis.window.removeEventListener('mouseup', onUp);
    };

    globalThis.window.addEventListener('mousemove', onMove);
    globalThis.window.addEventListener('mouseup', onUp);
  };

  const style = appWindow.maximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 56px)', zIndex: appWindow.zIndex }
    : { top: appWindow.y, left: appWindow.x, width: appWindow.width, height: appWindow.height, zIndex: appWindow.zIndex };

  return (
    <motion.article
      drag={!appWindow.maximized}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      onMouseDown={() => focusWindow(appWindow.id)}
      className="absolute overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
      style={style}
    >
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-800/70 px-4 py-2">
        <h3 className="text-sm font-semibold text-white">{appWindow.icon} {appWindow.title}</h3>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded bg-white/10 px-2 py-1" onClick={() => minimizeWindow(appWindow.id)}>—</button>
          <button className="rounded bg-white/10 px-2 py-1" onClick={() => toggleMaximize(appWindow.id)}>▢</button>
          <button className="rounded bg-rose-500/80 px-2 py-1" onClick={() => closeWindow(appWindow.id)}>✕</button>
        </div>
      </header>
      <div className="h-[calc(100%-40px)] overflow-auto p-5 text-sm text-white/90">{appWindow.appId === 'files' ? <FileManagerApp /> : appWindow.appId === 'editor' ? <CodeEditorApp /> : appWindow.appId === 'terminal' ? <TerminalApp /> : appWindow.appId === 'execution' ? <ExecutionApp /> : appWindow.appId === 'projects' ? <ProjectDashboardApp /> : appWindow.appId === 'ai' ? <AIAssistantApp /> : appWindow.content}</div>
      {!appWindow.maximized && <button onMouseDown={onResizeMouseDown} className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-white/25" />}
    </motion.article>
  );
}
