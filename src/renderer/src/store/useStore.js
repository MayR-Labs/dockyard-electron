import { create } from 'zustand';



export const useStore = create((set, get) => ({
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

  loadApps: async (workspaceId) => {
    try {
      const apps = await window.electronAPI.app.list(workspaceId);
      set({ apps });
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  },

  switchWorkspace: async (workspaceId) => {
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

  switchApp: async (appId) => {
    try {
      await window.electronAPI.app.switch(appId);
      set({ currentAppId: appId });
    } catch (error) {
      console.error('Failed to switch app:', error);
    }
  },

  createWorkspace: async (name, icon) => {
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

  createApp: async (name, url, icon) => {
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

  deleteWorkspace: async (workspaceId) => {
    try {
      await window.electronAPI.workspace.delete(workspaceId);
      
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        currentWorkspace:
          state.currentWorkspace?.id === workspaceId
            ? state.workspaces[0]
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

  deleteApp: async (appId) => {
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
