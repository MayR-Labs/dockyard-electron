import { Profile } from './profile';
import { Workspace } from './workspace';
import { AppInstance } from './app';

// IPC channel names
export const IPC_CHANNELS = {
  // Profile
  PROFILE_GET: 'profile:get',
  PROFILE_CREATE: 'profile:create',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_DELETE: 'profile:delete',
  PROFILE_LIST: 'profile:list',

  // Workspace
  WORKSPACE_CREATE: 'workspace:create',
  WORKSPACE_UPDATE: 'workspace:update',
  WORKSPACE_DELETE: 'workspace:delete',
  WORKSPACE_LIST: 'workspace:list',
  WORKSPACE_SWITCH: 'workspace:switch',

  // App
  APP_CREATE: 'app:create',
  APP_UPDATE: 'app:update',
  APP_DELETE: 'app:delete',
  APP_LIST: 'app:list',
  APP_HIBERNATE: 'app:hibernate',
  APP_WAKE: 'app:wake',
  APP_CLEAR_SESSION: 'app:clear-session',

  // Events
  APP_STATE_CHANGED: 'app:state-changed',
  NOTIFICATION: 'notification',
  WORKSPACE_CHANGED: 'workspace:changed',
} as const;

// IPC message types
export interface CreateWorkspaceData {
  profileId: string;
  name: string;
  icon?: string;
}

export interface CreateAppData {
  workspaceId: string;
  name: string;
  url: string;
  icon?: string;
}

export interface UpdateAppData {
  id: string;
  updates: Partial<AppInstance>;
}

export interface UpdateWorkspaceData {
  id: string;
  updates: Partial<Workspace>;
}

export interface UpdateProfileData {
  id: string;
  updates: Partial<Profile>;
}
