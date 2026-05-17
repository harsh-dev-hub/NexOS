import { useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorAutosave } from '../../hooks/useEditorAutosave';
import { fetchProjectFiles, saveProjectFile } from '../../services/editor';
import { useEditorStore } from '../../store/editorStore';

const LANGS = ['python', 'javascript', 'html', 'css', 'json', 'shell'];

export function CodeEditorApp() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const openFileTab = useEditorStore((s) => s.openFileTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const closeTab = useEditorStore((s) => s.closeTab);
  const updateTabValue = useEditorStore((s) => s.updateTabValue);
  const setLanguage = useEditorStore((s) => s.setLanguage);
  const activeTab = tabs.find((t) => t.id === activeTabId) || null;

  useEffect(() => {
    fetchProjectFiles().then((files) => {
      if (!tabs.length) openFileTab(files[0]);
    });
  }, [openFileTab, tabs.length]);

  const saveHandler = useCallback(async (tab) => {
    await saveProjectFile(tab);
  }, []);
  useEditorAutosave(saveHandler, 1000);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900/70 p-2">
        {activeTab && <select value={activeTab.language} onChange={(e) => setLanguage(activeTab.id, e.target.value)} className="rounded bg-slate-800 px-2 py-1 text-xs">{LANGS.map((lang) => <option key={lang} value={lang}>{lang}</option>)}</select>}
      </div>
      <div className="flex border-b border-white/10 bg-slate-950/70 overflow-auto">
        {tabs.map((tab) => <button key={tab.id} className={`group flex items-center gap-2 border-r border-white/10 px-3 py-2 text-xs ${tab.id === activeTabId ? 'bg-slate-800 text-white' : 'text-white/70'}`} onClick={() => setActiveTab(tab.id)}><span>{tab.name}</span><span className="text-white/40">{tab.path}</span><span className="rounded px-1 hover:bg-white/15" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>×</span></button>)}
      </div>
      <div className="min-h-0 flex-1">{activeTab ? <Editor height="100%" theme="vs-dark" language={activeTab.language} value={activeTab.value} onChange={(value) => updateTabValue(activeTab.id, value ?? '')} options={{ minimap: { enabled: false }, fontSize: 14, smoothScrolling: true, automaticLayout: true }} /> : <div className="flex h-full items-center justify-center text-white/60">Open a file to start editing.</div>}</div>
    </div>
  );
}
