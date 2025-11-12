import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import { StoreManager } from './store-manager';
import { BrowserViewManager } from './browser-view-manager';
import { 
  ProfileMetadata, 
  Workspace, 
  App, 
  Settings 
} from '../shared/types';
import { generateId, getCurrentTimestamp, sanitizeProfileName } from '../shared/utils';
import { DEFAULTS } from '../shared/constants';

export class IPCHandlers {
  constructor(
    private storeManager: StoreManager,
    private browserViewManager: BrowserViewManager
  ) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.registerProfileHandlers();
    this.registerWorkspaceHandlers();
    this.registerAppHandlers();
    this.registerSettingsHandlers();
    this.registerNotificationHandlers();
    this.registerBrowserViewHandlers();
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

    // Hibernate app
    ipcMain.handle(IPC_CHANNELS.APP.HIBERNATE, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.hibernateView(appId, instanceId);
      
      // Update app instance state
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const app = apps.find((a: App) => a.id === appId);
      
      if (app) {
        const instance = app.instances.find((i: any) => i.id === instanceId);
        if (instance) {
          instance.hibernated = true;
          instance.lastActive = new Date().toISOString();
          store.set('apps', apps);
        }
      }
    });

    // Resume app
    ipcMain.handle(IPC_CHANNELS.APP.RESUME, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.resumeView(appId, instanceId);
      
      // Update app instance state
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const app = apps.find((a: App) => a.id === appId);
      
      if (app) {
        const instance = app.instances.find((i: any) => i.id === instanceId);
        if (instance) {
          instance.hibernated = false;
          instance.lastActive = new Date().toISOString();
          store.set('apps', apps);
        }
      }
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

  private registerNotificationHandlers(): void {
    const { Notification } = require('electron');

    // Show notification
    ipcMain.handle(IPC_CHANNELS.NOTIFICATION.SHOW, async (_event, options: {
      title: string;
      body: string;
      icon?: string;
      silent?: boolean;
    }) => {
      // Check DND status
      const settingsStore = this.storeManager.getSettingsStore();
      const settings = settingsStore.store as Settings;
      
      if (settings.notifications.doNotDisturb) {
        return; // Don't show notification if DND is enabled
      }

      if (!settings.notifications.enabled) {
        return; // Don't show notification if notifications are disabled
      }

      const notification = new Notification({
        title: options.title,
        body: options.body,
        icon: options.icon,
        silent: options.silent || !settings.notifications.soundEnabled,
      });

      notification.show();
    });

    // Update badge count (for app icons)
    ipcMain.handle(IPC_CHANNELS.NOTIFICATION.UPDATE_BADGE, async (_event, appId: string, count: number) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      
      const index = apps.findIndex((a: App) => a.id === appId);
      if (index === -1) {
        throw new Error(`App with id "${appId}" not found`);
      }

      apps[index] = {
        ...apps[index],
        notifications: {
          ...apps[index].notifications,
          badgeCount: count,
        },
        updatedAt: getCurrentTimestamp(),
      };

      store.set('apps', apps);
      return apps[index];
    });
  }

  private registerBrowserViewHandlers(): void {
    // Show BrowserView
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.SHOW, async (_event, appId: string, instanceId: string, bounds?: Electron.Rectangle) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const app = apps.find((a: App) => a.id === appId);
      
      if (!app) {
        throw new Error(`App with id "${appId}" not found`);
      }

      const instance = app.instances.find((i: any) => i.id === instanceId);
      if (!instance) {
        throw new Error(`Instance with id "${instanceId}" not found`);
      }

      // Get or create the view
      const view = this.browserViewManager.getOrCreateView(app, instance);
      
      // Show the view
      this.browserViewManager.showView(appId, instanceId, bounds);
    });

    // Hide all views
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.HIDE, async () => {
      this.browserViewManager.hideAllViews();
    });

    // Update view bounds
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.UPDATE_BOUNDS, async (_event, appId: string, instanceId: string, bounds: Electron.Rectangle) => {
      this.browserViewManager.updateViewBounds(appId, instanceId, bounds);
    });

    // Navigate to URL
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.NAVIGATE, async (_event, appId: string, instanceId: string, url: string) => {
      this.browserViewManager.navigateToURL(appId, instanceId, url);
    });

    // Go back
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GO_BACK, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.goBack(appId, instanceId);
    });

    // Go forward
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GO_FORWARD, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.goForward(appId, instanceId);
    });

    // Reload
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.RELOAD, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.reload(appId, instanceId);
    });

    // Get navigation state
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GET_STATE, async (_event, appId: string, instanceId: string) => {
      return this.browserViewManager.getNavigationState(appId, instanceId);
    });

    // Set zoom level
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.SET_ZOOM, async (_event, appId: string, instanceId: string, zoomFactor: number) => {
      this.browserViewManager.setZoomLevel(appId, instanceId, zoomFactor);
    });

    // Open DevTools
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.OPEN_DEVTOOLS, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.openDevTools(appId, instanceId);
    });

    // Close DevTools
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.CLOSE_DEVTOOLS, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.closeDevTools(appId, instanceId);
    });

    // Clear session data
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.CLEAR_SESSION, async (_event, partitionId: string) => {
      await this.browserViewManager.clearSessionData(partitionId);
    });

    // Get memory usage
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GET_MEMORY, async (_event, appId: string, instanceId: string) => {
      return await this.browserViewManager.getMemoryUsage(appId, instanceId);
    });

    // Get CPU usage
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GET_CPU, async (_event, appId: string, instanceId: string) => {
      return this.browserViewManager.getCPUUsage(appId, instanceId);
    });

    // Get all active views
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GET_ALL, async () => {
      return this.browserViewManager.getAllViews();
    });
  }
}
