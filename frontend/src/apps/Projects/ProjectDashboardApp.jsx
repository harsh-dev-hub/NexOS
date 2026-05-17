import { useEffect, useMemo, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';

export function ProjectDashboardApp() {
  const { projects, activeProjectId, tree, loadProjects, addProject, loadTree, addNode } = useProjectStore();
  const [name, setName] = useState('');

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const files = useMemo(() => tree.filter((n) => n.node_type === 'file'), [tree]);

  return (
    <div className="grid h-full grid-cols-[260px_1fr] gap-3">
      <aside className="rounded bg-slate-900/70 p-3">
        <h3 className="mb-2 text-sm font-semibold">Projects</h3>
        <div className="mb-3 flex gap-2"><input className="w-full rounded bg-slate-800 px-2 py-1 text-sm" value={name} onChange={(e)=>setName(e.target.value)} placeholder="New project" /><button className="rounded bg-indigo-600 px-2" onClick={async()=>{if(name.trim()){await addProject({name, description:''}); setName('');}}}>Create</button></div>
        <div className="space-y-1">{projects.map((p)=><button key={p.id} className={`w-full rounded px-2 py-1 text-left text-sm ${p.id===activeProjectId?'bg-slate-700':'bg-slate-800/70'}`} onClick={()=>loadTree(p.id)}>{p.name}</button>)}</div>
      </aside>
      <main className="rounded bg-slate-900/70 p-3">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">Folder Tree</h3><button className="rounded bg-emerald-600 px-2 py-1 text-xs" onClick={async()=>{if(activeProjectId){const stamp=Date.now();await addNode(activeProjectId,{node_type:'file',name:`file-${stamp}.py`,path:`/file-${stamp}.py`,content:'',language:'python'});}}}>Add File</button></div>
        <ul className="space-y-1 text-sm">{tree.map((node)=><li key={node.id} className="rounded bg-slate-800/80 px-2 py-1">{node.node_type === 'folder' ? '📁' : '📄'} {node.path}</li>)}</ul>
        <div className="mt-3 rounded bg-slate-800/60 p-2 text-xs text-white/70">Files in project: {files.length}</div>
      </main>
    </div>
  );
}
