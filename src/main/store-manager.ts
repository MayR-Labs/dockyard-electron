import type Store from 'electron-store' with { 'resolution-mode': 'import' };
import type { Options as StoreOptions } from 'electron-store' with { 'resolution-mode': 'import' };
import { app } from 'electron';
import path from 'path';
import {
  ProfilesConfig,
  WorkspacesConfig,
  AppsConfig,
  Settings,
  DEFAULT_SETTINGS,
} from '../shared/types';

type ElectronStoreClass = new <T extends Record<string, any> = Record<string, unknown>>(
  options?: StoreOptions<T>
) => Store<T>;

export class StoreManager {
  private static storeClassPromise: Promise<ElectronStoreClass> | null = null;
  private stores: Map<string, Store<any>> = new Map();
  private rootStore: Store<ProfilesConfig>;
  private currentProfile: string = 'default';

  private constructor(private StoreClass: ElectronStoreClass) {
    this.rootStore = new this.StoreClass<ProfilesConfig>({
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

  static async create(): Promise<StoreManager> {
    const StoreClass = await StoreManager.loadStoreClass();
    return new StoreManager(StoreClass);
  }

  private static async loadStoreClass(): Promise<ElectronStoreClass> {
    if (!StoreManager.storeClassPromise) {
      StoreManager.storeClassPromise = import('electron-store').then((module) => module.default);
    }
    return StoreManager.storeClassPromise;
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
    return this.getOrCreateStore<WorkspacesConfig>(
      key,
      () =>
        new this.StoreClass<WorkspacesConfig>({
          name: 'workspaces',
          cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
          defaults: {
            workspaces: [],
            activeWorkspaceId: null,
          },
        })
    );
  }

  /**
   * Get a profile-specific store for apps
   */
  getAppsStore(): Store<AppsConfig> {
    const key = `${this.currentProfile}-apps`;
    return this.getOrCreateStore<AppsConfig>(
      key,
      () =>
        new this.StoreClass<AppsConfig>({
          name: 'apps',
          cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
          defaults: {
            apps: [],
          },
        })
    );
  }

  /**
   * Get a profile-specific store for settings
   */
  getSettingsStore(): Store<Settings> {
    const key = `${this.currentProfile}-settings`;
    return this.getOrCreateStore<Settings>(
      key,
      () =>
        new this.StoreClass<Settings>({
          name: 'settings',
          cwd: path.join(app.getPath('userData'), 'profiles', this.currentProfile),
          defaults: DEFAULT_SETTINGS,
        })
    );
  }

  /**
   * Clear all cached stores (useful for profile switching)
   */
  clearCache(): void {
    this.stores.clear();
  }

  private getOrCreateStore<T extends Record<string, any>>(
    key: string,
    factory: () => Store<T>
  ): Store<T> {
    if (!this.stores.has(key)) {
      this.stores.set(key, factory() as Store<any>);
    }
    return this.stores.get(key) as Store<T>;
  }
}
