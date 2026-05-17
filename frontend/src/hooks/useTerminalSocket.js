import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export function useTerminalSocket(onOutput) {
  const socketRef = useRef(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;
    const base = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws';
    const ws = new WebSocket(`${base}/terminal/?token=${accessToken}`);
    socketRef.current = ws;
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'output') onOutput(payload.data);
    };
    return () => ws.close();
  }, [accessToken, onOutput]);

  return {
    sendInput: (data) => socketRef.current?.readyState === WebSocket.OPEN && socketRef.current.send(JSON.stringify({ type: 'input', data })),
    sendResize: (cols, rows) => socketRef.current?.readyState === WebSocket.OPEN && socketRef.current.send(JSON.stringify({ type: 'resize', cols, rows })),
  };
}
