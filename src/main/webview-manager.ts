import {
  app,
  BrowserWindow,
  session,
  WebContents,
  webContents as electronWebContents,
} from 'electron';
import { DEFAULTS, IPC_EVENTS } from '../shared/constants';
import { App, Workspace } from '../shared/types';
import { StoreManager } from './store-manager';

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
  private storeManager: StoreManager | null = null;

  constructor(storeManager?: StoreManager) {
    this.storeManager = storeManager || null;
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
   * Trigger find-in-page
   */
  findInPage(
    appId: string,
    instanceId: string,
    text: string,
    options?: Electron.FindInPageOptions
  ): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.findInPage(text, options);
    }
  }

  stopFindInPage(
    appId: string,
    instanceId: string,
    action: 'clearSelection' | 'keepSelection' | 'activateSelection'
  ): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.stopFindInPage(action);
    }
  }

  print(appId: string, instanceId: string, options?: Electron.WebContentsPrintOptions): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (!webContents || webContents.isDestroyed()) {
      return;
    }

    const mergedOptions: Electron.WebContentsPrintOptions = {
      silent: false,
      printBackground: true,
      ...options,
    };

    try {
      webContents.focus();
    } catch (error) {
      console.warn('Failed to focus webContents before printing', error);
    }

    webContents.print(mergedOptions, (success, failureReason) => {
      if (success) {
        return;
      }

      console.warn('webContents.print failed, falling back to window.print()', failureReason);
      webContents.executeJavaScript('window.print()', true).catch((error: unknown) => {
        console.error('Fallback window.print() failed', error);
      });
    });
  }

  async setUserAgent(appId: string, instanceId: string, userAgent?: string | null): Promise<void> {
    const viewId = this.getViewId(appId, instanceId);
    const entry = this.views.get(viewId);
    if (!entry) return;

    const contents = this.getWebContents(appId, instanceId);
    if (!contents || contents.isDestroyed()) return;

    // Update the persisted entry so new navigations reuse the UA
    if (userAgent) {
      contents.setUserAgent(userAgent);
    } else {
      // Reset by clearing override (Electron lacks direct API; reload default by using session user agent)
      const defaultAgent = contents.session.getUserAgent();
      contents.setUserAgent(defaultAgent);
    }
  }

  setAudioMuted(appId: string, instanceId: string, muted: boolean): void {
    const webContents = this.getWebContents(appId, instanceId);
    if (webContents && !webContents.isDestroyed()) {
      webContents.setAudioMuted(muted);
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
    await ses.clearStorageData({ storages: ['cookies'] });

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
      this.performHibernationCheck();
    }, 60 * 1000); // Check every minute
  }

  /**
   * Perform hibernation check for all webviews
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
      // Find the app and its workspace
      const app = apps.find((a: App) => a.id === entry.appId);
      if (!app) {
        return;
      }

      const workspace = workspaces.find((w: Workspace) => w.id === app.workspaceId);
      if (!workspace) {
        return;
      }

      const workspaceHibernation = workspace.hibernation ?? {
        enabled: true,
        idleTimeMinutes: DEFAULTS.IDLE_TIME_MINUTES,
      };

      // Check if hibernation is enabled for this workspace
      if (!workspaceHibernation.enabled) {
        return;
      }

      const idleTimeMinutes =
        app.hibernation?.idleTimeMinutes ??
        workspaceHibernation.idleTimeMinutes ??
        DEFAULTS.IDLE_TIME_MINUTES;
      const idleThresholdMs = idleTimeMinutes * 60 * 1000;

      const instance = app.instances.find((inst) => inst.id === entry.instanceId);
      if (!instance) {
        this.views.delete(viewId);
        return;
      }

      if (instance.hibernated) {
        this.views.delete(viewId);
        return;
      }

      const idleTime = now - entry.lastActive;

      if (idleTime > idleThresholdMs) {
        console.log(
          `Requesting hibernation for idle webview: ${viewId} (idle for ${Math.round(idleTime / 60000)} minutes, threshold: ${idleTimeMinutes} minutes)`
        );

        this.emitAppHibernateRequest(entry.appId, entry.instanceId, idleTimeMinutes);
        // this.views.delete(viewId);
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

  private emitAppUpdated(appId: string): void {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(IPC_EVENTS.APP_UPDATED, { appId });
    });
  }

  private emitAppHibernateRequest(appId: string, instanceId: string, idleTimeMinutes: number): void {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(IPC_EVENTS.APP_HIBERNATE_REQUEST, {
        appId,
        instanceId,
        reason: 'idle-timeout',
        idleTimeMinutes,
      });
    });
  }

  /**
   * Cleanup all webviews
   */
  cleanup(): void {
    this.stopHibernationCheck();
    this.views.clear();
  }

  /**
   * Inject CSS into a webview
   */
  async injectCSS(appId: string, instanceId: string, css: string): Promise<void> {
    const viewId = this.getViewId(appId, instanceId);
    const view = this.views.get(viewId);
    if (!view) {
      throw new Error(`WebView not found: ${viewId}`);
    }

    try {
      const webContents = electronWebContents.fromId(view.webContentsId);
      if (!webContents) {
        throw new Error(`WebContents not found for ${viewId}`);
      }
      await webContents.insertCSS(css);
    } catch (error) {
      console.error(`Failed to inject CSS into ${viewId}:`, error);
      throw error;
    }
  }

  /**
   * Inject JavaScript into a webview
   */
  async injectJS(appId: string, instanceId: string, js: string): Promise<void> {
    const viewId = this.getViewId(appId, instanceId);
    const view = this.views.get(viewId);
    if (!view) {
      throw new Error(`WebView not found: ${viewId}`);
    }

    try {
      const webContents = electronWebContents.fromId(view.webContentsId);
      if (!webContents) {
        throw new Error(`WebContents not found for ${viewId}`);
      }
      await webContents.executeJavaScript(js);
    } catch (error) {
      console.error(`Failed to inject JS into ${viewId}:`, error);
      throw error;
    }
  }

  /**
   * Helper to generate view ID
   */
  private getViewId(appId: string, instanceId: string): string {
    return `${appId}-${instanceId}`;
  }
}
