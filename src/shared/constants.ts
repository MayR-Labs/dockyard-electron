// IPC Channel names for communication between main and renderer processes
export const IPC_CHANNELS = {
  PROFILE: {
    LIST: 'profile:list',
    CREATE: 'profile:create',
    DELETE: 'profile:delete',
    SWITCH: 'profile:switch',
    GET_CURRENT: 'profile:get-current',
  },
  WORKSPACE: {
    LIST: 'workspace:list',
    CREATE: 'workspace:create',
    UPDATE: 'workspace:update',
    DELETE: 'workspace:delete',
    SWITCH: 'workspace:switch',
    GET_ACTIVE: 'workspace:get-active',
  },
  APP: {
    LIST: 'app:list',
    CREATE: 'app:create',
    UPDATE: 'app:update',
    DELETE: 'app:delete',
    HIBERNATE: 'app:hibernate',
    RESUME: 'app:resume',
    CREATE_INSTANCE: 'app:create-instance',
  },
  BROWSER_VIEW: {
    SHOW: 'browser-view:show',
    HIDE: 'browser-view:hide',
    UPDATE_BOUNDS: 'browser-view:update-bounds',
    NAVIGATE: 'browser-view:navigate',
    GO_BACK: 'browser-view:go-back',
    GO_FORWARD: 'browser-view:go-forward',
    RELOAD: 'browser-view:reload',
    GET_STATE: 'browser-view:get-state',
    SET_ZOOM: 'browser-view:set-zoom',
    OPEN_DEVTOOLS: 'browser-view:open-devtools',
    CLOSE_DEVTOOLS: 'browser-view:close-devtools',
    CLEAR_SESSION: 'browser-view:clear-session',
    GET_MEMORY: 'browser-view:get-memory',
    GET_CPU: 'browser-view:get-cpu',
    GET_ALL: 'browser-view:get-all',
  },
  SETTINGS: {
    GET: 'settings:get',
    UPDATE: 'settings:update',
  },
  NOTIFICATION: {
    SHOW: 'notification:show',
    UPDATE_BADGE: 'notification:update-badge',
  },
} as const;

// Event names for main -> renderer communication
export const IPC_EVENTS = {
  WORKSPACE_CHANGED: 'workspace-changed',
  APP_UPDATED: 'app-updated',
  NOTIFICATION: 'notification',
} as const;

// Default values
export const DEFAULTS = {
  DOCK_SIZE: 60,
  DOCK_POSITION: 'left' as const,
  IDLE_TIME_MINUTES: 15,
  THEME_MODE: 'system' as const,
  ACCENT_COLOR: '#667eea',
} as const;
