import { BrowserView, BrowserWindow } from 'electron';
import { AppInstance } from '../shared/types';
import { PARTITION_PREFIX } from '../shared/constants';

export class AppManager {
  browserViews= new Map();
  mainWindow= null;
  currentAppId= null;

  setMainWindow(window) {
    this.mainWindow = window;
  }

  createAppView(appInstance) {
    // Clean up existing view if any
    if (this.browserViews.has(appInstance.id)) {
      this.destroyAppView(appInstance.id);
    }

    const view = new BrowserView({
      webPreferences: {
        partition: `${PARTITION_PREFIX}:${appInstance.partition}`,
        contextIsolation,
        nodeIntegration,
        sandbox,
        devTools);

    view.webContents.loadURL(appInstance.url);

    // Handle page title updates
    view.webContents.on('page-title-updated', (_event, title) => {
      this.updateAppState(appInstance.id, { title });
    });

    // Handle favicon updates
    view.webContents.on('page-favicon-updated', (_event, favicons) => {
      if (favicons.length > 0) {
        this.updateAppState(appInstance.id, { favicon);
      }
    });

    this.browserViews.set(appInstance.id, view);
    return view;
  }

  showAppView(appId) {
    if (!this.mainWindow) {
      return;
    }

    const view = this.browserViews.get(appId);
    if (!view) {
      return;
    }

    // Hide current view
    if (this.currentAppId && this.currentAppId !== appId) {
      const currentView = this.browserViews.get(this.currentAppId);
      if (currentView) {
        this.mainWindow.removeBrowserView(currentView);
      }
    }

    // Show new view
    this.mainWindow.addBrowserView(view);
    const bounds = this.mainWindow.getBounds();
    
    // Adjust bounds to account for dock (left side, 80px wide)
    view.setBounds({
      x,
      y,
      width: bounds.width - 80,
      height: bounds.height,
    });

    view.setAutoResize({
      width,
      height);

    this.currentAppId = appId;
    this.updateAppState(appId, { lastActiveAt: Date.now() });
  }

  hideAppView(appId) {
    if (!this.mainWindow) {
      return;
    }

    const view = this.browserViews.get(appId);
    if (view) {
      this.mainWindow.removeBrowserView(view);
    }

    if (this.currentAppId === appId) {
      this.currentAppId = null;
    }
  }

  destroyAppView(appId) {
    const view = this.browserViews.get(appId);
    if (view) {
      if (this.mainWindow) {
        this.mainWindow.removeBrowserView(view);
      }
      // @ts-expect-error - destroy method exists but not in types
      view.webContents.destroy();
      this.browserViews.delete(appId);
    }

    if (this.currentAppId === appId) {
      this.currentAppId = null;
    }
  }

  hibernateApp(appId) {
    const view = this.browserViews.get(appId);
    if (view) {
      // For now, just hide the view. True hibernation would require
      // suspending the renderer process, which is more complex
      this.hideAppView(appId);
      this.updateAppState(appId, { isHibernated);
    }
  }

  wakeApp(appId) {
    const view = this.browserViews.get(appId);
    if (view) {
      this.showAppView(appId);
      this.updateAppState(appId, { isHibernated, lastActiveAt: Date.now() });
    }
  }

  async clearAppSession(appId)= this.browserViews.get(appId);
    if (view) {
      const session = view.webContents.session;
      await session.clearCache();
      await session.clearStorageData();
    }
  }

  updateAppState(
    appId,
    state: Partial<AppInstance['state']>
  ) {
    // This will be handled by IPC to update the store
    // For now, just log
    console.log(`App ${appId} state updated:`, state);
  }

  getCurrentAppId() {
    return this.currentAppId;
  }

  getView(appId) {
    return this.browserViews.get(appId);
  }
}
