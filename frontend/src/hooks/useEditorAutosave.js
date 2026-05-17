import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

export function useEditorAutosave(onSave, delayMs = 1200) {
  const tabs = useEditorStore((state) => state.tabs);
  const dirtyMap = useEditorStore((state) => state.dirtyMap);
  const markSaved = useEditorStore((state) => state.markSaved);

  useEffect(() => {
    const dirtyTabs = tabs.filter((tab) => dirtyMap[tab.id]);
    if (!dirtyTabs.length) return;
    const timer = setTimeout(async () => {
      for (const tab of dirtyTabs) {
        await onSave(tab);
        markSaved(tab.id);
      }
    }, delayMs);
    return () => clearTimeout(timer);
  }, [tabs, dirtyMap, onSave, delayMs, markSaved]);
}
