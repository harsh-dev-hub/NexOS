import { create } from 'zustand';
import { createNode, createProject, fetchProjectTree, listProjects, updateNode } from '../services/projects';

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProjectId: null,
  tree: [],
  loading: false,

  loadProjects: async () => {
    set({ loading: true });
    const projects = await listProjects();
    set({ projects, loading: false, activeProjectId: get().activeProjectId ?? projects[0]?.id ?? null });
    if (get().activeProjectId) await get().loadTree(get().activeProjectId);
  },

  addProject: async (payload) => {
    const project = await createProject(payload);
    set((s) => ({ projects: [project, ...s.projects], activeProjectId: project.id }));
    await get().loadTree(project.id);
  },

  loadTree: async (projectId) => {
    const tree = await fetchProjectTree(projectId);
    set({ tree, activeProjectId: projectId });
  },

  addNode: async (projectId, payload) => {
    await createNode(projectId, payload);
    await get().loadTree(projectId);
  },

  saveFileContent: async (projectId, nodeId, content) => {
    await updateNode(projectId, nodeId, { content });
    await get().loadTree(projectId);
  },
}));
