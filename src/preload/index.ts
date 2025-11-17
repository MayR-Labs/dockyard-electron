import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, IPC_EVENTS } from '../shared/constants';
import type { DockyardAPI } from '../shared/types/preload';

const validEventChannels = [
  IPC_EVENTS.WORKSPACE_CHANGED,
  IPC_EVENTS.APP_UPDATED,
  IPC_EVENTS.NOTIFICATION,
  IPC_EVENTS.SHORTCUT_RELOAD,
  IPC_EVENTS.SHORTCUT_FORCE_RELOAD,
  IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS,
] as const;

type DockyardEventChannel = (typeof validEventChannels)[number];
type DockyardEventListener = (...args: unknown[]) => void;
type IpcRendererListener = Parameters<typeof ipcRenderer.on>[1];

const listenerMap = new Map<
  DockyardEventChannel,
  Map<DockyardEventListener, IpcRendererListener>
>();

const isValidChannel = (channel: string): channel is DockyardEventChannel =>
  validEventChannels.includes(channel as DockyardEventChannel);

const registerListener = (channel: DockyardEventChannel, callback: DockyardEventListener): void => {
  const wrappedListener: IpcRendererListener = (_event, ...args) => {
    callback(...args);
  };

  const channelListeners = listenerMap.get(channel) ?? new Map();
  channelListeners.set(callback, wrappedListener);
  listenerMap.set(channel, channelListeners);
  ipcRenderer.on(channel, wrappedListener);
};

const unregisterListener = (
  channel: DockyardEventChannel,
  callback: DockyardEventListener
): void => {
  const channelListeners = listenerMap.get(channel);
  if (!channelListeners) {
    return;
  }

  const wrappedListener = channelListeners.get(callback);
  if (!wrappedListener) {
    return;
  }

  ipcRenderer.removeListener(channel, wrappedListener);
  channelListeners.delete(callback);

  if (channelListeners.size === 0) {
    listenerMap.delete(channel);
  }
};

console.log('🔧 Preload script is executing...');

// Expose safe API to renderer process
const dockyardAPI: DockyardAPI = {
  // Profile APIs
  profiles: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE.LIST),
    create: (name: string) => ipcRenderer.invoke(IPC_CHANNELS.PROFILE.CREATE, name),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PROFILE.DELETE, id),
    switch: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.PROFILE.SWITCH, id),
    getCurrent: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE.GET_CURRENT),
  },

  // Workspace APIs
  workspaces: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.LIST),
    create: (data) => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.CREATE, data),
    update: (id, data) => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.UPDATE, id, data),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.DELETE, id),
    switch: (id) => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.SWITCH, id),
    getActive: () => ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE.GET_ACTIVE),
  },

  // App APIs
  apps: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.APP.LIST),
    create: (data) => ipcRenderer.invoke(IPC_CHANNELS.APP.CREATE, data),
    update: (id, data) => ipcRenderer.invoke(IPC_CHANNELS.APP.UPDATE, id, data),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.APP.DELETE, id),
    hibernate: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP.HIBERNATE, appId, instanceId),
    resume: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP.RESUME, appId, instanceId),
    createInstance: (appId: string, data: { name?: string; sessionMode?: 'isolated' | 'shared' }) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP.CREATE_INSTANCE, appId, data),
  },

  // BrowserView APIs (legacy)
  browserView: {
    show: (appId: string, instanceId: string, bounds?: Electron.Rectangle) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.SHOW, appId, instanceId, bounds),
    hide: () => ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.HIDE),
    updateBounds: (appId: string, instanceId: string, bounds: Electron.Rectangle) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.UPDATE_BOUNDS, appId, instanceId, bounds),
    navigate: (appId: string, instanceId: string, url: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.NAVIGATE, appId, instanceId, url),
    goBack: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GO_BACK, appId, instanceId),
    goForward: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GO_FORWARD, appId, instanceId),
    reload: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.RELOAD, appId, instanceId),
    forceReload: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.FORCE_RELOAD, appId, instanceId),
    getState: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_STATE, appId, instanceId),
    setZoom: (appId: string, instanceId: string, zoomFactor: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.SET_ZOOM, appId, instanceId, zoomFactor),
    openDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.OPEN_DEVTOOLS, appId, instanceId),
    closeDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.CLOSE_DEVTOOLS, appId, instanceId),
    toggleDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.TOGGLE_DEVTOOLS, appId, instanceId),
    clearSession: (partitionId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.CLEAR_SESSION, partitionId),
    getMemory: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_MEMORY, appId, instanceId),
    getCPU: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_CPU, appId, instanceId),
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_ALL),
  },

  // WebView APIs (new)
  webview: {
    register: (webContentsId: number, appId: string, instanceId: string, partitionId: string) =>
      ipcRenderer.invoke(
        IPC_CHANNELS.WEBVIEW.REGISTER,
        webContentsId,
        appId,
        instanceId,
        partitionId
      ),
    unregister: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.UNREGISTER, appId, instanceId),
    navigate: (appId: string, instanceId: string, url: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.NAVIGATE, appId, instanceId, url),
    goBack: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GO_BACK, appId, instanceId),
    goForward: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GO_FORWARD, appId, instanceId),
    reload: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.RELOAD, appId, instanceId),
    forceReload: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.FORCE_RELOAD, appId, instanceId),
    getState: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GET_STATE, appId, instanceId),
    setZoom: (appId: string, instanceId: string, zoomFactor: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.SET_ZOOM, appId, instanceId, zoomFactor),
    openDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.OPEN_DEVTOOLS, appId, instanceId),
    closeDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.CLOSE_DEVTOOLS, appId, instanceId),
    toggleDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.TOGGLE_DEVTOOLS, appId, instanceId),
    clearSession: (partitionId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.CLEAR_SESSION, partitionId),
    getMemory: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GET_MEMORY, appId, instanceId),
    getCPU: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GET_CPU, appId, instanceId),
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.GET_ALL),
    updateActive: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.UPDATE_ACTIVE, appId, instanceId),
    injectCSS: (appId: string, instanceId: string, css: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.INJECT_CSS, appId, instanceId, css),
    injectJS: (appId: string, instanceId: string, js: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WEBVIEW.INJECT_JS, appId, instanceId, js),
  },

  // Settings APIs
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
    update: (data) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.UPDATE, data),
  },

  // Notification APIs
  notifications: {
    show: (options: { title: string; body: string; icon?: string; silent?: boolean }) =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATION.SHOW, options),
    updateBadge: (appId: string, count: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATION.UPDATE_BADGE, appId, count),
  },

  // Window APIs
  window: {
    toggleDevTools: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.TOGGLE_DEVTOOLS),
  },

  // Event listeners
  on: (channel: string, callback: DockyardEventListener) => {
    if (isValidChannel(channel)) {
      registerListener(channel, callback);
    }
  },

  off: (channel: string, callback: DockyardEventListener) => {
    if (isValidChannel(channel)) {
      unregisterListener(channel, callback);
    }
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('dockyard', dockyardAPI);

console.log('✅ Dockyard API exposed to renderer via contextBridge');
console.log('API includes:', Object.keys(dockyardAPI));
