import { useState } from 'react';
import { useAIStore } from '../../store/aiStore';

export function AIAssistantApp() {
  const { loading, result, error, runExplain, runDebug } = useAIStore();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('def add(a, b):\n    return a + b\n');
  const [context, setContext] = useState('');

  const payload = { code, language, context };

  return (
    <div className="grid h-full grid-cols-2 gap-3">
      <div className="space-y-2">
        <div className="flex gap-2">
          <select className="rounded bg-slate-800 px-2 py-1" value={language} onChange={(e)=>setLanguage(e.target.value)}>
            {['python','javascript','typescript','html','css','json','bash','c','cpp','java','rust','go','php','ruby'].map((lang)=><option key={lang} value={lang}>{lang}</option>)}
          </select>
          <button className="rounded bg-indigo-600 px-3 py-1" disabled={loading} onClick={() => runExplain(payload)}>Explain</button>
          <button className="rounded bg-amber-600 px-3 py-1" disabled={loading} onClick={() => runDebug(payload)}>Debug</button>
        </div>
        <textarea className="h-[65%] w-full rounded bg-slate-900 p-3" value={code} onChange={(e)=>setCode(e.target.value)} />
        <textarea className="h-24 w-full rounded bg-slate-900 p-3" placeholder="extra context" value={context} onChange={(e)=>setContext(e.target.value)} />
      </div>
      <div className="rounded bg-slate-950 p-3 text-sm text-white/90">
        {loading && <p>Thinking...</p>}
        {error && <pre className="text-rose-400">{JSON.stringify(error, null, 2)}</pre>}
        {result && <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>}
        {!loading && !result && !error && <p>AI assistant output will appear here.</p>}
      </div>
    </div>
  );
}
