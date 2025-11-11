import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import { StoreManager } from './store-manager';
import { 
  ProfileMetadata, 
  Workspace, 
  App, 
  Settings 
} from '../shared/types';
import { generateId, getCurrentTimestamp, sanitizeProfileName } from '../shared/utils';
import { DEFAULTS } from '../shared/constants';

export class IPCHandlers {
  constructor(private storeManager: StoreManager) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.registerProfileHandlers();
    this.registerWorkspaceHandlers();
    this.registerAppHandlers();
    this.registerSettingsHandlers();
  }

  private registerProfileHandlers(): void {
    // List all profiles
    ipcMain.handle(IPC_CHANNELS.PROFILE.LIST, async () => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);
      return profiles;
    });

    // Create new profile
    ipcMain.handle(IPC_CHANNELS.PROFILE.CREATE, async (_, name: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);
      
      const sanitizedName = sanitizeProfileName(name);
      const id = sanitizedName;
      
      // Check if profile already exists
      if (profiles.find((p: ProfileMetadata) => p.id === id)) {
        throw new Error(`Profile "${name}" already exists`);
      }

      const newProfile: ProfileMetadata = {
        id,
        name,
        createdAt: getCurrentTimestamp(),
        lastAccessed: getCurrentTimestamp(),
        dataPath: '', // Will be set by store manager
      };

      profiles.push(newProfile);
      rootStore.set('profiles', profiles);
      
      return newProfile;
    });

    // Delete profile
    ipcMain.handle(IPC_CHANNELS.PROFILE.DELETE, async (_, id: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);
      
      // Don't allow deleting the default profile
      if (id === 'default') {
        throw new Error('Cannot delete the default profile');
      }

      const filtered = profiles.filter((p: ProfileMetadata) => p.id !== id);
      rootStore.set('profiles', filtered);
    });

    // Get current profile
    ipcMain.handle(IPC_CHANNELS.PROFILE.GET_CURRENT, async () => {
      const rootStore = this.storeManager.getRootStore();
      const lastActive = rootStore.get('lastActiveProfile', 'default');
      const profiles = rootStore.get('profiles', []);
      return profiles.find((p: ProfileMetadata) => p.id === lastActive) || null;
    });
  }

  private registerWorkspaceHandlers(): void {
    // List all workspaces
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.LIST, async () => {
      const store = this.storeManager.getWorkspacesStore();
      return store.get('workspaces', []);
    });

    // Create new workspace
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.CREATE, async (_, data: Partial<Workspace>) => {
      const store = this.storeManager.getWorkspacesStore();
      const workspaces = store.get('workspaces', []);
      
      const newWorkspace: Workspace = {
        id: generateId(),
        name: data.name || 'New Workspace',
        icon: data.icon,
        apps: data.apps || [],
        layout: data.layout || {
          dockPosition: DEFAULTS.DOCK_POSITION,
          dockSize: DEFAULTS.DOCK_SIZE,
        },
        theme: data.theme,
        sessionMode: data.sessionMode || 'isolated',
        hibernation: data.hibernation || {
          enabled: true,
          idleTimeMinutes: DEFAULTS.IDLE_TIME_MINUTES,
        },
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      workspaces.push(newWorkspace);
      store.set('workspaces', workspaces);
      
      // Set as active if it's the first workspace
      if (workspaces.length === 1) {
        store.set('activeWorkspaceId', newWorkspace.id);
      }
      
      return newWorkspace;
    });

    // Update workspace
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.UPDATE, async (_, id: string, data: Partial<Workspace>) => {
      const store = this.storeManager.getWorkspacesStore();
      const workspaces = store.get('workspaces', []);
      
      const index = workspaces.findIndex((w: Workspace) => w.id === id);
      if (index === -1) {
        throw new Error(`Workspace with id "${id}" not found`);
      }

      workspaces[index] = {
        ...workspaces[index],
        ...data,
        id, // Ensure id cannot be changed
        updatedAt: getCurrentTimestamp(),
      };

      store.set('workspaces', workspaces);
      return workspaces[index];
    });

    // Delete workspace
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.DELETE, async (_, id: string) => {
      const store = this.storeManager.getWorkspacesStore();
      const workspaces = store.get('workspaces', []);
      const filtered = workspaces.filter((w: Workspace) => w.id !== id);
      store.set('workspaces', filtered);
      
      // If deleted workspace was active, switch to first available
      const activeId = store.get('activeWorkspaceId');
      if (activeId === id && filtered.length > 0) {
        store.set('activeWorkspaceId', filtered[0].id);
      }
    });

    // Switch workspace
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.SWITCH, async (_, id: string) => {
      const store = this.storeManager.getWorkspacesStore();
      store.set('activeWorkspaceId', id);
    });

    // Get active workspace
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.GET_ACTIVE, async () => {
      const store = this.storeManager.getWorkspacesStore();
      const activeId = store.get('activeWorkspaceId');
      if (!activeId) return null;
      
      const workspaces = store.get('workspaces', []);
      return workspaces.find((w: Workspace) => w.id === activeId) || null;
    });
  }

  private registerAppHandlers(): void {
    // List all apps
    ipcMain.handle(IPC_CHANNELS.APP.LIST, async () => {
      const store = this.storeManager.getAppsStore();
      return store.get('apps', []);
    });

    // Create new app
    ipcMain.handle(IPC_CHANNELS.APP.CREATE, async (_, data: Partial<App>) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      
      const newApp: App = {
        id: generateId(),
        name: data.name || 'New App',
        url: data.url || '',
        icon: data.icon,
        customCSS: data.customCSS,
        customJS: data.customJS,
        workspaceId: data.workspaceId || '',
        instances: data.instances || [],
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      apps.push(newApp);
      store.set('apps', apps);
      
      return newApp;
    });

    // Update app
    ipcMain.handle(IPC_CHANNELS.APP.UPDATE, async (_event, id: string, data: Partial<App>) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      
      const index = apps.findIndex((a: App) => a.id === id);
      if (index === -1) {
        throw new Error(`App with id "${id}" not found`);
      }

      apps[index] = {
        ...apps[index],
        ...data,
        id, // Ensure id cannot be changed
        updatedAt: getCurrentTimestamp(),
      };

      store.set('apps', apps);
      return apps[index];
    });

    // Delete app
    ipcMain.handle(IPC_CHANNELS.APP.DELETE, async (_event, id: string) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const filtered = apps.filter((a: App) => a.id !== id);
      store.set('apps', filtered);
    });

    // Hibernate app (placeholder - will be implemented with BrowserView)
    ipcMain.handle(IPC_CHANNELS.APP.HIBERNATE, async (_event, id: string) => {
      // eslint-disable-next-line no-console
      console.log(`Hibernating app ${id}`);
      // TODO: Implement hibernation logic
    });

    // Resume app (placeholder - will be implemented with BrowserView)
    ipcMain.handle(IPC_CHANNELS.APP.RESUME, async (_event, id: string) => {
      // eslint-disable-next-line no-console
      console.log(`Resuming app ${id}`);
      // TODO: Implement resume logic
    });
  }

  private registerSettingsHandlers(): void {
    // Get settings
    ipcMain.handle(IPC_CHANNELS.SETTINGS.GET, async (_event) => {
      const store = this.storeManager.getSettingsStore();
      return store.store;
    });

    // Update settings
    ipcMain.handle(IPC_CHANNELS.SETTINGS.UPDATE, async (_event, data: Partial<Settings>) => {
      const store = this.storeManager.getSettingsStore();
      
      // Deep merge the settings
      const currentSettings = store.store;
      const updatedSettings = {
        ...currentSettings,
        ...data,
      };

      // Update each key separately to preserve nested structure
      Object.keys(data).forEach(key => {
        store.set(key as any, (data as any)[key]);
      });

      return store.store;
    });
  }
}
