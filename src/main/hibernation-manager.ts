import { AppManager } from './app-manager';
import { ProfileManager } from './profile-manager';
import { DEFAULT_HIBERNATION_TIMEOUT } from '../shared/constants';

export interface HibernationConfig {
  enabled: boolean;
  timeout: number; // milliseconds
  excludeAppIds: string[];
}

export class HibernationManager {
  private appManager: AppManager;
  private profileManager: ProfileManager;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private lastActivityMap: Map<string, number> = new Map();
  private config: HibernationConfig;

  constructor(appManager: AppManager, profileManager: ProfileManager) {
    this.appManager = appManager;
    this.profileManager = profileManager;
    
    const profile = this.profileManager.getCurrentProfile();
    this.config = {
      enabled: profile?.settings.autoHibernate ?? true,
      timeout: profile?.settings.hibernateTimeout ?? DEFAULT_HIBERNATION_TIMEOUT,
      excludeAppIds: [],
    };
  }

  start(): void {
    if (this.checkInterval) {
      return;
    }

    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkAndHibernateInactiveApps();
    }, 30000);

    console.log('Hibernation manager started');
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('Hibernation manager stopped');
  }

  updateConfig(config: Partial<HibernationConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (!this.config.enabled && this.checkInterval) {
      this.stop();
    } else if (this.config.enabled && !this.checkInterval) {
      this.start();
    }
  }

  trackActivity(appId: string): void {
    this.lastActivityMap.set(appId, Date.now());
  }

  private checkAndHibernateInactiveApps(): void {
    if (!this.config.enabled) {
      return;
    }

    const currentAppId = this.appManager.getCurrentAppId();
    const now = Date.now();
    const profile = this.profileManager.getCurrentProfile();
    
    if (!profile) {
      return;
    }

    // Get all workspaces for the current profile
    const workspaces = this.profileManager.getWorkspacesByProfile(profile.id);
    
    // Collect all app instances
    const allAppIds: string[] = [];
    for (const workspace of workspaces) {
      const apps = this.profileManager.getAppsByWorkspace(workspace.id);
      allAppIds.push(...apps.map(app => app.id));
    }

    // Check each app for hibernation
    for (const appId of allAppIds) {
      // Skip current app
      if (appId === currentAppId) {
        continue;
      }

      // Skip excluded apps
      if (this.config.excludeAppIds.includes(appId)) {
        continue;
      }

      const lastActivity = this.lastActivityMap.get(appId) || 0;
      const inactiveDuration = now - lastActivity;

      // If app has been inactive for longer than timeout, hibernate it
      if (inactiveDuration > this.config.timeout) {
        const view = this.appManager.getView(appId);
        if (view) {
          console.log(`Hibernating inactive app: ${appId}`);
          this.appManager.hibernateApp(appId);
        }
      }
    }
  }

  getInactiveApps(): Array<{ appId: string; inactiveDuration: number }> {
    const now = Date.now();
    const result: Array<{ appId: string; inactiveDuration: number }> = [];

    for (const [appId, lastActivity] of this.lastActivityMap.entries()) {
      const inactiveDuration = now - lastActivity;
      result.push({ appId, inactiveDuration });
    }

    return result.sort((a, b) => b.inactiveDuration - a.inactiveDuration);
  }

  getConfig(): HibernationConfig {
    return { ...this.config };
  }
}
