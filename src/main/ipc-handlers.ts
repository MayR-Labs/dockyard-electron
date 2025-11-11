import { ipcMain } from 'electron';
import { ProfileManager } from './profile-manager';
import { AppManager } from './app-manager';
import { HibernationManager } from './hibernation-manager';
import { NotificationManager } from './notification-manager';
import { PerformanceMonitor } from './performance-monitor';
import { IPC_CHANNELS } from '../shared/types';

export function setupIPCHandlers(
  profileManager: ProfileManager,
  appManager: AppManager,
  hibernationManager?: HibernationManager,
  notificationManager?: NotificationManager,
  performanceMonitor?: PerformanceMonitor
): void {
  // Profile operations
  ipcMain.handle(IPC_CHANNELS.PROFILE_GET, () => {
    return profileManager.getCurrentProfile();
  });

  ipcMain.handle(IPC_CHANNELS.PROFILE_CREATE, (_event, name: string) => {
    return profileManager.createProfile(name);
  });

  ipcMain.handle(
    IPC_CHANNELS.PROFILE_UPDATE,
    (_event, profileId: string, updates: any) => {
      return profileManager.updateProfile(profileId, updates);
    }
  );

  ipcMain.handle(IPC_CHANNELS.PROFILE_DELETE, (_event, profileId: string) => {
    profileManager.deleteProfile(profileId);
  });

  ipcMain.handle(IPC_CHANNELS.PROFILE_LIST, () => {
    return profileManager.listProfiles();
  });

  // Workspace operations
  ipcMain.handle(
    IPC_CHANNELS.WORKSPACE_CREATE,
    (_event, profileId: string, name: string, icon?: string) => {
      return profileManager.createWorkspace(profileId, name, icon);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSPACE_UPDATE,
    (_event, workspaceId: string, updates: any) => {
      return profileManager.updateWorkspace(workspaceId, updates);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSPACE_DELETE,
    (_event, workspaceId: string) => {
      profileManager.deleteWorkspace(workspaceId);
    }
  );

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_LIST, (_event, profileId: string) => {
    return profileManager.getWorkspacesByProfile(profileId);
  });

  ipcMain.handle(
    IPC_CHANNELS.WORKSPACE_SWITCH,
    (_event, workspaceId: string) => {
      // Get all apps in the workspace
      const apps = profileManager.getAppsByWorkspace(workspaceId);
      
      // Show the first app if available
      if (apps.length > 0 && apps[0]) {
        const view = appManager.getView(apps[0].id);
        if (!view) {
          appManager.createAppView(apps[0]);
        }
        appManager.showAppView(apps[0].id);
      }
      
      return { workspaceId, apps };
    }
  );

  // App operations
  ipcMain.handle(
    IPC_CHANNELS.APP_CREATE,
    (_event, workspaceId: string, name: string, url: string, icon?: string) => {
      const app = profileManager.createApp(workspaceId, name, url, icon);
      // Create the BrowserView for the app
      appManager.createAppView(app);
      return app;
    }
  );

  ipcMain.handle(IPC_CHANNELS.APP_UPDATE, (_event, appId: string, updates: any) => {
    return profileManager.updateApp(appId, updates);
  });

  ipcMain.handle(IPC_CHANNELS.APP_DELETE, (_event, appId: string) => {
    appManager.destroyAppView(appId);
    profileManager.deleteApp(appId);
  });

  ipcMain.handle(IPC_CHANNELS.APP_LIST, (_event, workspaceId: string) => {
    return profileManager.getAppsByWorkspace(workspaceId);
  });

  ipcMain.handle(IPC_CHANNELS.APP_HIBERNATE, (_event, appId: string) => {
    appManager.hibernateApp(appId);
  });

  ipcMain.handle(IPC_CHANNELS.APP_WAKE, (_event, appId: string) => {
    appManager.wakeApp(appId);
  });

  ipcMain.handle(IPC_CHANNELS.APP_CLEAR_SESSION, (_event, appId: string) => {
    return appManager.clearAppSession(appId);
  });

  // Handle app switching
  ipcMain.handle('app:switch', (_event, appId: string) => {
    const app = profileManager.getApp(appId);
    if (!app) {
      throw new Error(`App with id ${appId} not found`);
    }

    // Create view if it doesn't exist
    let view = appManager.getView(appId);
    if (!view) {
      view = appManager.createAppView(app);
    }

    appManager.showAppView(appId);
    
    // Track activity for hibernation
    if (hibernationManager) {
      hibernationManager.trackActivity(appId);
    }
    
    return app;
  });

  // Phase 2: Hibernation handlers
  if (hibernationManager) {
    ipcMain.handle(IPC_CHANNELS.HIBERNATION_GET_CONFIG, () => {
      return hibernationManager.getConfig();
    });

    ipcMain.handle(IPC_CHANNELS.HIBERNATION_UPDATE_CONFIG, (_event, config: any) => {
      hibernationManager.updateConfig(config);
      return hibernationManager.getConfig();
    });

    ipcMain.handle(IPC_CHANNELS.HIBERNATION_GET_INACTIVE, () => {
      return hibernationManager.getInactiveApps();
    });

    ipcMain.handle(IPC_CHANNELS.HIBERNATION_START, () => {
      hibernationManager.start();
    });

    ipcMain.handle(IPC_CHANNELS.HIBERNATION_STOP, () => {
      hibernationManager.stop();
    });
  }

  // Phase 2: Notification handlers
  if (notificationManager) {
    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_SHOW, (_event, notification: any) => {
      notificationManager.showNotification(notification);
    });

    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_GET_CONFIG, () => {
      return notificationManager.getConfig();
    });

    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_UPDATE_CONFIG, (_event, config: any) => {
      notificationManager.updateConfig(config);
      return notificationManager.getConfig();
    });

    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_GET_BADGES, () => {
      return Object.fromEntries(notificationManager.getAllBadgeCounts());
    });

    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_CLEAR_BADGE, (_event, appId: string) => {
      notificationManager.clearBadge(appId);
    });

    ipcMain.handle(IPC_CHANNELS.NOTIFICATION_GET_HISTORY, () => {
      return notificationManager.getNotificationHistory();
    });
  }

  // Phase 2: Performance handlers
  if (performanceMonitor) {
    ipcMain.handle(IPC_CHANNELS.PERFORMANCE_GET_SNAPSHOT, () => {
      return performanceMonitor.getCurrentSnapshot();
    });

    ipcMain.handle(IPC_CHANNELS.PERFORMANCE_GET_HISTORY, () => {
      return performanceMonitor.getMetricsHistory();
    });

    ipcMain.handle(IPC_CHANNELS.PERFORMANCE_GET_APP_METRICS, (_event, appId: string) => {
      return performanceMonitor.getAppMetrics(appId);
    });

    ipcMain.handle(IPC_CHANNELS.PERFORMANCE_GET_HIGH_MEMORY, (_event, thresholdMB?: number) => {
      return performanceMonitor.getHighMemoryApps(thresholdMB);
    });
  }
}
