import Store from 'electron-store';
import { v4 } from 'uuid';
import { Profile, Workspace, AppInstance } from '../shared/types';
import { DEFAULT_HIBERNATION_TIMEOUT, DEFAULT_THEME } from '../shared/constants';

export class ProfileManager {
  store: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  currentProfile= null;

  constructor(profileName) {
    this.store = new Store({
      name: profileName || 'default',
    });
  }

  getCurrentProfile() {
    return this.currentProfile;
  }

  loadProfile(name)= this.store.get('profiles', {}), Profile>;
    let profile = profiles[name];

    if (!profile) {
      profile = this.createProfile(name);
    }

    this.currentProfile = profile;
    return profile;
  }

  createProfile(name)= this.store.get('profiles', {}), Profile>;

    const profile= {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      theme,
      settings: {
        notifications,
        autoHibernate,
        hibernateTimeout,
        launchOnStartup,
      workspaces,
    };

    profiles[name] = profile;
    this.store.set('profiles', profiles);
    this.currentProfile = profile;

    return profile;
  }

  updateProfile(profileId)= this.store.get('profiles', {}), Profile>;
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

    if (this.currentProfile.id === profileId) {
      this.currentProfile = updatedProfile;
    }

    return updatedProfile;
  }

  deleteProfile(profileId) {
    const profiles = this.store.get('profiles', {}), Profile>;
    const profile = Object.values(profiles).find((p) => p.id === profileId);

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    delete profiles[profile.name];
    this.store.set('profiles', profiles);

    if (this.currentProfile.id === profileId) {
      this.currentProfile = null;
    }
  }

  listProfiles()= this.store.get('profiles', {}), Profile>;
    return Object.values(profiles);
  }

  // Workspace operations
  createWorkspace(profileId, name, icon) {
    const workspace= {
      id: uuidv4(),
      profileId,
      name,
      icon: icon || '📁',
      position: this.getWorkspacesByProfile(profileId).length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      apps,
      settings: {
        sharedSession,
        layout: {
          dockPosition: 'left',
        },
      },
    };

    const workspaces = this.store.get('workspaces', {}), Workspace>;
    workspaces[workspace.id] = workspace;
    this.store.set('workspaces', workspaces);

    // Update profile's workspace list
    if (this.currentProfile.id === profileId) {
      this.currentProfile.workspaces.push(workspace.id);
      this.updateProfile(profileId, { workspaces: this.currentProfile.workspaces });
    }

    return workspace;
  }

  updateWorkspace(workspaceId)= this.store.get('workspaces', {}), Workspace>;
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

  deleteWorkspace(workspaceId) {
    const workspaces = this.store.get('workspaces', {}), Workspace>;
    const workspace = workspaces[workspaceId];

    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    // Delete all apps in the workspace
    const apps = this.store.get('apps', {}), AppInstance>;
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

  getWorkspacesByProfile(profileId)= this.store.get('workspaces', {}), Workspace>;
    return Object.values(workspaces).filter((w) => w.profileId === profileId);
  }

  getWorkspace(workspaceId)= this.store.get('workspaces', {}), Workspace>;
    return workspaces[workspaceId] || null;
  }

  // App operations
  createApp(
    workspaceId,
    name,
    url,
    icon)= this.getWorkspace(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const appId = uuidv4();
    const app= {
      id,
      icon: icon || '🌐',
      position: workspace.apps.length,
      partition: workspace.settings.sharedSession
        ? `workspace-${workspaceId}`
        : `app-${appId}`,
      createdAt: Date.now(),
      settings: {
        notificationsEnabled,
        badge,
        zoom: 1.0,
      },
      state: {
        isLoaded,
        isHibernated,
        lastActiveAt: Date.now(),
      },
    };

    const apps = this.store.get('apps', {}), AppInstance>;
    apps[appId] = app;
    this.store.set('apps', apps);

    // Update workspace's app list
    workspace.apps.push(appId);
    this.updateWorkspace(workspaceId, { apps: workspace.apps });

    return app;
  }

  updateApp(appId)= this.store.get('apps', {}), AppInstance>;
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

  deleteApp(appId) {
    const apps = this.store.get('apps', {}), AppInstance>;
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

  getApp(appId)= this.store.get('apps', {}), AppInstance>;
    return apps[appId] || null;
  }

  getAppsByWorkspace(workspaceId)= this.getWorkspace(workspaceId);
    if (!workspace) {
      return [];
    }

    const apps = this.store.get('apps', {}), AppInstance>;
    return workspace.apps.map((appId) => apps[appId]).filter(Boolean);
  }
}
