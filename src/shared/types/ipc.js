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

  // Phase 2: Hibernation
  HIBERNATION_GET_CONFIG: 'hibernation:get-config',
  HIBERNATION_UPDATE_CONFIG: 'hibernation:update-config',
  HIBERNATION_GET_INACTIVE: 'hibernation:get-inactive',
  HIBERNATION_START: 'hibernation:start',
  HIBERNATION_STOP: 'hibernation:stop',

  // Phase 2: Notifications
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_GET_CONFIG: 'notification:get-config',
  NOTIFICATION_UPDATE_CONFIG: 'notification:update-config',
  NOTIFICATION_GET_BADGES: 'notification:get-badges',
  NOTIFICATION_CLEAR_BADGE: 'notification:clear-badge',
  NOTIFICATION_GET_HISTORY: 'notification:get-history',

  // Phase 2: Performance
  PERFORMANCE_GET_SNAPSHOT: 'performance:get-snapshot',
  PERFORMANCE_GET_HISTORY: 'performance:get-history',
  PERFORMANCE_GET_APP_METRICS: 'performance:get-app-metrics',
  PERFORMANCE_GET_HIGH_MEMORY: 'performance:get-high-memory',

  // Events
  APP_STATE_CHANGED: 'app:state-changed',
  NOTIFICATION: 'notification',
  WORKSPACE_CHANGED: 'workspace:changed',
};

// IPC message types

