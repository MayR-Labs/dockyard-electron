/**
 * App IPC Handlers
 * Single Responsibility: Handle app-related IPC communications
 */

import { BrowserWindow, ipcMain } from 'electron';
import { DEFAULTS, IPC_CHANNELS, IPC_EVENTS } from '../../shared/constants';
import { App, AppInstance, Workspace } from '../../shared/types';
import { generateId, getCurrentTimestamp, getPartitionName } from '../../shared/utils';
import { BrowserViewManager } from '../browser-view-manager';
import { StoreManager } from '../store-manager';

export class AppHandlers {
  constructor(
    private storeManager: StoreManager,
    private browserViewManager: BrowserViewManager
  ) {
    this.register();
  }

  private emitAppUpdated(appId?: string): void {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(IPC_EVENTS.APP_UPDATED, { appId });
    });
  }

  private register(): void {
    this.registerListHandler();
    this.registerCreateHandler();
    this.registerUpdateHandler();
    this.registerDeleteHandler();
    this.registerHibernateHandler();
    this.registerResumeHandler();
    this.registerCreateInstanceHandler();
  }

  /**
   * Helper to generate partition name with profile, workspace, and app slugs
   */
  private generatePartitionName(
    appId: string,
    appName: string,
    instanceId: string,
    workspaceId: string,
    sessionMode: 'isolated' | 'shared'
  ): string {
    // Get workspace info
    const workspaceStore = this.storeManager.getWorkspacesStore();
    const workspaces = workspaceStore.get('workspaces', []);
    const workspace = workspaces.find((w: Workspace) => w.id === workspaceId);
    const workspaceName = workspace?.name || workspaceId;

    // Get profile info
    const profile = this.storeManager.getCurrentProfileMetadata();

    return getPartitionName(
      appId,
      appName,
      instanceId,
      workspaceId,
      workspaceName,
      profile.id,
      profile.name,
      sessionMode
    );
  }

  private registerListHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.LIST, async () => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);

      // Ensure all apps have at least one instance (migration for older data)
      let needsUpdate = false;
      const normalizedApps = apps.map((app: App) => {
        if (!app.instances || app.instances.length === 0) {
          needsUpdate = true;
          const instanceId = generateId();

          // Get workspace to determine default session mode
          const workspaceStore = this.storeManager.getWorkspacesStore();
          const workspaces = workspaceStore.get('workspaces', []);
          const workspace = workspaces.find((w: Workspace) => w.id === app.workspaceId);
          const sessionMode = workspace?.sessionMode || 'isolated';

          return {
            ...app,
            instances: [
              {
                id: instanceId,
                appId: app.id,
                partitionId: this.generatePartitionName(
                  app.id,
                  app.name,
                  instanceId,
                  app.workspaceId,
                  sessionMode
                ),
                hibernated: false,
                lastActive: getCurrentTimestamp(),
              },
            ],
          };
        }
        return app;
      });

      // Save normalized apps if any were updated
      if (needsUpdate) {
        store.set('apps', normalizedApps);
      }

      return normalizedApps;
    });
  }

  private registerCreateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.CREATE, async (_, data: Partial<App>) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);

      const appId = generateId();
      const instanceId = generateId();
      const appName = data.name || 'New App';
      const workspaceId = data.workspaceId || '';

      // Get workspace to determine default session mode
      const workspaceStore = this.storeManager.getWorkspacesStore();
      const workspaces = workspaceStore.get('workspaces', []);
      const workspace = workspaces.find((w: Workspace) => w.id === workspaceId);
      const sessionMode = workspace?.sessionMode || 'isolated';
      const defaultIdleMinutes =
        data.hibernation?.idleTimeMinutes ??
        workspace?.hibernation?.idleTimeMinutes ??
        DEFAULTS.IDLE_TIME_MINUTES;

      // Create default instance if none provided
      const instances =
        data.instances && data.instances.length > 0
          ? data.instances
          : [
              {
                id: instanceId,
                appId: appId,
                partitionId: this.generatePartitionName(
                  appId,
                  appName,
                  instanceId,
                  workspaceId,
                  sessionMode
                ),
                hibernated: false,
                lastActive: getCurrentTimestamp(),
              },
            ];

      const newApp: App = {
        id: appId,
        name: appName,
        url: data.url || '',
        icon: data.icon,
        customCSS: data.customCSS,
        customJS: data.customJS,
        userAgent: data.userAgent,
        workspaceId: workspaceId,
        instances: instances,
        hibernation: data.hibernation ?? { idleTimeMinutes: defaultIdleMinutes },
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      apps.push(newApp);
      store.set('apps', apps);

      this.emitAppUpdated(newApp.id);

      return newApp;
    });
  }

  private registerUpdateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.UPDATE, async (_event, id: string, data: Partial<App>) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);

      const index = apps.findIndex((a: App) => a.id === id);
      if (index === -1) {
        throw new Error(`App with id "${id}" not found`);
      }

      const nextApp: App = {
        ...apps[index],
        ...data,
        id, // Ensure id cannot be changed
        updatedAt: getCurrentTimestamp(),
      };

      const hasHibernationUpdate = Object.prototype.hasOwnProperty.call(data, 'hibernation');
      if (hasHibernationUpdate) {
        if (data.hibernation === null || data.hibernation === undefined) {
          delete nextApp.hibernation;
        } else if (data.hibernation) {
          nextApp.hibernation = {
            ...apps[index].hibernation,
            ...data.hibernation,
          };
        }
      }

      apps[index] = nextApp;

      store.set('apps', apps);
      this.emitAppUpdated(id);
      return apps[index];
    });
  }

  private registerDeleteHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.DELETE, async (_event, id: string) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const filtered = apps.filter((a: App) => a.id !== id);
      store.set('apps', filtered);
      this.emitAppUpdated(id);
    });
  }

  private registerHibernateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.APP.HIBERNATE,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.hibernateView(appId, instanceId);

        // Update app instance state
        const store = this.storeManager.getAppsStore();
        const apps = store.get('apps', []);
        const app = apps.find((a: App) => a.id === appId);

        if (app) {
          const instance = app.instances.find(
            (instanceEntry: AppInstance) => instanceEntry.id === instanceId
          );
          if (instance) {
            instance.hibernated = true;
            instance.lastActive = new Date().toISOString();
            store.set('apps', apps);
            this.emitAppUpdated(appId);
          }
        }
      }
    );
  }

  private registerResumeHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.RESUME, async (_event, appId: string, instanceId: string) => {
      this.browserViewManager.resumeView(appId, instanceId);

      // Update app instance state
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const app = apps.find((a: App) => a.id === appId);

      if (app) {
        const instance = app.instances.find(
          (instanceEntry: AppInstance) => instanceEntry.id === instanceId
        );
        if (instance) {
          instance.hibernated = false;
          instance.lastActive = new Date().toISOString();
          store.set('apps', apps);
          this.emitAppUpdated(appId);
        }
      }
    });
  }

  private registerCreateInstanceHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.APP.CREATE_INSTANCE,
      async (
        _event,
        appId: string,
        data: { name?: string; sessionMode?: 'isolated' | 'shared' }
      ) => {
        const store = this.storeManager.getAppsStore();
        const apps = store.get('apps', []);
        const app = apps.find((a: App) => a.id === appId);

        if (!app) {
          throw new Error(`App with id "${appId}" not found`);
        }

        // Get workspace info
        const workspaceStore = this.storeManager.getWorkspacesStore();
        const workspaces = workspaceStore.get('workspaces', []);
        const workspace = workspaces.find((w: Workspace) => w.id === app.workspaceId);
        const sessionMode = data.sessionMode || workspace?.sessionMode || 'isolated';

        // Generate new instance with proper partition
        const instanceId = generateId();
        const newInstance: AppInstance = {
          id: instanceId,
          appId: app.id,
          name: data.name,
          partitionId: this.generatePartitionName(
            app.id,
            app.name,
            instanceId,
            app.workspaceId,
            sessionMode
          ),
          hibernated: false,
          lastActive: getCurrentTimestamp(),
        };

        // Add instance to app
        app.instances.push(newInstance);
        app.updatedAt = getCurrentTimestamp();
        store.set('apps', apps);
        this.emitAppUpdated(app.id);

        return newInstance;
      }
    );
  }
}
