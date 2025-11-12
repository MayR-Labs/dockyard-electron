/**
 * Environment detection utilities
 * Determines if the app is running in Electron or browser
 */

/**
 * Check if the app is running in Electron
 */
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.dockyard !== undefined;
};

/**
 * Check if the app is running in browser dev mode
 */
export const isBrowserDevMode = (): boolean => {
  return !isElectron() && import.meta.env.DEV;
};

/**
 * Get the environment name
 */
export const getEnvironment = (): 'electron' | 'browser-dev' | 'browser-prod' => {
  if (isElectron()) {
    return 'electron';
  }
  return import.meta.env.DEV ? 'browser-dev' : 'browser-prod';
};
