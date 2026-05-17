from .base import RunnerConfig

RUNNER_REGISTRY = {
    'python': RunnerConfig('python:3.12-alpine', 'main.py', None, 'python /workspace/main.py'),
    'node': RunnerConfig('node:20-alpine', 'main.js', None, 'node /workspace/main.js'),
    'c': RunnerConfig('gcc:14', 'main.c', 'gcc /workspace/main.c -O2 -o /workspace/app', '/workspace/app'),
    'cpp': RunnerConfig('gcc:14', 'main.cpp', 'g++ /workspace/main.cpp -O2 -o /workspace/app', '/workspace/app'),
    'java': RunnerConfig('eclipse-temurin:21', 'Main.java', 'javac /workspace/Main.java', 'java -cp /workspace Main'),
}
