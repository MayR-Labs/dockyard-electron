/**
 * Profile IPC Handlers
 * Single Responsibility: Handle profile-related IPC communications
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { ProfileMetadata } from '../../shared/types';
import { getCurrentTimestamp, sanitizeProfileName } from '../../shared/utils';

export class ProfileHandlers {
  constructor(private storeManager: StoreManager) {
    this.register();
  }

  private register(): void {
    this.registerListHandler();
    this.registerCreateHandler();
    this.registerDeleteHandler();
    this.registerGetCurrentHandler();
  }

  private registerListHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.LIST, async () => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);
      return profiles;
    });
  }

  private registerCreateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.CREATE, async (_, name: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);

      const sanitizedName = sanitizeProfileName(name);
      const id = sanitizedName;

      // Check if profile already exists
      if (profiles.find((p: ProfileMetadata) => p.id === id)) {
        throw new Error(`Profile "${name}" already exists`);
      }

      const newProfile: ProfileMetadata = {
        id,
        name,
        createdAt: getCurrentTimestamp(),
        lastAccessed: getCurrentTimestamp(),
        dataPath: '', // Will be set by store manager
      };

      profiles.push(newProfile);
      rootStore.set('profiles', profiles);

      return newProfile;
    });
  }

  private registerDeleteHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.DELETE, async (_, id: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);

      // Don't allow deleting the default profile
      if (id === 'default') {
        throw new Error('Cannot delete the default profile');
      }

      const filtered = profiles.filter((p: ProfileMetadata) => p.id !== id);
      rootStore.set('profiles', filtered);
    });
  }

  private registerGetCurrentHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.GET_CURRENT, async () => {
      const rootStore = this.storeManager.getRootStore();
      const lastActive = rootStore.get('lastActiveProfile', 'default');
      const profiles = rootStore.get('profiles', []);
      return profiles.find((p: ProfileMetadata) => p.id === lastActive) || null;
    });
  }
}
