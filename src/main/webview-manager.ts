import { app, session, WebContents, webContents as electronWebContents } from 'electron';

interface WebViewEntry {
  webContentsId: number;
  appId: string;
  instanceId: string;
  partitionId: string;
  lastActive: number;
}

/**
 * Manages WebView instances for embedded apps
 * Handles session isolation, navigation control, and view lifecycle
 *
 * Note: Unlike BrowserView, webviews are managed through their webContents
 * and rendered in the DOM by the renderer process. This manager provides
 * control APIs for navigation, zoom, devtools, etc.
 */
export class WebViewManager {
  private views: Map<string, WebViewEntry> = new Map();
  private hibernationCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start hibernation check (every minute)
    this.startHibernationCheck();
  }

  /**
   * Register a webview when it's created in the renderer
   */
  registerWebView(
    webContentsId: number,
    appId: string,
    instanceId: string,
    partitionId: string
  ): void {
    const viewId = this.getViewId(appId, instanceId);

    this.views.set(viewId, {
      webContentsId,
      appId,
      instanceId,
      partitionId,
      lastActive: Date.now(),
    });
  }

  /**
   * Unregister a webview when it's destroyed
   */
  unregisterWebView(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    this.views.delete(viewId);
  }

  /**
   * Get webContents for a webview
   */
  private getWebContents(appId: string, instanceId: string): WebContents | null {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);

    if (!entry) return null;

    try {
      const contents = electronWebContents.fromId(entry.webContentsId);
      return contents ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Navigate to URL
   */
  navigateToURL(appId: string, instanceId: string, url: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.loadURL(url);
    }
  }

  /**
   * Navigation controls
   */
  goBack(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed() && webContents.navigationHistory.canGoBack()) {
      webContents.goBack();
    }
  }

  goForward(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed() && webContents.navigationHistory.canGoForward()) {
      webContents.goForward();
    }
  }

  reload(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.reload();
    }
  }

  forceReload(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.reloadIgnoringCache();
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
    const webContents = this.getWebContents(appId, instanceId);

    if (!webContents || webContents.isDestroyed()) {
      return {
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
        url: '',
      };
    }

    return {
      canGoBack: webContents.navigationHistory.canGoBack(),
      canGoForward: webContents.navigationHistory.canGoForward(),
      isLoading: webContents.isLoading(),
      url: webContents.getURL(),
    };
  }

  /**
   * Set zoom level
   */
  setZoomLevel(appId: string, instanceId: string, zoomFactor: number): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.setZoomFactor(zoomFactor);
    }
  }

  /**
   * Open DevTools for a webview
   */
  openDevTools(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.openDevTools({ mode: 'detach' });
    }
  }

  /**
   * Close DevTools for a webview
   */
  closeDevTools(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.closeDevTools();
    }
  }

  toggleDevTools(appId: string, instanceId: string): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools();
      } else {
        webContents.openDevTools({ mode: 'detach' });
      }
    }
  }

  /**
   * Update last active timestamp
   */
  updateLastActive(appId: string, instanceId: string): void {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);
    if (entry) {
      entry.lastActive = Date.now();
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
   * Get memory usage for a webview
   */
  async getMemoryUsage(
    appId: string,
    instanceId: string
  ): Promise<{
    workingSetSize: number;
    privateBytes: number;
  }> {
    const webContents = this.getWebContents(appId, instanceId);

    if (!webContents || webContents.isDestroyed()) {
      return { workingSetSize: 0, privateBytes: 0 };
    }

    try {
      const pid = webContents.getOSProcessId();
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
   * Get CPU usage for a webview
   */
  getCPUUsage(appId: string, instanceId: string): number {
    const webContents = this.getWebContents(appId, instanceId);

    if (!webContents || webContents.isDestroyed()) {
      return 0;
    }

    try {
      const pid = webContents.getOSProcessId();
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
    // Check every minute for idle webviews
    this.hibernationCheckInterval = setInterval(() => {
      const now = Date.now();
      const idleThresholdMs = 15 * 60 * 1000; // 15 minutes default

      this.views.forEach((entry, viewId) => {
        const idleTime = now - entry.lastActive;

        // Log idle webviews (actual hibernation would need renderer cooperation)
        if (idleTime > idleThresholdMs) {
          console.log(`WebView is idle: ${viewId}`);
          // Note: Hibernation of webviews requires renderer-side implementation
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
   * Get all active webviews
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

    this.views.forEach((entry) => {
      const webContents = this.getWebContents(entry.appId, entry.instanceId);
      if (webContents && !webContents.isDestroyed()) {
        result.push({
          appId: entry.appId,
          instanceId: entry.instanceId,
          partitionId: entry.partitionId,
          lastActive: entry.lastActive,
          isActive: webContents.isFocused(),
        });
      }
    });

    return result;
  }

  /**
   * Cleanup all webviews
   */
  cleanup(): void {
    this.stopHibernationCheck();
    this.views.clear();
  }

  /**
   * Helper to generate view ID
   */
  private getViewId(appId: string, instanceId: string): string {
    return `${appId}-${instanceId}`;
  }
}
