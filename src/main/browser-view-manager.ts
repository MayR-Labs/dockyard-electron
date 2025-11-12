import { BrowserView, BrowserWindow, session } from 'electron';
import { App, AppInstance } from '../shared/types/app';

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

  constructor() {
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
    if (app.customCSS) {
      view.webContents.on('did-finish-load', () => {
        view.webContents.insertCSS(app.customCSS!);
      });
    }

    if (app.customJS) {
      view.webContents.on('did-finish-load', () => {
        view.webContents.executeJavaScript(app.customJS!);
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
    this.activeViewId = viewId;
  }

  /**
   * Hide all views
   */
  hideAllViews(): void {
    if (!this.mainWindow) return;

    // Get all currently added BrowserViews
    const currentViews = this.mainWindow.getBrowserViews();
    
    // Remove each view
    currentViews.forEach((view) => {
      try {
        this.mainWindow!.removeBrowserView(view);
      } catch (e) {
        // View may already be removed
        console.error('Error removing BrowserView:', e);
      }
    });

    this.activeViewId = null;
  }

  /**
   * Hide a specific view
   */
  hideView(appId: string, instanceId: string): void {
    if (!this.mainWindow) return;

    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry) {
      try {
        this.mainWindow.removeBrowserView(entry.view);
      } catch (e) {
        // View may already be removed
        console.error('Error removing BrowserView:', e);
      }
      
      if (this.activeViewId === viewId) {
        this.activeViewId = null;
      }
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

    if (entry && !entry.view.webContents.isDestroyed() && entry.view.webContents.canGoBack()) {
      entry.view.webContents.goBack();
    }
  }

  goForward(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed() && entry.view.webContents.canGoForward()) {
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
      canGoBack: entry.view.webContents.canGoBack(),
      canGoForward: entry.view.webContents.canGoForward(),
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
   */
  hibernateView(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (entry && !entry.view.webContents.isDestroyed()) {
      // Remove from window but keep in memory
      if (this.mainWindow && this.activeViewId === viewId) {
        this.mainWindow.removeBrowserView(entry.view);
        this.activeViewId = null;
      }

      // Note: We don't destroy the view, just hide it
      // The OS/Electron will manage memory for background tabs
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
        } catch (e) {
          // View may already be removed
        }
        this.activeViewId = null;
      }

      // Destroy the view
      if (!entry.view.webContents.isDestroyed()) {
        (entry.view.webContents as any).destroy();
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
      const appMetrics = require('electron').app.getAppMetrics();
      const processMetrics = appMetrics.find((m: any) => m.pid === pid);

      if (processMetrics && processMetrics.memory) {
        return {
          workingSetSize: processMetrics.memory.workingSetSize || 0,
          privateBytes: processMetrics.memory.privateBytes || 0,
        };
      }
    } catch (e) {
      console.error('Failed to get memory usage:', e);
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
      const appMetrics = require('electron').app.getAppMetrics();
      const processMetrics = appMetrics.find((m: any) => m.pid === pid);

      if (processMetrics && processMetrics.cpu) {
        return processMetrics.cpu.percentCPUUsage || 0;
      }
    } catch (e) {
      console.error('Failed to get CPU usage:', e);
    }

    return 0;
  }

  /**
   * Start automatic hibernation check
   */
  private startHibernationCheck(): void {
    // Check every minute for idle apps
    this.hibernationCheckInterval = setInterval(() => {
      const now = Date.now();
      const idleThresholdMs = 15 * 60 * 1000; // 15 minutes default

      this.views.forEach((entry, viewId) => {
        const idleTime = now - entry.lastActive;

        // Hibernate if idle and not active
        if (idleTime > idleThresholdMs && this.activeViewId !== viewId) {
          console.log(`Auto-hibernating idle view: ${viewId}`);
          this.hibernateView(entry.appId, entry.instanceId);
        }
      });
    }, 60 * 1000); // Check every minute
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
        (entry.view.webContents as any).destroy();
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
