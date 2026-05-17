import { useEffect, useMemo, useState } from 'react';
import { deleteFile, listFiles, renameFile, uploadFile } from '../../services/files';

export function FileManagerApp() {
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState('root');
  const [query, setQuery] = useState('');

  const load = async () => setFiles(await listFiles(folder));
  useEffect(() => { load(); }, [folder]);
  const filtered = useMemo(() => files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())), [files, query]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={folder} onChange={(e)=>setFolder(e.target.value)} className="rounded bg-slate-800 px-3 py-2" placeholder="folder" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} className="rounded bg-slate-800 px-3 py-2" placeholder="search" />
        <label className="cursor-pointer rounded bg-indigo-600 px-3 py-2">Upload<input type="file" className="hidden" onChange={async(e)=>{if(e.target.files?.[0]){await uploadFile(e.target.files[0], folder); await load();}}}/></label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((f)=><div key={f.id} className="rounded border border-white/10 bg-slate-800/70 p-3"><a className="text-indigo-300" href={f.file_url} target="_blank" rel="noreferrer">{f.name}</a><p className="text-xs text-white/60">{f.file_type || 'unknown'} • {Math.round(f.size_bytes/1024)}KB</p><div className="mt-2 flex gap-2"><button className="rounded bg-white/10 px-2" onClick={async()=>{const n=prompt('Rename file', f.name); if(n){await renameFile(f.id,n); await load();}}}>Rename</button><button className="rounded bg-rose-600/80 px-2" onClick={async()=>{await deleteFile(f.id); await load();}}>Delete</button></div></div>)}
      </div>
    </div>
  );
}
