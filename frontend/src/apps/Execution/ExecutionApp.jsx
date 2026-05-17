import { useCallback, useState } from 'react';
import { useExecutionSocket } from '../../hooks/useExecutionSocket';
import { createExecutionJob } from '../../services/execution';

const templates = {
  python: 'print("Hello from Python")\n',
  node: 'console.log("Hello from Node")\n',
  c: '#include <stdio.h>\nint main(){printf("Hello from C\\n");return 0;}\n',
  cpp: '#include <iostream>\nint main(){std::cout<<"Hello from C++\\n";return 0;}\n',
  java: 'public class Main { public static void main(String[] args){ System.out.println("Hello from Java"); } }\n',
};

export function ExecutionApp() {
  const [language, setLanguage] = useState('python');
  const [sourceCode, setSourceCode] = useState(templates.python);
  const [stdin, setStdin] = useState('');
  const [jobId, setJobId] = useState(null);
  const [logs, setLogs] = useState('');

  const onChunk = useCallback((payload) => {
    setLogs((prev) => prev + payload.chunk);
  }, []);
  useExecutionSocket(jobId, onChunk);

  const runCode = async () => {
    setLogs('');
    const job = await createExecutionJob({ language, source_code: sourceCode, stdin });
    setJobId(job.id);
  };

  return (
    <div className="grid h-full grid-cols-2 gap-3">
      <div className="space-y-2">
        <div className="flex gap-2"><select className="rounded bg-slate-800 px-3 py-2" value={language} onChange={(e)=>{setLanguage(e.target.value); setSourceCode(templates[e.target.value]);}}>{Object.keys(templates).map((k)=><option key={k} value={k}>{k}</option>)}</select><button onClick={runCode} className="rounded bg-emerald-600 px-3 py-2">Run</button></div>
        <textarea className="h-[70%] w-full rounded bg-slate-900 p-3" value={sourceCode} onChange={(e)=>setSourceCode(e.target.value)} />
        <textarea className="h-24 w-full rounded bg-slate-900 p-3" placeholder="stdin" value={stdin} onChange={(e)=>setStdin(e.target.value)} />
      </div>
      <pre className="h-full overflow-auto rounded bg-black p-3 text-green-400">{logs || 'Execution output stream...'}</pre>
    </div>
  );
}
