import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

const api = {
  // Profile API
  profile: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_GET),
    create: (name: string) => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_CREATE, name),
    update: (profileId: string, updates: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.PROFILE_UPDATE, profileId, updates),
    delete: (profileId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.PROFILE_DELETE, profileId),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_LIST),
  },

  // Workspace API
  workspace: {
    create: (profileId: string, name: string, icon?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_CREATE, profileId, name, icon),
    update: (workspaceId: string, updates: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_UPDATE, workspaceId, updates),
    delete: (workspaceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_DELETE, workspaceId),
    list: (profileId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_LIST, profileId),
    switch: (workspaceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_SWITCH, workspaceId),
  },

  // App API
  app: {
    create: (workspaceId: string, name: string, url: string, icon?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_CREATE, workspaceId, name, url, icon),
    update: (appId: string, updates: any) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_UPDATE, appId, updates),
    delete: (appId: string) => ipcRenderer.invoke(IPC_CHANNELS.APP_DELETE, appId),
    list: (workspaceId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_LIST, workspaceId),
    hibernate: (appId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_HIBERNATE, appId),
    wake: (appId: string) => ipcRenderer.invoke(IPC_CHANNELS.APP_WAKE, appId),
    clearSession: (appId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_CLEAR_SESSION, appId),
    switch: (appId: string) => ipcRenderer.invoke('app:switch', appId),
  },

  // System events
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels: string[] = [
      IPC_CHANNELS.APP_STATE_CHANGED,
      IPC_CHANNELS.NOTIFICATION,
      IPC_CHANNELS.WORKSPACE_CHANGED,
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

// Type definition for renderer process
export type ElectronAPI = typeof api;
