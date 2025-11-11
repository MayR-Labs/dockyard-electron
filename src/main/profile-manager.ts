import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';
import { Profile, Workspace, AppInstance } from '../shared/types';
import { DEFAULT_HIBERNATION_TIMEOUT, DEFAULT_THEME } from '../shared/constants';

export class ProfileManager {
  private store: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private currentProfile: Profile | null = null;

  constructor(profileName?: string) {
    this.store = new Store({
      name: profileName || 'default',
    });
  }

  getCurrentProfile(): Profile | null {
    return this.currentProfile;
  }

  loadProfile(name: string): Profile {
    const profiles = this.store.get('profiles', {}) as Record<string, Profile>;
    let profile = profiles[name];

    if (!profile) {
      profile = this.createProfile(name);
    }

    this.currentProfile = profile;
    return profile;
  }

  createProfile(name: string): Profile {
    const profiles = this.store.get('profiles', {}) as Record<string, Profile>;

    const profile: Profile = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      theme: DEFAULT_THEME,
      settings: {
        notifications: true,
        autoHibernate: true,
        hibernateTimeout: DEFAULT_HIBERNATION_TIMEOUT,
        launchOnStartup: false,
      },
      workspaces: [],
    };

    profiles[name] = profile;
    this.store.set('profiles', profiles);
    this.currentProfile = profile;

    return profile;
  }

  updateProfile(profileId: string, updates: Partial<Profile>): Profile {
    const profiles = this.store.get('profiles', {}) as Record<string, Profile>;
    const profile = Object.values(profiles).find((p) => p.id === profileId);

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: Date.now(),
    };

    profiles[profile.name] = updatedProfile;
    this.store.set('profiles', profiles);

    if (this.currentProfile?.id === profileId) {
      this.currentProfile = updatedProfile;
    }

    return updatedProfile;
  }

  deleteProfile(profileId: string): void {
    const profiles = this.store.get('profiles', {}) as Record<string, Profile>;
    const profile = Object.values(profiles).find((p) => p.id === profileId);

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    delete profiles[profile.name];
    this.store.set('profiles', profiles);

    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
    }
  }

  listProfiles(): Profile[] {
    const profiles = this.store.get('profiles', {}) as Record<string, Profile>;
    return Object.values(profiles);
  }

  // Workspace operations
  createWorkspace(profileId: string, name: string, icon?: string): Workspace {
    const workspace: Workspace = {
      id: uuidv4(),
      profileId,
      name,
      icon: icon || '📁',
      position: this.getWorkspacesByProfile(profileId).length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      apps: [],
      settings: {
        sharedSession: false,
        layout: {
          dockPosition: 'left',
        },
      },
    };

    const workspaces = this.store.get('workspaces', {}) as Record<string, Workspace>;
    workspaces[workspace.id] = workspace;
    this.store.set('workspaces', workspaces);

    // Update profile's workspace list
    if (this.currentProfile?.id === profileId) {
      this.currentProfile.workspaces.push(workspace.id);
      this.updateProfile(profileId, { workspaces: this.currentProfile.workspaces });
    }

    return workspace;
  }

  updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Workspace {
    const workspaces = this.store.get('workspaces', {}) as Record<string, Workspace>;
    const workspace = workspaces[workspaceId];

    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const updatedWorkspace = {
      ...workspace,
      ...updates,
      updatedAt: Date.now(),
    };

    workspaces[workspaceId] = updatedWorkspace;
    this.store.set('workspaces', workspaces);

    return updatedWorkspace;
  }

  deleteWorkspace(workspaceId: string): void {
    const workspaces = this.store.get('workspaces', {}) as Record<string, Workspace>;
    const workspace = workspaces[workspaceId];

    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    // Delete all apps in the workspace
    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    workspace.apps.forEach((appId) => {
      delete apps[appId];
    });
    this.store.set('apps', apps);

    // Delete the workspace
    delete workspaces[workspaceId];
    this.store.set('workspaces', workspaces);

    // Update profile's workspace list
    if (this.currentProfile) {
      this.currentProfile.workspaces = this.currentProfile.workspaces.filter(
        (id) => id !== workspaceId
      );
      this.updateProfile(this.currentProfile.id, {
        workspaces: this.currentProfile.workspaces,
      });
    }
  }

  getWorkspacesByProfile(profileId: string): Workspace[] {
    const workspaces = this.store.get('workspaces', {}) as Record<string, Workspace>;
    return Object.values(workspaces).filter((w) => w.profileId === profileId);
  }

  getWorkspace(workspaceId: string): Workspace | null {
    const workspaces = this.store.get('workspaces', {}) as Record<string, Workspace>;
    return workspaces[workspaceId] || null;
  }

  // App operations
  createApp(
    workspaceId: string,
    name: string,
    url: string,
    icon?: string
  ): AppInstance {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const appId = uuidv4();
    const app: AppInstance = {
      id: appId,
      workspaceId,
      name,
      url,
      icon: icon || '🌐',
      position: workspace.apps.length,
      partition: workspace.settings.sharedSession
        ? `workspace-${workspaceId}`
        : `app-${appId}`,
      createdAt: Date.now(),
      settings: {
        notificationsEnabled: true,
        badge: true,
        zoom: 1.0,
      },
      state: {
        isLoaded: false,
        isHibernated: false,
        lastActiveAt: Date.now(),
      },
    };

    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    apps[appId] = app;
    this.store.set('apps', apps);

    // Update workspace's app list
    workspace.apps.push(appId);
    this.updateWorkspace(workspaceId, { apps: workspace.apps });

    return app;
  }

  updateApp(appId: string, updates: Partial<AppInstance>): AppInstance {
    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    const app = apps[appId];

    if (!app) {
      throw new Error(`App with id ${appId} not found`);
    }

    const updatedApp = {
      ...app,
      ...updates,
    };

    apps[appId] = updatedApp;
    this.store.set('apps', apps);

    return updatedApp;
  }

  deleteApp(appId: string): void {
    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    const app = apps[appId];

    if (!app) {
      throw new Error(`App with id ${appId} not found`);
    }

    // Remove from workspace's app list
    const workspace = this.getWorkspace(app.workspaceId);
    if (workspace) {
      workspace.apps = workspace.apps.filter((id) => id !== appId);
      this.updateWorkspace(workspace.id, { apps: workspace.apps });
    }

    // Delete the app
    delete apps[appId];
    this.store.set('apps', apps);
  }

  getApp(appId: string): AppInstance | null {
    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    return apps[appId] || null;
  }

  getAppsByWorkspace(workspaceId: string): AppInstance[] {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) {
      return [];
    }

    const apps = this.store.get('apps', {}) as Record<string, AppInstance>;
    return workspace.apps.map((appId) => apps[appId]).filter(Boolean);
  }
}
