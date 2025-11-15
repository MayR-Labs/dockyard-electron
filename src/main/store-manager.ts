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
  private stores: Map<string, Store<Record<string, unknown>>> = new Map();
  private rootStore: Store<ProfilesConfig>;
  private currentProfile: string = 'default';

  constructor() {
    // Initialize root store for profile metadata
    this.rootStore = new Store<ProfilesConfig>({
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
   * Get the current profile ID
   */
  getCurrentProfile(): string {
    return this.currentProfile;
  }

  /**
   * Get current profile metadata
   */
  getCurrentProfileMetadata(): { id: string; name: string } {
    const profiles = this.rootStore.get('profiles');
    const profile = profiles.find((profileEntry) => profileEntry.id === this.currentProfile);
    return profile || { id: this.currentProfile, name: this.currentProfile };
  }

  /**
   * Get the root profiles store
   */
  getRootStore(): Store<ProfilesConfig> {
    return this.rootStore;
  }

  /**
   * Get a profile-specific store for workspaces
   */
  getWorkspacesStore(): Store<WorkspacesConfig> {
    const key = `${this.currentProfile}-workspaces`;
    if (!this.stores.has(key)) {
      const store = new Store<WorkspacesConfig>({
        name: 'workspaces',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: {
          workspaces: [],
          activeWorkspaceId: null,
        },
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key) as Store<WorkspacesConfig>;
  }

  /**
   * Get a profile-specific store for apps
   */
  getAppsStore(): Store<AppsConfig> {
    const key = `${this.currentProfile}-apps`;
    if (!this.stores.has(key)) {
      const store = new Store<AppsConfig>({
        name: 'apps',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: {
          apps: [],
        },
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key) as Store<AppsConfig>;
  }

  /**
   * Get a profile-specific store for settings
   */
  getSettingsStore(): Store<Settings> {
    const key = `${this.currentProfile}-settings`;
    if (!this.stores.has(key)) {
      const store = new Store<Settings>({
        name: 'settings',
        cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
        defaults: DEFAULT_SETTINGS,
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key) as Store<Settings>;
  }

  /**
   * Clear all cached stores (useful for profile switching)
   */
  clearCache(): void {
    this.stores.clear();
  }
}
