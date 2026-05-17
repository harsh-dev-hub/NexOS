import asyncio
import json
import os
import tempfile
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import ExecutionJob
from .runners.registry import RUNNER_REGISTRY


DOCKER_TIMEOUT_SECONDS = int(os.getenv('EXEC_TIMEOUT_SECONDS', '10'))
DOCKER_MEMORY_LIMIT = os.getenv('EXEC_MEMORY_LIMIT', '256m')
DOCKER_CPU_LIMIT = os.getenv('EXEC_CPU_LIMIT', '0.50')


async def _stream_job_update(job_id, payload):
    channel_layer = get_channel_layer()
    await channel_layer.group_send(f'exec_{job_id}', {'type': 'execution.message', 'payload': payload})


def run_execution_job(job: ExecutionJob):
    cfg = RUNNER_REGISTRY[job.language]
    job.status = 'running'
    job.save(update_fields=['status', 'updated_at'])

    with tempfile.TemporaryDirectory() as tmp:
      src_path = os.path.join(tmp, cfg.source_filename)
      with open(src_path, 'w', encoding='utf-8') as f:
          f.write(job.source_code)

      compile_part = f"{cfg.compile_cmd} && " if cfg.compile_cmd else ''
      cmd = [
          'docker', 'run', '--rm', '--network', 'none', '--pids-limit', '128', '--cap-drop', 'ALL',
          '--memory', DOCKER_MEMORY_LIMIT, '--cpus', DOCKER_CPU_LIMIT,
          '-v', f'{tmp}:/workspace:rw', '-w', '/workspace', cfg.image,
          'sh', '-lc', f'{compile_part}{cfg.run_cmd}'
      ]

      async def exec_and_stream():
          process = await asyncio.create_subprocess_exec(
              *cmd,
              stdin=asyncio.subprocess.PIPE,
              stdout=asyncio.subprocess.PIPE,
              stderr=asyncio.subprocess.PIPE,
          )
          if job.stdin:
              process.stdin.write(job.stdin.encode())
              await process.stdin.drain()
          if process.stdin:
              process.stdin.close()

          async def pump(stream, stream_name):
              while True:
                  line = await stream.readline()
                  if not line:
                      break
                  text = line.decode(errors='ignore')
                  if stream_name == 'stdout':
                      job.output += text
                  else:
                      job.error += text
                  job.save(update_fields=['output', 'error', 'updated_at'])
                  await _stream_job_update(job.id, {'stream': stream_name, 'chunk': text})

          try:
              await asyncio.wait_for(asyncio.gather(pump(process.stdout, 'stdout'), pump(process.stderr, 'stderr')), timeout=DOCKER_TIMEOUT_SECONDS)
              await process.wait()
          except asyncio.TimeoutError:
              process.kill()
              job.status = 'timeout'
              job.error += f'\nExecution timed out after {DOCKER_TIMEOUT_SECONDS}s.'
              job.exit_code = -1
              job.save(update_fields=['status', 'error', 'exit_code', 'updated_at'])
              return

          job.exit_code = process.returncode
          job.status = 'completed' if process.returncode == 0 else 'failed'
          job.save(update_fields=['status', 'exit_code', 'updated_at'])

      asyncio.run(exec_and_stream())
