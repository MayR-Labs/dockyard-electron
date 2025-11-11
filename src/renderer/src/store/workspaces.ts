/**
 * Workspace Store
 * Manages workspace state using Zustand
 * Follows Single Responsibility Principle - only handles state management
 */

import { create } from 'zustand';
import { Workspace } from '../../../shared/types';
import { workspaceAPI } from '../services/api';

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
      const workspaces = await workspaceAPI.list();
      const activeWorkspace = await workspaceAPI.getActive();
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
      await workspaceAPI.switch(id);
      set({ activeWorkspaceId: id });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createWorkspace: async (data: Partial<Workspace>) => {
    set({ loading: true, error: null });
    try {
      const newWorkspace = await workspaceAPI.create(data);
      // Reload workspaces from storage to ensure consistency
      const workspaces = await workspaceAPI.list();
      const activeWorkspace = await workspaceAPI.getActive();
      
      // Set new workspace as active (the backend sets it active if it's the first one)
      const activeId = activeWorkspace?.id || newWorkspace.id;
      
      set({ 
        workspaces, 
        activeWorkspaceId: activeId,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateWorkspace: async (id: string, data: Partial<Workspace>) => {
    set({ loading: true, error: null });
    try {
      await workspaceAPI.update(id, data);
      // Reload workspaces from storage to ensure consistency
      const workspaces = await workspaceAPI.list();
      set({ workspaces, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteWorkspace: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await workspaceAPI.delete(id);
      // Reload workspaces from storage to ensure consistency
      const workspaces = await workspaceAPI.list();
      const activeWorkspace = await workspaceAPI.getActive();
      set({ 
        workspaces, 
        activeWorkspaceId: activeWorkspace?.id || null,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
