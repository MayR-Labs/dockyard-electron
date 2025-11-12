import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, IPC_EVENTS } from '../shared/constants';
import type { DockyardAPI } from '../shared/types/preload';

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
    hibernate: (appId: string, instanceId: string) => ipcRenderer.invoke(IPC_CHANNELS.APP.HIBERNATE, appId, instanceId),
    resume: (appId: string, instanceId: string) => ipcRenderer.invoke(IPC_CHANNELS.APP.RESUME, appId, instanceId),
  },

  // BrowserView APIs
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
    getState: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_STATE, appId, instanceId),
    setZoom: (appId: string, instanceId: string, zoomFactor: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.SET_ZOOM, appId, instanceId, zoomFactor),
    openDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.OPEN_DEVTOOLS, appId, instanceId),
    closeDevTools: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.CLOSE_DEVTOOLS, appId, instanceId),
    clearSession: (partitionId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.CLEAR_SESSION, partitionId),
    getMemory: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_MEMORY, appId, instanceId),
    getCPU: (appId: string, instanceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_CPU, appId, instanceId),
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.BROWSER_VIEW.GET_ALL),
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

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels: string[] = [
      IPC_EVENTS.WORKSPACE_CHANGED,
      IPC_EVENTS.APP_UPDATED,
      IPC_EVENTS.NOTIFICATION,
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('dockyard', dockyardAPI);

console.log('✅ Dockyard API exposed to renderer via contextBridge');
console.log('API includes:', Object.keys(dockyardAPI));
