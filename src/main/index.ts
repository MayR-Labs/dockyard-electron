import electronSquirrelStartup from 'electron-squirrel-startup';
import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { StoreManager } from './store-manager';
import { IPCHandlers } from './ipc-handlers';
import { BrowserViewManager } from './browser-view-manager';
import { WebViewManager } from './webview-manager';
import { ProfileMetadata } from '../shared/types';
import { debugLog } from '../shared/utils/debug';
import { ProfilePickerWindow } from './profile-picker-window';
import { ProfileHandlers } from './handlers/profile-handlers';
import { BackupHandlers } from './handlers/backup-handlers';
import { BackupService } from './services/backup-service';

app.setName('Dockyard');

app.setAppUserModelId('com.mayrlabs.dockyard');

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
let profilePickerWindow: ProfilePickerWindow | null = null;
let profileHandlersRegistered = false;

// Parse command line arguments for profile selection
function parseProfileFromArgs(): string | null {
  const profileArg = process.argv.find((arg) => arg.startsWith('--profile='));
  if (profileArg) {
    return profileArg.split('=')[1];
  }
  return null;
}

function ensureProfileHandlers(): void {
  if (!profileHandlersRegistered) {
    new ProfileHandlers(storeManager);
    profileHandlersRegistered = true;
  }
}

async function startProfileSession(profileId: string): Promise<void> {
  debugLog('Starting Dockyard profile session:', profileId);
  storeManager.setCurrentProfile(profileId);

  browserViewManager = new BrowserViewManager(storeManager);
  webViewManager = new WebViewManager(storeManager);
  windowManager = new WindowManager();

  new IPCHandlers(storeManager, browserViewManager, webViewManager, windowManager);

  const mainWindow = windowManager.createMainWindow();
  browserViewManager.setMainWindow(mainWindow);

  const rootStore = storeManager.getRootStore();
  rootStore.set('lastActiveProfile', profileId);

  const profiles = rootStore.get('profiles', [] as ProfileMetadata[]);
  const currentProfile = profiles.find((profileEntry) => profileEntry.id === profileId);
  if (currentProfile) {
    currentProfile.lastAccessed = new Date().toISOString();
    rootStore.set('profiles', profiles);
  }
}

async function startProfilePicker(): Promise<void> {
  ensureProfileHandlers();
  // Backup handlers are needed in the profile picker for restore functionality
  new BackupHandlers(new BackupService());

  profilePickerWindow = new ProfilePickerWindow();
  profilePickerWindow.createWindow();
}

/**
 * Initialize the application
 */
async function initialize(): Promise<void> {
  storeManager = await StoreManager.create();
  const cliProfile = parseProfileFromArgs();

  if (cliProfile) {
    await startProfileSession(cliProfile);
    return;
  }

  await startProfilePicker();
}

/**
 * App ready event
 */
app.whenReady().then(async () => {
  await initialize();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (profilePickerWindow) {
        profilePickerWindow.createWindow();
      } else if (windowManager) {
        windowManager.createMainWindow();
      }
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

// Allow multiple instances so users can run multiple profiles simultaneously
