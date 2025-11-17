/**
 * Notification IPC Handlers
 * Single Responsibility: Handle notification-related IPC communications
 */

import { ipcMain, Notification } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { App, Settings } from '../../shared/types';
import { getCurrentTimestamp } from '../../shared/utils';

export class NotificationHandlers {
  constructor(private storeManager: StoreManager) {
    this.register();
  }

  private register(): void {
    this.registerShowHandler();
    this.registerUpdateBadgeHandler();
  }

  private registerShowHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.NOTIFICATION.SHOW,
      async (
        _event,
        options: {
          title: string;
          body: string;
          icon?: string;
          silent?: boolean;
        }
      ) => {
        // Check DND status
        const settingsStore = this.storeManager.getSettingsStore();
        const settings = settingsStore.store as Settings;

        if (settings.notifications.doNotDisturb) {
          return; // Don't show notification if DND is enabled
        }

        if (!settings.notifications.enabled) {
          return; // Don't show notification if notifications are disabled
        }

        const notification = new Notification({
          title: options.title,
          body: options.body,
          icon: options.icon,
          silent: options.silent || !settings.notifications.soundEnabled,
        });

        notification.show();
      }
    );
  }

  private registerUpdateBadgeHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.NOTIFICATION.UPDATE_BADGE,
      async (_event, appId: string, count: number) => {
        const store = this.storeManager.getAppsStore();
        const apps = store.get('apps', []);

        const index = apps.findIndex((a: App) => a.id === appId);
        if (index === -1) {
          throw new Error(`App with id "${appId}" not found`);
        }

        const currentNotificationSettings: App['notifications'] =
          apps[index].notifications ?? {
            enabled: true,
            soundEnabled: true,
            badgeCount: 0,
          };

        apps[index] = {
          ...apps[index],
          notifications: {
            ...currentNotificationSettings,
            badgeCount: count,
          },
          updatedAt: getCurrentTimestamp(),
        };

        store.set('apps', apps);
        return apps[index];
      }
    );
  }
}
