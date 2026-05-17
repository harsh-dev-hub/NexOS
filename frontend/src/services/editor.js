const mockProjectFiles = [
  { name: 'main.py', path: '/project/main.py', content: 'print("Hello NexOS")\n' },
  { name: 'app.js', path: '/project/app.js', content: 'console.log("NexOS");\n' },
  { name: 'index.html', path: '/project/index.html', content: '<h1>NexOS</h1>\n' },
  { name: 'styles.css', path: '/project/styles.css', content: 'body { background: #0f172a; }\n' },
  { name: 'config.json', path: '/project/config.json', content: '{\n  "name": "nexos"\n}\n' },
  { name: 'run.sh', path: '/project/run.sh', content: '#!/usr/bin/env bash\necho "run"\n' },
];
export const fetchProjectFiles = async () => mockProjectFiles;
export const saveProjectFile = async (_tab) => ({ ok: true });
