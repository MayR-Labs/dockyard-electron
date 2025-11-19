/**
 * Profile IPC Handlers
 * Single Responsibility: Handle profile-related IPC communications
 */

import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
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
     this.registerSwitchHandler();
    this.registerGetCurrentHandler();
  }

  private getProfileDataPath(profileId: string): string {
    return path.join(app.getPath('userData'), 'profiles', profileId);
  }

  private ensureProfileDirectory(profileId: string): string {
    const dataPath = this.getProfileDataPath(profileId);
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    return dataPath;
  }

  private scheduleRelaunch(profileId: string): void {
    const args = process.argv.filter((arg) => !arg.startsWith('--profile='));
    args.push(`--profile=${profileId}`);

    setTimeout(() => {
      app.relaunch({ args });
      app.exit(0);
    }, 100);
  }

  private registerListHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.LIST, async () => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);

      let needsUpdate = false;
      const normalizedProfiles = profiles.map((profile: ProfileMetadata) => {
        if (!profile.dataPath) {
          needsUpdate = true;
          return {
            ...profile,
            dataPath: this.ensureProfileDirectory(profile.id),
          };
        }
        return profile;
      });

      if (needsUpdate) {
        rootStore.set('profiles', normalizedProfiles);
      }

      return normalizedProfiles;
    });
  }

  private registerCreateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.CREATE, async (_, name: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);

      const sanitizedName = sanitizeProfileName(name);
      const id = sanitizedName || `profile-${Date.now()}`;
      const displayName = name?.trim() || 'New Profile';

      // Check if profile already exists
      if (profiles.find((p: ProfileMetadata) => p.id === id)) {
        throw new Error(`Profile "${name}" already exists`);
      }

      const newProfile: ProfileMetadata = {
        id,
        name: displayName,
        createdAt: getCurrentTimestamp(),
        lastAccessed: getCurrentTimestamp(),
        dataPath: this.ensureProfileDirectory(id),
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

      if (id === this.storeManager.getCurrentProfile()) {
        throw new Error('Cannot delete the active profile');
      }

      const profileToDelete = profiles.find((p: ProfileMetadata) => p.id === id);
      if (!profileToDelete) {
        throw new Error(`Profile "${id}" does not exist`);
      }

      const filtered = profiles.filter((p: ProfileMetadata) => p.id !== id);
      rootStore.set('profiles', filtered);

      const lastActive = rootStore.get('lastActiveProfile');
      if (lastActive === id) {
        const fallbackProfile = filtered[0]?.id || rootStore.get('defaultProfile', 'default');
        rootStore.set('lastActiveProfile', fallbackProfile);
      }

      const dataPath = profileToDelete.dataPath || this.getProfileDataPath(id);
      if (dataPath && fs.existsSync(dataPath)) {
        fs.rmSync(dataPath, { recursive: true, force: true });
      }
    });
  }

  private registerSwitchHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.SWITCH, async (_, id: string) => {
      const rootStore = this.storeManager.getRootStore();
      const profiles = rootStore.get('profiles', []);
      const targetProfile = profiles.find((p: ProfileMetadata) => p.id === id);

      if (!targetProfile) {
        throw new Error(`Profile "${id}" not found`);
      }

      const currentProfile = this.storeManager.getCurrentProfile();
      if (currentProfile === id) {
        return;
      }

      targetProfile.lastAccessed = getCurrentTimestamp();
      rootStore.set('profiles', profiles);
      rootStore.set('lastActiveProfile', id);

      this.storeManager.setCurrentProfile(id);
      this.storeManager.clearCache();

      this.scheduleRelaunch(id);

      return;
    });
  }

  private registerGetCurrentHandler(): void {
    ipcMain.handle(IPC_CHANNELS.PROFILE.GET_CURRENT, async () => {
      const rootStore = this.storeManager.getRootStore();
      const defaultProfile = rootStore.get('defaultProfile', 'default');
      const lastActive = rootStore.get('lastActiveProfile', defaultProfile);
      const profiles = rootStore.get('profiles', []);
      return profiles.find((p: ProfileMetadata) => p.id === lastActive) || null;
    });
  }
}
