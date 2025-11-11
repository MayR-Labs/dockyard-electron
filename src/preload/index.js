import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

const api = {
  // Profile API
  profile: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_GET),
    create: (name) => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_CREATE, name),
    update: (profileId, updates) =>
      ipcRenderer.invoke(IPC_CHANNELS.PROFILE_UPDATE, profileId, updates),
    delete: (profileId) =>
      ipcRenderer.invoke(IPC_CHANNELS.PROFILE_DELETE, profileId),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILE_LIST),
  },

  // Workspace API
  workspace: {
    create: (profileId, name, icon) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_CREATE, profileId, name, icon),
    update: (workspaceId, updates) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_UPDATE, workspaceId, updates),
    delete: (workspaceId) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_DELETE, workspaceId),
    list: (profileId) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_LIST, profileId),
    switch: (workspaceId) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSPACE_SWITCH, workspaceId),
  },

  // App API
  app: {
    create: (workspaceId, name, url, icon) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_CREATE, workspaceId, name, url, icon),
    update: (appId, updates) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_UPDATE, appId, updates),
    delete: (appId) => ipcRenderer.invoke(IPC_CHANNELS.APP_DELETE, appId),
    list: (workspaceId) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_LIST, workspaceId),
    hibernate: (appId) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_HIBERNATE, appId),
    wake: (appId) => ipcRenderer.invoke(IPC_CHANNELS.APP_WAKE, appId),
    clearSession: (appId) =>
      ipcRenderer.invoke(IPC_CHANNELS.APP_CLEAR_SESSION, appId),
    switch: (appId) => ipcRenderer.invoke('app:switch', appId),
  },

  // System events
  on: (channel, callback: (...args) => void) => {
    const validChannels= [
      IPC_CHANNELS.APP_STATE_CHANGED,
      IPC_CHANNELS.NOTIFICATION,
      IPC_CHANNELS.WORKSPACE_CHANGED,
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  off: (channel, callback: (...args) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

// Type definition for renderer process

