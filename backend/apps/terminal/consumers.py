import asyncio
import fcntl
import os
import pty
import shlex
import signal
import struct
import termios

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class TerminalConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or user.is_anonymous:
            await self.close(code=4401)
            return

        self.process = None
        self.master_fd = None
        self.reader_task = None
        self.session_id = f"u{user.id}-{self.channel_name.replace('.', '-')[:20]}"
        await self.accept()
        await self.send_json({'type': 'session', 'session_id': self.session_id})
        await self._start_shell()

    async def disconnect(self, _code):
        await self._terminate_shell()

    async def receive_json(self, content, **_kwargs):
        event_type = content.get('type')
        if event_type == 'input' and self.master_fd is not None:
            data = content.get('data', '')
            os.write(self.master_fd, data.encode())
        elif event_type == 'resize' and self.master_fd is not None:
            cols = max(20, int(content.get('cols', 120)))
            rows = max(10, int(content.get('rows', 30)))
            winsz = struct.pack('HHHH', rows, cols, 0, 0)
            fcntl.ioctl(self.master_fd, termios.TIOCSWINSZ, winsz)

    async def _start_shell(self):
        shell_cmd = os.getenv('NEXOS_TERMINAL_SHELL', '/bin/bash -i')
        argv = shlex.split(shell_cmd)
        master_fd, slave_fd = pty.openpty()
        self.master_fd = master_fd
        self.process = await asyncio.create_subprocess_exec(
            *argv,
            stdin=slave_fd,
            stdout=slave_fd,
            stderr=slave_fd,
            preexec_fn=os.setsid,
        )
        os.close(slave_fd)
        self.reader_task = asyncio.create_task(self._pump_output())

    async def _pump_output(self):
        loop = asyncio.get_running_loop()
        while True:
            if self.master_fd is None:
                return
            data = await loop.run_in_executor(None, os.read, self.master_fd, 4096)
            if not data:
                return
            await self.send_json({'type': 'output', 'data': data.decode(errors='ignore')})

    async def _terminate_shell(self):
        if self.reader_task:
            self.reader_task.cancel()
        if self.process and self.process.returncode is None:
            try:
                os.killpg(os.getpgid(self.process.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass
        if self.master_fd is not None:
            try:
                os.close(self.master_fd)
            except OSError:
                pass
            self.master_fd = None
