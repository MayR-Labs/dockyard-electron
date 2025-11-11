import { Notification, BrowserView } from 'electron';
import { ProfileManager } from './profile-manager';

export class NotificationManager {
  profileManager;
  config;
  badgeCounts= new Map();
  notificationHistory= [];
  maxHistorySize = 50;

  constructor(profileManager) {
    this.profileManager = profileManager;
    
    const profile = this.profileManager.getCurrentProfile();
    this.config = {
      enabled: profile?.settings.notifications ?? true,
      doNotDisturb,
      showBadges,
    };
  }

  setupNotificationForwarding(appId) {
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
                title,
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

  showNotification(notification) {
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

  clearBadge(appId) {
    this.badgeCounts.set(appId, 0);
  }

  getBadgeCount(appId) {
    return this.badgeCounts.get(appId) || 0;
  }

  getAllBadgeCounts(), number> {
    return new Map(this.badgeCounts);
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getConfig() { ...this.config };
  }

  getNotificationHistory()] {
    return [...this.notificationHistory];
  }

  clearHistory() {
    this.notificationHistory = [];
  }

  clearAllBadges() {
    this.badgeCounts.clear();
  }
}
