import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export function useExecutionSocket(jobId, onChunk) {
  const socketRef = useRef(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!jobId || !accessToken) return;
    const base = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws';
    const ws = new WebSocket(`${base}/execution/${jobId}/?token=${accessToken}`);
    socketRef.current = ws;
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'output') onChunk(payload);
    };
    return () => ws.close();
  }, [jobId, accessToken, onChunk]);
}
