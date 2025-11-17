/**
 * WebView IPC Handlers
 * Single Responsibility: Handle webview-related IPC communications
 *
 * Note: Unlike BrowserView which was controlled entirely from main process,
 * webviews are rendered in the DOM. This handler provides control APIs for
 * navigation, zoom, devtools, etc. but doesn't handle positioning/visibility.
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { WebViewManager } from '../webview-manager';

export class WebViewHandlers {
  constructor(private webViewManager: WebViewManager) {
    this.register();
  }

  private register(): void {
    this.registerRegisterHandler();
    this.registerUnregisterHandler();
    this.registerNavigateHandler();
    this.registerGoBackHandler();
    this.registerGoForwardHandler();
    this.registerReloadHandler();
    this.registerForceReloadHandler();
    this.registerGetStateHandler();
    this.registerSetZoomHandler();
    this.registerOpenDevToolsHandler();
    this.registerCloseDevToolsHandler();
    this.registerToggleDevToolsHandler();
    this.registerClearSessionHandler();
    this.registerGetMemoryHandler();
    this.registerGetCPUHandler();
    this.registerGetAllHandler();
    this.registerUpdateActiveHandler();
    this.registerInjectCSSHandler();
    this.registerInjectJSHandler();
    this.registerFindInPageHandler();
    this.registerStopFindInPageHandler();
    this.registerPrintHandler();
    this.registerSetUserAgentHandler();
  }

  private registerRegisterHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.REGISTER,
      async (
        _event,
        webContentsId: number,
        appId: string,
        instanceId: string,
        partitionId: string
      ) => {
        this.webViewManager.registerWebView(webContentsId, appId, instanceId, partitionId);
      }
    );
  }

  private registerUnregisterHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.UNREGISTER,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.unregisterWebView(appId, instanceId);
      }
    );
  }

  private registerNavigateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.NAVIGATE,
      async (_event, appId: string, instanceId: string, url: string) => {
        this.webViewManager.navigateToURL(appId, instanceId, url);
      }
    );
  }

  private registerGoBackHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.GO_BACK,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.goBack(appId, instanceId);
      }
    );
  }

  private registerGoForwardHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.GO_FORWARD,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.goForward(appId, instanceId);
      }
    );
  }

  private registerReloadHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.RELOAD,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.reload(appId, instanceId);
      }
    );
  }

  private registerForceReloadHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.FORCE_RELOAD,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.forceReload(appId, instanceId);
      }
    );
  }

  private registerGetStateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.GET_STATE,
      async (_event, appId: string, instanceId: string) => {
        return this.webViewManager.getNavigationState(appId, instanceId);
      }
    );
  }

  private registerSetZoomHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.SET_ZOOM,
      async (_event, appId: string, instanceId: string, zoomFactor: number) => {
        this.webViewManager.setZoomLevel(appId, instanceId, zoomFactor);
      }
    );
  }

  private registerOpenDevToolsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.OPEN_DEVTOOLS,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.openDevTools(appId, instanceId);
      }
    );
  }

  private registerCloseDevToolsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.CLOSE_DEVTOOLS,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.closeDevTools(appId, instanceId);
      }
    );
  }

  private registerToggleDevToolsHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.TOGGLE_DEVTOOLS,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.toggleDevTools(appId, instanceId);
      }
    );
  }

  private registerClearSessionHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WEBVIEW.CLEAR_SESSION, async (_event, partitionId: string) => {
      await this.webViewManager.clearSessionData(partitionId);
    });
  }

  private registerGetMemoryHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.GET_MEMORY,
      async (_event, appId: string, instanceId: string) => {
        return await this.webViewManager.getMemoryUsage(appId, instanceId);
      }
    );
  }

  private registerGetCPUHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.GET_CPU,
      async (_event, appId: string, instanceId: string) => {
        return this.webViewManager.getCPUUsage(appId, instanceId);
      }
    );
  }

  private registerGetAllHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WEBVIEW.GET_ALL, async () => {
      return this.webViewManager.getAllViews();
    });
  }

  private registerUpdateActiveHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.UPDATE_ACTIVE,
      async (_event, appId: string, instanceId: string) => {
        this.webViewManager.updateLastActive(appId, instanceId);
      }
    );
  }

  private registerInjectCSSHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.INJECT_CSS,
      async (_event, appId: string, instanceId: string, css: string) => {
        return this.webViewManager.injectCSS(appId, instanceId, css);
      }
    );
  }

  private registerInjectJSHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.INJECT_JS,
      async (_event, appId: string, instanceId: string, js: string) => {
        return this.webViewManager.injectJS(appId, instanceId, js);
      }
    );
  }

  private registerFindInPageHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.FIND_IN_PAGE,
      async (
        _event,
        appId: string,
        instanceId: string,
        text: string,
        options?: Electron.FindInPageOptions
      ) => {
        this.webViewManager.findInPage(appId, instanceId, text, options);
      }
    );
  }

  private registerStopFindInPageHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.STOP_FIND_IN_PAGE,
      async (
        _event,
        appId: string,
        instanceId: string,
        action: 'clearSelection' | 'keepSelection' | 'activateSelection'
      ) => {
        this.webViewManager.stopFindInPage(appId, instanceId, action);
      }
    );
  }

  private registerPrintHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.PRINT,
      async (
        _event,
        appId: string,
        instanceId: string,
        options?: Electron.WebContentsPrintOptions
      ) => {
        this.webViewManager.print(appId, instanceId, options);
      }
    );
  }

  private registerSetUserAgentHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WEBVIEW.SET_USER_AGENT,
      async (_event, appId: string, instanceId: string, userAgent?: string | null) => {
        await this.webViewManager.setUserAgent(appId, instanceId, userAgent ?? undefined);
      }
    );
  }
}
