import { create } from 'zustand';
import { Workspace } from '../../../shared/types';

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadWorkspaces: () => Promise<void>;
  setActiveWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: Partial<Workspace>) => Promise<void>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  loading: false,
  error: null,

  loadWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const workspaces = await window.dockyard.workspaces.list();
      const activeWorkspace = await window.dockyard.workspaces.getActive();
      set({ 
        workspaces, 
        activeWorkspaceId: activeWorkspace?.id || null,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setActiveWorkspace: async (id: string) => {
    try {
      await window.dockyard.workspaces.switch(id);
      set({ activeWorkspaceId: id });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createWorkspace: async (data: Partial<Workspace>) => {
    set({ loading: true, error: null });
    try {
      const newWorkspace = await window.dockyard.workspaces.create(data);
      const workspaces = [...get().workspaces, newWorkspace];
      set({ workspaces, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateWorkspace: async (id: string, data: Partial<Workspace>) => {
    set({ loading: true, error: null });
    try {
      const updatedWorkspace = await window.dockyard.workspaces.update(id, data);
      const workspaces = get().workspaces.map(w => 
        w.id === id ? updatedWorkspace : w
      );
      set({ workspaces, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteWorkspace: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await window.dockyard.workspaces.delete(id);
      const workspaces = get().workspaces.filter(w => w.id !== id);
      set({ workspaces, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
