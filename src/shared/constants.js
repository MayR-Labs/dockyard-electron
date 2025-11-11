export const APP_NAME = 'Dockyard';
export const APP_VERSION = '0.1.0';

// Default settings
export const DEFAULT_HIBERNATION_TIMEOUT = 15; // minutes
export const DEFAULT_ZOOM_LEVEL = 1.0;
export const MIN_ZOOM_LEVEL = 0.5;
export const MAX_ZOOM_LEVEL = 2.0;

// Storage keys
export const STORAGE_KEYS = {
  PROFILES: 'profiles',
  WORKSPACES: 'workspaces',
  APPS: 'apps',
  CURRENT_PROFILE: 'currentProfile',
};

// Partition prefixes
export const PARTITION_PREFIX = 'persist';

// Default theme
export const DEFAULT_THEME = {
  mode: 'system',
  accentColor: '#8b5cf6',
  background: 'solid',
};

// App categories for curated apps
export const APP_CATEGORIES = [
  'Communication',
  'Productivity',
  'Development',
  'Social',
  'Entertainment',
  'Other',
];
