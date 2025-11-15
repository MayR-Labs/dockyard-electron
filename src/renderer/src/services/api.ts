/**
 * API Service Layer
 * Provides a clean abstraction over IPC calls to the main process
 * Follows Single Responsibility Principle - only handles communication
 */

import { App, Workspace, Settings, ProfileMetadata } from '../../../shared/types';

/**
 * Profile API Service
 */
export const profileAPI = {
  list: (): Promise<ProfileMetadata[]> => {
    return window.dockyard.profiles.list();
  },

  create: (name: string): Promise<ProfileMetadata> => {
    return window.dockyard.profiles.create(name);
  },

  delete: (id: string): Promise<void> => {
    return window.dockyard.profiles.delete(id);
  },

  getCurrent: (): Promise<ProfileMetadata | null> => {
    return window.dockyard.profiles.getCurrent();
  },
};

/**
 * Workspace API Service
 */
export const workspaceAPI = {
  list: (): Promise<Workspace[]> => {
    return window.dockyard.workspaces.list();
  },

  create: (data: Partial<Workspace>): Promise<Workspace> => {
    return window.dockyard.workspaces.create(data);
  },

  update: (id: string, data: Partial<Workspace>): Promise<Workspace> => {
    return window.dockyard.workspaces.update(id, data);
  },

  delete: (id: string): Promise<void> => {
    return window.dockyard.workspaces.delete(id);
  },

  switch: (id: string): Promise<void> => {
    return window.dockyard.workspaces.switch(id);
  },

  getActive: (): Promise<Workspace | null> => {
    return window.dockyard.workspaces.getActive();
  },
};

/**
 * App API Service
 */
export const appAPI = {
  list: (): Promise<App[]> => {
    return window.dockyard.apps.list();
  },

  create: (data: Partial<App>): Promise<App> => {
    return window.dockyard.apps.create(data);
  },

  update: (id: string, data: Partial<App>): Promise<App> => {
    return window.dockyard.apps.update(id, data);
  },

  delete: (id: string): Promise<void> => {
    return window.dockyard.apps.delete(id);
  },

  hibernate: (id: string): Promise<void> => {
    return window.dockyard.apps.hibernate(id);
  },

  resume: (id: string): Promise<void> => {
    return window.dockyard.apps.resume(id);
  },

  createInstance: (appId: string, data: { name?: string; sessionMode?: 'isolated' | 'shared' }) => {
    return window.dockyard.apps.createInstance(appId, data);
  },
};

/**
 * Settings API Service
 */
export const settingsAPI = {
  get: (): Promise<Settings> => {
    return window.dockyard.settings.get();
  },

  update: (data: Partial<Settings>): Promise<Settings> => {
    return window.dockyard.settings.update(data);
  },
};

/**
 * Notification API Service
 */
export const notificationAPI = {
  show: (options: {
    title: string;
    body: string;
    icon?: string;
    silent?: boolean;
  }): Promise<void> => {
    return window.dockyard.notifications.show(options);
  },

  updateBadge: (appId: string, count: number): Promise<App> => {
    return window.dockyard.notifications.updateBadge(appId, count);
  },
};
