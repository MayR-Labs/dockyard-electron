/**
 * Settings IPC Handlers
 * Single Responsibility: Handle settings-related IPC communications
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { Settings } from '../../shared/types';

export class SettingsHandlers {
  constructor(private storeManager: StoreManager) {
    this.register();
  }

  private register(): void {
    this.registerGetHandler();
    this.registerUpdateHandler();
  }

  private registerGetHandler(): void {
    ipcMain.handle(IPC_CHANNELS.SETTINGS.GET, async () => {
      const store = this.storeManager.getSettingsStore();
      return store.store;
    });
  }

  private registerUpdateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.SETTINGS.UPDATE, async (_event, data: Partial<Settings>) => {
      const store = this.storeManager.getSettingsStore();

      // Deep merge the settings
      const currentSettings = store.store;
      const updatedSettings = {
        ...currentSettings,
        ...data,
      };

      // Update each key separately to preserve nested structure
      Object.keys(data).forEach((key) => {
        store.set(key as any, (data as any)[key]);
      });

      return store.store;
    });
  }
}
