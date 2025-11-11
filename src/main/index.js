import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { ProfileManager } from './profile-manager';
import { AppManager } from './app-manager';
import { HibernationManager } from './hibernation-manager';
import { NotificationManager } from './notification-manager';
import { PerformanceMonitor } from './performance-monitor';
import { setupIPCHandlers } from './ipc-handlers';

// Handle Squirrel events on Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let windowManager;
let profileManager;
let appManager;
let hibernationManager;
let notificationManager;
let performanceMonitor;

// Parse command line arguments for profile
const args = process.argv.slice(1);
const profileArg = args.find((arg) => arg.startsWith('--profile='));
const profileName = profileArg ? profileArg.split('=')[1] : 'default';

const createWindow = () => {
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

  // Initialize Phase 2 managers
  hibernationManager = new HibernationManager(appManager, profileManager);
  notificationManager = new NotificationManager(profileManager);
  performanceMonitor = new PerformanceMonitor(appManager);

  // Start hibernation and performance monitoring if enabled
  if (profile.settings.autoHibernate) {
    hibernationManager.start();
  }
  performanceMonitor.start();

  // Setup IPC handlers
  setupIPCHandlers(
    profileManager,
    appManager,
    hibernationManager,
    notificationManager,
    performanceMonitor
  );

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
  // Cleanup managers
  if (hibernationManager) {
    hibernationManager.stop();
  }
  if (performanceMonitor) {
    performanceMonitor.stop();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
