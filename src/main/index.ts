import electronSquirrelStartup from 'electron-squirrel-startup';
import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { StoreManager } from './store-manager';
import { IPCHandlers } from './ipc-handlers';
import { BrowserViewManager } from './browser-view-manager';
import { WebViewManager } from './webview-manager';
import { ProfileMetadata } from '../shared/types';
import { debugLog } from '../shared/utils/debug';

app.setName('Dockyard');

app.setAboutPanelOptions({
  applicationName: 'Dockyard',
  applicationVersion: app.getVersion(),
  authors: ['MayR Labs (https://mayrlabs.com)', 'Aghogho Meyoron (https://founder.mayrlabs.com)'],
  website: 'https://dockyard.mayrlabs.com',
  credits: 'Developed with ❤️ by MayR Labs',
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (electronSquirrelStartup) {
  app.quit();
}

// Global instances
let windowManager: WindowManager;
let storeManager: StoreManager;
let browserViewManager: BrowserViewManager;
let webViewManager: WebViewManager;

// Parse command line arguments for profile selection
function parseProfileFromArgs(): string {
  const profileArg = process.argv.find((arg) => arg.startsWith('--profile='));
  if (profileArg) {
    return profileArg.split('=')[1];
  }
  return 'default';
}

/**
 * Initialize the application
 */
async function initialize(): Promise<void> {
  // Get profile from command line or use default
  const profileName = parseProfileFromArgs();
  debugLog('Launching Dockyard with profile:', profileName);

  // Initialize store manager
  storeManager = await StoreManager.create();
  storeManager.setCurrentProfile(profileName);

  // Initialize browser view manager (keeping for compatibility)
  browserViewManager = new BrowserViewManager(storeManager);

  // Initialize webview manager (new)
  webViewManager = new WebViewManager(storeManager);

  // Initialize window manager
  windowManager = new WindowManager();

  // Initialize IPC handlers
  new IPCHandlers(storeManager, browserViewManager, webViewManager, windowManager);

  // Create main window
  const mainWindow = windowManager.createMainWindow();

  // Set main window reference for browser view manager
  browserViewManager.setMainWindow(mainWindow);

  // Update last accessed time for profile
  const rootStore = storeManager.getRootStore();
  rootStore.set('lastActiveProfile', profileName);

  const profiles = rootStore.get('profiles');
  const currentProfile = profiles.find(
    (profileEntry: ProfileMetadata) => profileEntry.id === profileName
  );
  if (currentProfile) {
    currentProfile.lastAccessed = new Date().toISOString();
    rootStore.set('profiles', profiles);
  }
}

/**
 * App ready event
 */
app.whenReady().then(async () => {
  await initialize();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createMainWindow();
    }
  });
});

/**
 * Quit when all windows are closed (except on macOS)
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Handle second instance (for multi-profile support)
 */
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // Another instance is already running with the same profile
  debugLog('Another instance is already running with this profile');
  app.quit();
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    // Someone tried to run a second instance, focus our window
    const mainWindow = windowManager?.getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}
