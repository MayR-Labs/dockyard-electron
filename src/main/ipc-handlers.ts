/**
 * IPC Handlers Coordinator
 * Single Responsibility: Coordinate and initialize all IPC handler modules
 * Follows Dependency Injection and Single Responsibility principles
 */

import { StoreManager } from './store-manager';
import { BrowserViewManager } from './browser-view-manager';
import { ProfileHandlers } from './handlers/profile-handlers';
import { WorkspaceHandlers } from './handlers/workspace-handlers';
import { AppHandlers } from './handlers/app-handlers';
import { SettingsHandlers } from './handlers/settings-handlers';
import { NotificationHandlers } from './handlers/notification-handlers';
import { BrowserViewHandlers } from './handlers/browserview-handlers';

export class IPCHandlers {
  private profileHandlers!: ProfileHandlers;
  private workspaceHandlers!: WorkspaceHandlers;
  private appHandlers!: AppHandlers;
  private settingsHandlers!: SettingsHandlers;
  private notificationHandlers!: NotificationHandlers;
  private browserViewHandlers!: BrowserViewHandlers;

  constructor(
    private storeManager: StoreManager,
    private browserViewManager: BrowserViewManager
  ) {
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    // Initialize all handler modules
    this.profileHandlers = new ProfileHandlers(this.storeManager);
    this.workspaceHandlers = new WorkspaceHandlers(this.storeManager);
    this.appHandlers = new AppHandlers(this.storeManager, this.browserViewManager);
    this.settingsHandlers = new SettingsHandlers(this.storeManager);
    this.notificationHandlers = new NotificationHandlers(this.storeManager);
    this.browserViewHandlers = new BrowserViewHandlers(this.storeManager, this.browserViewManager);
  }
}
