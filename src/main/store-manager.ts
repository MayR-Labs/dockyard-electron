import Store from 'electron-store';
import { app } from 'electron';
import path from 'path';
import {
  ProfilesConfig,
  WorkspacesConfig,
  AppsConfig,
  Settings,
  DEFAULT_SETTINGS,
} from '../shared/types';

export class StoreManager {
  private stores: Map<string, any> = new Map();
  private rootStore: any;
  private currentProfile: string = 'default';

  constructor() {
    // Initialize root store for profile metadata
    this.rootStore = new Store({
      name: 'profiles',
      defaults: {
        profiles: [
          {
            id: 'default',
            name: 'Default',
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            dataPath: path.join(app.getPath('userData'), 'profiles', 'default'),
          },
        ],
        defaultProfile: 'default',
        lastActiveProfile: 'default',
      },
    });
  }

  /**
   * Set the current profile (called during startup or profile switch)
   */
  setCurrentProfile(profileName: string): void {
    this.currentProfile = profileName;
  }

  /**
   * Get the root profiles store
   */
  getRootStore(): any {
    return this.rootStore;
  }

  /**
   * Get a profile-specific store for workspaces
   */
  getWorkspacesStore(): any {
    const key = `${this.currentProfile}-workspaces`;
    if (!this.stores.has(key)) {
      const store = new Store({
        name: 'workspaces',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: {
          workspaces: [],
          activeWorkspaceId: null,
        },
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key);
  }

  /**
   * Get a profile-specific store for apps
   */
  getAppsStore(): any {
    const key = `${this.currentProfile}-apps`;
    if (!this.stores.has(key)) {
      const store = new Store({
        name: 'apps',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: {
          apps: [],
        },
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key);
  }

  /**
   * Get a profile-specific store for settings
   */
  getSettingsStore(): any {
    const key = `${this.currentProfile}-settings`;
    if (!this.stores.has(key)) {
      const store = new Store({
        name: 'settings',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: DEFAULT_SETTINGS,
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key);
  }

  /**
   * Clear all cached stores (useful for profile switching)
   */
  clearCache(): void {
    this.stores.clear();
  }
}
