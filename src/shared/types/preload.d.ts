import { IPC_EVENTS } from '../constants';
import { ProfileMetadata } from './profile';
import { Workspace } from './workspace';
import { App } from './app';
import { Settings } from './settings';

export type DockyardEventChannel = (typeof IPC_EVENTS)[keyof typeof IPC_EVENTS];
export type DockyardEventListener = (...args: unknown[]) => void;

export interface DockyardAPI {
  profiles: {
    list: () => Promise<ProfileMetadata[]>;
    create: (name: string) => Promise<ProfileMetadata>;
    delete: (id: string) => Promise<void>;
    switch: (id: string) => Promise<void>;
    getCurrent: () => Promise<ProfileMetadata | null>;
  };
  workspaces: {
    list: () => Promise<Workspace[]>;
    create: (data: Partial<Workspace>) => Promise<Workspace>;
    update: (id: string, data: Partial<Workspace>) => Promise<Workspace>;
    delete: (id: string) => Promise<void>;
    switch: (id: string) => Promise<void>;
    getActive: () => Promise<Workspace | null>;
  };
  apps: {
    list: () => Promise<App[]>;
    create: (data: Partial<App>) => Promise<App>;
    update: (id: string, data: Partial<App>) => Promise<App>;
    delete: (id: string) => Promise<void>;
    hibernate: (appId: string, instanceId: string) => Promise<void>;
    resume: (appId: string, instanceId: string) => Promise<void>;
    createInstance: (
      appId: string,
      data: { name?: string; sessionMode?: 'isolated' | 'shared' }
    ) => Promise<import('./app').AppInstance>;
  };
  browserView: {
    show: (appId: string, instanceId: string, bounds?: Electron.Rectangle) => Promise<void>;
    hide: () => Promise<void>;
    updateBounds: (appId: string, instanceId: string, bounds: Electron.Rectangle) => Promise<void>;
    navigate: (appId: string, instanceId: string, url: string) => Promise<void>;
    goBack: (appId: string, instanceId: string) => Promise<void>;
    goForward: (appId: string, instanceId: string) => Promise<void>;
    reload: (appId: string, instanceId: string) => Promise<void>;
    forceReload: (appId: string, instanceId: string) => Promise<void>;
    getState: (
      appId: string,
      instanceId: string
    ) => Promise<{
      canGoBack: boolean;
      canGoForward: boolean;
      isLoading: boolean;
      url: string;
    }>;
    setZoom: (appId: string, instanceId: string, zoomFactor: number) => Promise<void>;
    openDevTools: (appId: string, instanceId: string) => Promise<void>;
    closeDevTools: (appId: string, instanceId: string) => Promise<void>;
    toggleDevTools: (appId: string, instanceId: string) => Promise<void>;
    clearSession: (partitionId: string) => Promise<void>;
    getMemory: (
      appId: string,
      instanceId: string
    ) => Promise<{
      workingSetSize: number;
      privateBytes: number;
    }>;
    getCPU: (appId: string, instanceId: string) => Promise<number>;
    getAll: () => Promise<
      Array<{
        appId: string;
        instanceId: string;
        partitionId: string;
        lastActive: number;
        isActive: boolean;
      }>
    >;
  };
  webview: {
    register: (
      webContentsId: number,
      appId: string,
      instanceId: string,
      partitionId: string
    ) => Promise<void>;
    unregister: (appId: string, instanceId: string) => Promise<void>;
    navigate: (appId: string, instanceId: string, url: string) => Promise<void>;
    goBack: (appId: string, instanceId: string) => Promise<void>;
    goForward: (appId: string, instanceId: string) => Promise<void>;
    reload: (appId: string, instanceId: string) => Promise<void>;
    forceReload: (appId: string, instanceId: string) => Promise<void>;
    getState: (
      appId: string,
      instanceId: string
    ) => Promise<{
      canGoBack: boolean;
      canGoForward: boolean;
      isLoading: boolean;
      url: string;
    }>;
    setZoom: (appId: string, instanceId: string, zoomFactor: number) => Promise<void>;
    openDevTools: (appId: string, instanceId: string) => Promise<void>;
    closeDevTools: (appId: string, instanceId: string) => Promise<void>;
    toggleDevTools: (appId: string, instanceId: string) => Promise<void>;
    clearSession: (partitionId: string) => Promise<void>;
    getMemory: (
      appId: string,
      instanceId: string
    ) => Promise<{
      workingSetSize: number;
      privateBytes: number;
    }>;
    getCPU: (appId: string, instanceId: string) => Promise<number>;
    getAll: () => Promise<
      Array<{
        appId: string;
        instanceId: string;
        partitionId: string;
        lastActive: number;
        isActive: boolean;
      }>
    >;
    updateActive: (appId: string, instanceId: string) => Promise<void>;
    injectCSS: (appId: string, instanceId: string, css: string) => Promise<void>;
    injectJS: (appId: string, instanceId: string, js: string) => Promise<void>;
    findInPage: (
      appId: string,
      instanceId: string,
      text: string,
      options?: Electron.FindInPageOptions
    ) => Promise<void>;
    stopFindInPage: (
      appId: string,
      instanceId: string,
      action?: 'clearSelection' | 'keepSelection' | 'activateSelection'
    ) => Promise<void>;
    print: (
      appId: string,
      instanceId: string,
      options?: Electron.WebContentsPrintOptions
    ) => Promise<void>;
    setUserAgent: (appId: string, instanceId: string, userAgent?: string | null) => Promise<void>;
  };
  settings: {
    get: () => Promise<Settings>;
    update: (data: Partial<Settings>) => Promise<Settings>;
  };
  notifications: {
    show: (options: {
      title: string;
      body: string;
      icon?: string;
      silent?: boolean;
    }) => Promise<void>;
    updateBadge: (appId: string, count: number) => Promise<App>;
  };
  window: {
    toggleDevTools: () => Promise<void>;
  };
  on: (channel: DockyardEventChannel, callback: DockyardEventListener) => void;
  off: (channel: DockyardEventChannel, callback: DockyardEventListener) => void;
}

declare global {
  interface Window {
    dockyard: DockyardAPI;
  }
}
