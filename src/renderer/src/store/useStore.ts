import { create } from 'zustand';
import type { Profile, Workspace, AppInstance } from '@shared/types';

interface StoreState {
  // State
  profile: Profile | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  apps: AppInstance[];
  currentAppId: string | null;
  isLoading: boolean;

  // Actions
  setProfile: (profile: Profile) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setApps: (apps: AppInstance[]) => void;
  setCurrentAppId: (appId: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Async actions
  loadProfile: () => Promise<void>;
  loadWorkspaces: () => Promise<void>;
  loadApps: (workspaceId: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  switchApp: (appId: string) => Promise<void>;
  createWorkspace: (name: string, icon?: string) => Promise<Workspace>;
  createApp: (name: string, url: string, icon?: string) => Promise<AppInstance>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  deleteApp: (appId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  profile: null,
  workspaces: [],
  currentWorkspace: null,
  apps: [],
  currentAppId: null,
  isLoading: true,

  // Setters
  setProfile: (profile) => set({ profile }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setApps: (apps) => set({ apps }),
  setCurrentAppId: (appId) => set({ currentAppId: appId }),
  setLoading: (isLoading) => set({ isLoading }),

  // Async actions
  loadProfile: async () => {
    try {
      const profile = await window.electronAPI.profile.get();
      set({ profile });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  },

  loadWorkspaces: async () => {
    try {
      const { profile } = get();
      if (!profile) return;

      const workspaces = await window.electronAPI.workspace.list(profile.id);
      set({ workspaces });

      // Set first workspace as current if none selected
      if (workspaces.length > 0 && !get().currentWorkspace) {
        set({ currentWorkspace: workspaces[0] });
        get().loadApps(workspaces[0].id);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  },

  loadApps: async (workspaceId: string) => {
    try {
      const apps = await window.electronAPI.app.list(workspaceId);
      set({ apps });
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  },

  switchWorkspace: async (workspaceId: string) => {
    try {
      const { workspaces } = get();
      const workspace = workspaces.find((w) => w.id === workspaceId);
      
      if (!workspace) return;

      await window.electronAPI.workspace.switch(workspaceId);
      set({ currentWorkspace: workspace, currentAppId: null });
      await get().loadApps(workspaceId);
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  },

  switchApp: async (appId: string) => {
    try {
      await window.electronAPI.app.switch(appId);
      set({ currentAppId: appId });
    } catch (error) {
      console.error('Failed to switch app:', error);
    }
  },

  createWorkspace: async (name: string, icon?: string) => {
    try {
      const { profile } = get();
      if (!profile) throw new Error('No profile loaded');

      const workspace = await window.electronAPI.workspace.create(
        profile.id,
        name,
        icon
      );
      
      set((state) => ({
        workspaces: [...state.workspaces, workspace],
      }));

      return workspace;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  },

  createApp: async (name: string, url: string, icon?: string) => {
    try {
      const { currentWorkspace } = get();
      if (!currentWorkspace) throw new Error('No workspace selected');

      const app = await window.electronAPI.app.create(
        currentWorkspace.id,
        name,
        url,
        icon
      );
      
      set((state) => ({
        apps: [...state.apps, app],
      }));

      return app;
    } catch (error) {
      console.error('Failed to create app:', error);
      throw error;
    }
  },

  deleteWorkspace: async (workspaceId: string) => {
    try {
      await window.electronAPI.workspace.delete(workspaceId);
      
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        currentWorkspace:
          state.currentWorkspace?.id === workspaceId
            ? state.workspaces[0] || null
            : state.currentWorkspace,
      }));

      // Load apps for new current workspace if available
      const { currentWorkspace } = get();
      if (currentWorkspace) {
        await get().loadApps(currentWorkspace.id);
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      throw error;
    }
  },

  deleteApp: async (appId: string) => {
    try {
      await window.electronAPI.app.delete(appId);
      
      set((state) => ({
        apps: state.apps.filter((a) => a.id !== appId),
        currentAppId: state.currentAppId === appId ? null : state.currentAppId,
      }));
    } catch (error) {
      console.error('Failed to delete app:', error);
      throw error;
    }
  },
}));
