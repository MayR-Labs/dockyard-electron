/**
 * BrowserView IPC Handlers
 * Single Responsibility: Handle BrowserView-related IPC communications
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { BrowserViewManager } from '../browser-view-manager';
import { App, AppInstance } from '../../shared/types';

export class BrowserViewHandlers {
  constructor(
    private storeManager: StoreManager,
    private browserViewManager: BrowserViewManager
  ) {
    this.register();
  }

  private register(): void {
    this.registerShowHandler();
    this.registerHideHandler();
    this.registerUpdateBoundsHandler();
    this.registerNavigateHandler();
    this.registerGoBackHandler();
    this.registerGoForwardHandler();
    this.registerReloadHandler();
    this.registerGetStateHandler();
    this.registerSetZoomHandler();
    this.registerOpenDevToolsHandler();
    this.registerCloseDevToolsHandler();
    this.registerClearSessionHandler();
    this.registerGetMemoryHandler();
    this.registerGetCPUHandler();
    this.registerGetAllHandler();
  }

  private registerShowHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.SHOW,
      async (_event, appId: string, instanceId: string, bounds?: Electron.Rectangle) => {
        const store = this.storeManager.getAppsStore();
        const apps = store.get('apps', []);
        const app = apps.find((a: App) => a.id === appId);

        if (!app) {
          throw new Error(`App with id "${appId}" not found`);
        }

        const instance = app.instances.find((instanceEntry: AppInstance) => instanceEntry.id === instanceId);
        if (!instance) {
          throw new Error(`Instance with id "${instanceId}" not found`);
        }

        // Get or create the view
        this.browserViewManager.getOrCreateView(app, instance);

        // Show the view
        this.browserViewManager.showView(appId, instanceId, bounds);
      }
    );
  }

  private registerHideHandler(): void {
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.HIDE, async () => {
      this.browserViewManager.hideAllViews();
    });
  }

  private registerUpdateBoundsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.UPDATE_BOUNDS,
      async (_event, appId: string, instanceId: string, bounds: Electron.Rectangle) => {
        this.browserViewManager.updateViewBounds(appId, instanceId, bounds);
      }
    );
  }

  private registerNavigateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.NAVIGATE,
      async (_event, appId: string, instanceId: string, url: string) => {
        this.browserViewManager.navigateToURL(appId, instanceId, url);
      }
    );
  }

  private registerGoBackHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.GO_BACK,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.goBack(appId, instanceId);
      }
    );
  }

  private registerGoForwardHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.GO_FORWARD,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.goForward(appId, instanceId);
      }
    );
  }

  private registerReloadHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.RELOAD,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.reload(appId, instanceId);
      }
    );
  }

  private registerGetStateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.GET_STATE,
      async (_event, appId: string, instanceId: string) => {
        return this.browserViewManager.getNavigationState(appId, instanceId);
      }
    );
  }

  private registerSetZoomHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.SET_ZOOM,
      async (_event, appId: string, instanceId: string, zoomFactor: number) => {
        this.browserViewManager.setZoomLevel(appId, instanceId, zoomFactor);
      }
    );
  }

  private registerOpenDevToolsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.OPEN_DEVTOOLS,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.openDevTools(appId, instanceId);
      }
    );
  }

  private registerCloseDevToolsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.CLOSE_DEVTOOLS,
      async (_event, appId: string, instanceId: string) => {
        this.browserViewManager.closeDevTools(appId, instanceId);
      }
    );
  }

  private registerClearSessionHandler(): void {
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.CLEAR_SESSION, async (_event, partitionId: string) => {
      await this.browserViewManager.clearSessionData(partitionId);
    });
  }

  private registerGetMemoryHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.GET_MEMORY,
      async (_event, appId: string, instanceId: string) => {
        return await this.browserViewManager.getMemoryUsage(appId, instanceId);
      }
    );
  }

  private registerGetCPUHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.BROWSER_VIEW.GET_CPU,
      async (_event, appId: string, instanceId: string) => {
        return this.browserViewManager.getCPUUsage(appId, instanceId);
      }
    );
  }

  private registerGetAllHandler(): void {
    ipcMain.handle(IPC_CHANNELS.BROWSER_VIEW.GET_ALL, async () => {
      return this.browserViewManager.getAllViews();
    });
  }
}
