import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { ProfileManager } from './profile-manager';
import { AppManager } from './app-manager';
import { setupIPCHandlers } from './ipc-handlers';

// Handle Squirrel events on Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let windowManager: WindowManager;
let profileManager: ProfileManager;
let appManager: AppManager;

// Parse command line arguments for profile
const args = process.argv.slice(1);
const profileArg = args.find((arg) => arg.startsWith('--profile='));
const profileName = profileArg ? profileArg.split('=')[1] : 'default';

const createWindow = (): void => {
  // Initialize managers
  profileManager = new ProfileManager(profileName);
  appManager = new AppManager();
  windowManager = new WindowManager();

  // Load or create profile
  const profile = profileManager.loadProfile(profileName);
  console.log(`Loaded profile: ${profile.name}`);

  // Create main window
  const mainWindow = windowManager.createMainWindow();
  appManager.setMainWindow(mainWindow);

  // Setup IPC handlers
  setupIPCHandlers(profileManager, appManager);

  // Create default workspace if none exist
  const workspaces = profileManager.getWorkspacesByProfile(profile.id);
  if (workspaces.length === 0) {
    const workspace = profileManager.createWorkspace(
      profile.id,
      'Default',
      '🏠'
    );
    console.log(`Created default workspace: ${workspace.name}`);
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
