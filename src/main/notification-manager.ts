import { Notification, BrowserView } from 'electron';
import { ProfileManager } from './profile-manager';

export interface NotificationConfig {
  enabled: boolean;
  doNotDisturb: boolean;
  showBadges: boolean;
}

export interface AppNotification {
  appId: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: number;
}

export class NotificationManager {
  private profileManager: ProfileManager;
  private config: NotificationConfig;
  private badgeCounts: Map<string, number> = new Map();
  private notificationHistory: AppNotification[] = [];
  private maxHistorySize = 50;

  constructor(profileManager: ProfileManager) {
    this.profileManager = profileManager;
    
    const profile = this.profileManager.getCurrentProfile();
    this.config = {
      enabled: profile?.settings.notifications ?? true,
      doNotDisturb: false,
      showBadges: true,
    };
  }

  setupNotificationForwarding(appId: string, view: BrowserView): void {
    // Intercept notification requests from the webview
    view.webContents.on('did-finish-load', () => {
      // Inject notification interceptor
      view.webContents.executeJavaScript(`
        (function() {
          const originalNotification = window.Notification;
          
          if (!originalNotification) return;
          
          window.Notification = function(title, options) {
            // Send notification data to main process
            if (window.electronAPI && window.electronAPI.sendNotification) {
              window.electronAPI.sendNotification({
                appId: '${appId}',
                title: title,
                body: options?.body || '',
                icon: options?.icon,
                timestamp: Date.now()
              });
            }
            
            // Still create the original notification
            return new originalNotification(title, options);
          };
          
          // Copy static properties
          window.Notification.permission = originalNotification.permission;
          window.Notification.requestPermission = originalNotification.requestPermission;
        })();
      `);
    });
  }

  showNotification(notification: AppNotification): void {
    if (!this.config.enabled || this.config.doNotDisturb) {
      return;
    }

    // Add to history
    this.notificationHistory.unshift(notification);
    if (this.notificationHistory.length > this.maxHistorySize) {
      this.notificationHistory.pop();
    }

    // Increment badge count
    const currentCount = this.badgeCounts.get(notification.appId) || 0;
    this.badgeCounts.set(notification.appId, currentCount + 1);

    // Show native notification
    const nativeNotification = new Notification({
      title: notification.title,
      body: notification.body,
      icon: notification.icon,
    });

    nativeNotification.show();

    // Handle notification click - could focus the app
    nativeNotification.on('click', () => {
      // This would need to be wired up to switch to the app
      console.log(`Notification clicked for app: ${notification.appId}`);
    });
  }

  clearBadge(appId: string): void {
    this.badgeCounts.set(appId, 0);
  }

  getBadgeCount(appId: string): number {
    return this.badgeCounts.get(appId) || 0;
  }

  getAllBadgeCounts(): Map<string, number> {
    return new Map(this.badgeCounts);
  }

  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  getNotificationHistory(): AppNotification[] {
    return [...this.notificationHistory];
  }

  clearHistory(): void {
    this.notificationHistory = [];
  }

  clearAllBadges(): void {
    this.badgeCounts.clear();
  }
}
