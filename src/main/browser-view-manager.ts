import { app, BrowserView, BrowserWindow, session } from 'electron';
import { App, AppInstance, Workspace } from '../shared/types';
import { StoreManager } from './store-manager';

interface BrowserViewEntry {
  view: BrowserView;
  appId: string;
  instanceId: string;
  partitionId: string;
  lastActive: number;
}

/**
 * Manages BrowserView instances for embedded apps
 * Handles session isolation, navigation, and view lifecycle
 */
export class BrowserViewManager {
  private views: Map<string, BrowserViewEntry> = new Map();
  private mainWindow: BrowserWindow | null = null;
  private activeViewId: string | null = null;
  private hibernationCheckInterval: NodeJS.Timeout | null = null;
  private storeManager: StoreManager | null = null;

  constructor(storeManager?: StoreManager) {
    this.storeManager = storeManager || null;
    // Start hibernation check (every minute)
    this.startHibernationCheck();
  }

  /**
   * Set the main window reference
   */
  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }

  /**
   * Create or get a BrowserView for an app instance
   */
  getOrCreateView(app: App, instance: AppInstance): BrowserView {
    const viewId = this.getViewId(app.id, instance.id);

    let entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      // Resume if hibernated
      if (instance.hibernated) {
        this.resumeView(app.id, instance.id);
      }
      return entry.view;
    }

    // Create new view with session partition
    const view = new BrowserView({
      webPreferences: {
        partition: instance.partitionId,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
    });

    // Load the app URL
    view.webContents.loadURL(app.url);

    // Apply custom CSS/JS if provided
    const customCSS = app.customCSS;
    if (customCSS) {
      view.webContents.on('did-finish-load', () => {
        view.webContents.insertCSS(customCSS);
      });
    }

    const customJS = app.customJS;
    if (customJS) {
      view.webContents.on('did-finish-load', () => {
        void view.webContents.executeJavaScript(customJS);
      });
    }

    // Apply zoom level if set
    if (app.display?.zoomLevel) {
      view.webContents.setZoomFactor(app.display.zoomLevel);
    }

    entry = {
      view,
      appId: app.id,
      instanceId: instance.id,
      partitionId: instance.partitionId,
      lastActive: Date.now(),
    };

    this.views.set(viewId, entry);
    return view;
  }

  /**
   * Show a view in the main window
   */
  showView(appId: string, instanceId: string, bounds?: Electron.Rectangle): void {
    if (!this.mainWindow) return;

    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (!entry) return;

    // Check if the view is already added to the window
    const currentViews = this.mainWindow.getBrowserViews();
    const isAlreadyAdded = currentViews.some((v) => v === entry.view);

    // Add the view if not already added
    if (!isAlreadyAdded) {
      this.mainWindow.addBrowserView(entry.view);
    }

    if (bounds) {
      entry.view.setBounds(bounds);
    }

    entry.lastActive = Date.now();

    // Hide the previously active view if switching to a new one
    if (this.activeViewId && this.activeViewId !== viewId) {
      this.hideViewOffScreen(this.activeViewId);
    }

    this.activeViewId = viewId;
  }

  /**
   * Hide a view by moving it off-screen instead of removing it
   * This keeps the view alive and maintains its state
   */
  private hideViewOffScreen(viewId: string): void {
    const entry = this.views.get(viewId);
    if (entry && !entry.view.webContents.isDestroyed()) {
      // Move view off-screen to hide it while keeping it alive
      entry.view.setBounds({ x: -10000, y: -10000, width: 1, height: 1 });
    }
  }

  /**
   * Hide all views by moving them off-screen
   * This keeps views alive and maintains their state
   */
  hideAllViews(): void {
    if (!this.mainWindow) return;

    // Hide all views off-screen instead of removing them
    this.views.forEach((entry, viewId) => {
      if (!entry.view.webContents.isDestroyed()) {
        this.hideViewOffScreen(viewId);
      }
    });

    this.activeViewId = null;
  }

  /**
   * Hide a specific view by moving it off-screen
   */
  hideView(appId: string, instanceId: string): void {
    if (!this.mainWindow) return;

    const viewId = this.getViewId(appId, instanceId);
    this.hideViewOffScreen(viewId);

    if (this.activeViewId === viewId) {
      this.activeViewId = null;
    }
  }

  /**
   * Update view bounds
   */
  updateViewBounds(appId: string, instanceId: string, bounds: Electron.Rectangle): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.setBounds(bounds);
    }
  }

  /**
   * Navigate to URL
   */
  navigateToURL(appId: string, instanceId: string, url: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.loadURL(url);
    }
  }

  /**
   * Navigation controls
   */
  goBack(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (
      entry &&
      !entry.view.webContents.isDestroyed() &&
      entry.view.webContents.navigationHistory.canGoBack()
    ) {
      entry.view.webContents.goBack();
    }
  }

  goForward(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (
      entry &&
      !entry.view.webContents.isDestroyed() &&
      entry.view.webContents.navigationHistory.canGoForward()
    ) {
      entry.view.webContents.goForward();
    }
  }

  reload(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.reload();
    }
  }

  forceReload(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.reloadIgnoringCache();
    }
  }

  /**
   * Get navigation state
   */
  getNavigationState(
    appId: string,
    instanceId: string
  ): {
    canGoBack: boolean;
    canGoForward: boolean;
    isLoading: boolean;
    url: string;
  } {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (!entry || entry.view.webContents.isDestroyed()) {
      return {
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
        url: '',
      };
    }

    return {
      canGoBack: entry.view.webContents.navigationHistory.canGoBack(),
      canGoForward: entry.view.webContents.navigationHistory.canGoForward(),
      isLoading: entry.view.webContents.isLoading(),
      url: entry.view.webContents.getURL(),
    };
  }

  /**
   * Set zoom level
   */
  setZoomLevel(appId: string, instanceId: string, zoomFactor: number): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.setZoomFactor(zoomFactor);
    }
  }

  /**
   * Open DevTools for a view
   */
  openDevTools(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.openDevTools();
    }
  }

  toggleDevTools(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      if (entry.view.webContents.isDevToolsOpened()) {
        entry.view.webContents.closeDevTools();
      } else {
        entry.view.webContents.openDevTools({ mode: 'right' });
      }
    }
  }

  /**
   * Close DevTools for a view
   */
  closeDevTools(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.view.webContents.closeDevTools();
    }
  }

  /**
   * Hibernate (suspend) a view to save resources
   * This actually removes the view from the window to free memory
   */
  hibernateView(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      // Remove from window to save resources
      if (this.mainWindow) {
        try {
          this.mainWindow.removeBrowserView(entry.view);
        } catch (error) {
          // View may already be removed
          console.error('Error removing BrowserView during hibernation:', error);
        }
      }

      if (this.activeViewId === viewId) {
        this.activeViewId = null;
      }

      // Note: We don't destroy the view, just remove it from window
      // The view can be re-added when needed
      console.log(`Hibernated view: ${viewId}`);
    }
  }

  /**
   * Resume a hibernated view
   */
  resumeView(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      entry.lastActive = Date.now();
      console.log(`Resumed view: ${viewId}`);
    }
  }

  /**
   * Destroy a view completely
   */
  destroyView(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry) {
      // Remove from window if active
      if (this.mainWindow && this.activeViewId === viewId) {
        try {
          this.mainWindow.removeBrowserView(entry.view);
        } catch (error) {
          console.warn('BrowserView removal failed during destroyView', error);
        }
        this.activeViewId = null;
      }

      // Destroy the view
      if (!entry.view.webContents.isDestroyed()) {
        entry.view.webContents.close({ waitForBeforeUnload: false });
      }

      this.views.delete(viewId);
    }
  }

  /**
   * Clear cache and cookies for a session
   */
  async clearSessionData(partitionId: string): Promise<void> {
    const ses = session.fromPartition(partitionId);

    // Clear cache
    await ses.clearCache();

    // Clear cookies
    const cookies = await ses.cookies.get({});
    for (const cookie of cookies) {
      const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
      await ses.cookies.remove(url, cookie.name);
    }

    // Clear storage data
    await ses.clearStorageData();
  }

  /**
   * Get memory usage for a view
   */
  async getMemoryUsage(
    appId: string,
    instanceId: string
  ): Promise<{
    workingSetSize: number;
    privateBytes: number;
  }> {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (!entry || entry.view.webContents.isDestroyed()) {
      return { workingSetSize: 0, privateBytes: 0 };
    }

    try {
      // Use process manager to get memory info
      const pid = entry.view.webContents.getOSProcessId();
      const appMetrics = app.getAppMetrics();
      const processMetrics = appMetrics.find((metric) => metric.pid === pid);

      if (processMetrics && processMetrics.memory) {
        return {
          workingSetSize: processMetrics.memory.workingSetSize || 0,
          privateBytes: processMetrics.memory.privateBytes || 0,
        };
      }
    } catch (error) {
      console.error('Failed to get memory usage:', error);
    }

    return { workingSetSize: 0, privateBytes: 0 };
  }

  /**
   * Get CPU usage for a view
   */
  getCPUUsage(appId: string, instanceId: string): number {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (!entry || entry.view.webContents.isDestroyed()) {
      return 0;
    }

    try {
      // Use process manager to get CPU usage
      const pid = entry.view.webContents.getOSProcessId();
      const appMetrics = app.getAppMetrics();
      const processMetrics = appMetrics.find((metric) => metric.pid === pid);

      if (processMetrics && processMetrics.cpu) {
        return processMetrics.cpu.percentCPUUsage || 0;
      }
    } catch (error) {
      console.error('Failed to get CPU usage:', error);
    }

    return 0;
  }

  /**
   * Start automatic hibernation check
   */
  private startHibernationCheck(): void {
    // Check every minute for idle apps
    this.hibernationCheckInterval = setInterval(() => {
      this.performHibernationCheck();
    }, 60 * 1000); // Check every minute
  }

  /**
   * Perform hibernation check for all views
   */
  private performHibernationCheck(): void {
    if (!this.storeManager) {
      return; // Cannot perform check without store manager
    }

    const now = Date.now();
    const appsStore = this.storeManager.getAppsStore();
    const workspacesStore = this.storeManager.getWorkspacesStore();
    const apps = appsStore.get('apps', []);
    const workspaces = workspacesStore.get('workspaces', []);

    this.views.forEach((entry, viewId) => {
      // Skip if this is the active view
      if (this.activeViewId === viewId) {
        return;
      }

      // Find the app and its workspace
      const app = apps.find((a: App) => a.id === entry.appId);
      if (!app) {
        return;
      }

      const workspace = workspaces.find((w: Workspace) => w.id === app.workspaceId);
      if (!workspace) {
        return;
      }

      // Check if hibernation is enabled for this workspace
      if (!workspace.hibernation?.enabled) {
        return;
      }

      // Get idle threshold from workspace settings (default to 15 minutes)
      const idleTimeMinutes = workspace.hibernation?.idleTimeMinutes || 15;
      const idleThresholdMs = idleTimeMinutes * 60 * 1000;

      const idleTime = now - entry.lastActive;

      // Hibernate if idle time exceeds threshold
      if (idleTime > idleThresholdMs) {
        console.log(
          `Auto-hibernating idle view: ${viewId} (idle for ${Math.round(idleTime / 60000)} minutes, threshold: ${idleTimeMinutes} minutes)`
        );
        this.hibernateView(entry.appId, entry.instanceId);

        // Update app instance state to reflect hibernation
        const instance = app.instances.find((inst: AppInstance) => inst.id === entry.instanceId);
        if (instance) {
          instance.hibernated = true;
          instance.lastActive = new Date().toISOString();
          appsStore.set('apps', apps);
        }
      }
    });
  }

  /**
   * Stop hibernation check
   */
  stopHibernationCheck(): void {
    if (this.hibernationCheckInterval) {
      clearInterval(this.hibernationCheckInterval);
      this.hibernationCheckInterval = null;
    }
  }

  /**
   * Get all active views
   */
  getAllViews(): Array<{
    appId: string;
    instanceId: string;
    partitionId: string;
    lastActive: number;
    isActive: boolean;
  }> {
    const result: Array<{
      appId: string;
      instanceId: string;
      partitionId: string;
      lastActive: number;
      isActive: boolean;
    }> = [];

    this.views.forEach((entry, viewId) => {
      if (!entry.view.webContents.isDestroyed()) {
        result.push({
          appId: entry.appId,
          instanceId: entry.instanceId,
          partitionId: entry.partitionId,
          lastActive: entry.lastActive,
          isActive: this.activeViewId === viewId,
        });
      }
    });

    return result;
  }

  /**
   * Cleanup all views
   */
  cleanup(): void {
    this.stopHibernationCheck();

    this.views.forEach((entry) => {
      if (!entry.view.webContents.isDestroyed()) {
        entry.view.webContents.close({ waitForBeforeUnload: false });
      }
    });

    this.views.clear();
    this.activeViewId = null;
  }

  /**
   * Helper to generate view ID
   */
  private getViewId(appId: string, instanceId: string): string {
    return `${appId}-${instanceId}`;
  }
}
