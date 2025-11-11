import { ProfileMetadata } from './profile';
import { Workspace } from './workspace';
import { App } from './app';
import { Settings } from './settings';

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
    hibernate: (id: string) => Promise<void>;
    resume: (id: string) => Promise<void>;
  };
  settings: {
    get: () => Promise<Settings>;
    update: (data: Partial<Settings>) => Promise<Settings>;
  };
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    dockyard: DockyardAPI;
  }
}
