import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, IPC_EVENTS } from '../shared/constants';
import type { DockyardAPI } from '../shared/types/preload';

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
    hibernate: (id) => ipcRenderer.invoke(IPC_CHANNELS.APP.HIBERNATE, id),
    resume: (id) => ipcRenderer.invoke(IPC_CHANNELS.APP.RESUME, id),
  },

  // Settings APIs
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
    update: (data) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.UPDATE, data),
  },

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels: string[] = [
      IPC_EVENTS.WORKSPACE_CHANGED,
      IPC_EVENTS.APP_UPDATED,
      IPC_EVENTS.NOTIFICATION,
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('dockyard', dockyardAPI);
