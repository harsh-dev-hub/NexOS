import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useTerminalSocket } from '../../hooks/useTerminalSocket';

export function TerminalApp() {
  const hostRef = useRef(null);
  const termRef = useRef(null);

  const { sendInput, sendResize } = useTerminalSocket((data) => termRef.current?.write(data));

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      theme: { background: '#020617', foreground: '#e2e8f0' },
      convertEol: true,
    });
    termRef.current = term;
    term.open(hostRef.current);
    term.writeln('NexOS Terminal initialized...');
    const disposable = term.onData((data) => sendInput(data));
    const resizeObserver = new ResizeObserver(() => {
      const cols = Math.max(80, Math.floor((hostRef.current?.clientWidth || 800) / 8));
      const rows = Math.max(24, Math.floor((hostRef.current?.clientHeight || 500) / 18));
      sendResize(cols, rows);
    });
    if (hostRef.current) resizeObserver.observe(hostRef.current);

    return () => {
      disposable.dispose();
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [sendInput, sendResize]);

  return <div ref={hostRef} className="h-full w-full bg-slate-950" />;
}
