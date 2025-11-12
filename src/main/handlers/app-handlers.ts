/**
 * App IPC Handlers
 * Single Responsibility: Handle app-related IPC communications
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { BrowserViewManager } from '../browser-view-manager';
import { App } from '../../shared/types';
import { generateId, getCurrentTimestamp } from '../../shared/utils';

export class AppHandlers {
  constructor(
    private storeManager: StoreManager,
    private browserViewManager: BrowserViewManager
  ) {
    this.register();
  }

  private register(): void {
    this.registerListHandler();
    this.registerCreateHandler();
    this.registerUpdateHandler();
    this.registerDeleteHandler();
    this.registerHibernateHandler();
    this.registerResumeHandler();
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
          const workspace = workspaces.find((w: any) => w.id === app.workspaceId);
          const sessionMode = workspace?.sessionMode || 'isolated';

          return {
            ...app,
            instances: [
              {
                id: instanceId,
                appId: app.id,
                partitionId:
                  sessionMode === 'shared'
                    ? `persist:workspace-${app.workspaceId}`
                    : `persist:app-${app.id}-${instanceId}`,
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

      // Get workspace to determine default session mode
      const workspaceStore = this.storeManager.getWorkspacesStore();
      const workspaces = workspaceStore.get('workspaces', []);
      const workspace = workspaces.find((w: any) => w.id === data.workspaceId);
      const sessionMode = workspace?.sessionMode || 'isolated';

      // Create default instance if none provided
      const instances =
        data.instances && data.instances.length > 0
          ? data.instances
          : [
              {
                id: instanceId,
                appId: appId,
                partitionId:
                  sessionMode === 'shared'
                    ? `persist:workspace-${data.workspaceId}`
                    : `persist:app-${appId}-${instanceId}`,
                hibernated: false,
                lastActive: getCurrentTimestamp(),
              },
            ];

      const newApp: App = {
        id: appId,
        name: data.name || 'New App',
        url: data.url || '',
        icon: data.icon,
        customCSS: data.customCSS,
        customJS: data.customJS,
        workspaceId: data.workspaceId || '',
        instances: instances,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      apps.push(newApp);
      store.set('apps', apps);

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

      apps[index] = {
        ...apps[index],
        ...data,
        id, // Ensure id cannot be changed
        updatedAt: getCurrentTimestamp(),
      };

      store.set('apps', apps);
      return apps[index];
    });
  }

  private registerDeleteHandler(): void {
    ipcMain.handle(IPC_CHANNELS.APP.DELETE, async (_event, id: string) => {
      const store = this.storeManager.getAppsStore();
      const apps = store.get('apps', []);
      const filtered = apps.filter((a: App) => a.id !== id);
      store.set('apps', filtered);
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
          const instance = app.instances.find((i: any) => i.id === instanceId);
          if (instance) {
            instance.hibernated = true;
            instance.lastActive = new Date().toISOString();
            store.set('apps', apps);
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
        const instance = app.instances.find((i: any) => i.id === instanceId);
        if (instance) {
          instance.hibernated = false;
          instance.lastActive = new Date().toISOString();
          store.set('apps', apps);
        }
      }
    });
  }
}
