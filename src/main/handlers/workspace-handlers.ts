/**
 * Workspace IPC Handlers
 * Single Responsibility: Handle workspace-related IPC communications
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS, DEFAULTS } from '../../shared/constants';
import { StoreManager } from '../store-manager';
import { Workspace } from '../../shared/types';
import { generateId, getCurrentTimestamp } from '../../shared/utils';

export class WorkspaceHandlers {
  constructor(private storeManager: StoreManager) {
    this.register();
  }

  private register(): void {
    this.registerListHandler();
    this.registerCreateHandler();
    this.registerUpdateHandler();
    this.registerDeleteHandler();
    this.registerSwitchHandler();
    this.registerGetActiveHandler();
  }

  private registerListHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.LIST, async () => {
      const store = this.storeManager.getWorkspacesStore();
      return store.get('workspaces', []);
    });
  }

  private registerCreateHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.CREATE, async (_, data: Partial<Workspace>) => {
      const store = this.storeManager.getWorkspacesStore();
      const workspaces = store.get('workspaces', []);

      const newWorkspace: Workspace = {
        id: generateId(),
        name: data.name || 'New Workspace',
        icon: data.icon,
        apps: data.apps || [],
        layout: data.layout || {
          dockPosition: DEFAULTS.DOCK_POSITION,
          dockSize: DEFAULTS.DOCK_SIZE,
        },
        theme: data.theme,
        sessionMode: data.sessionMode || 'isolated',
        hibernation: data.hibernation || {
          enabled: true,
          idleTimeMinutes: DEFAULTS.IDLE_TIME_MINUTES,
        },
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      workspaces.push(newWorkspace);
      store.set('workspaces', workspaces);

      // Set as active if it's the first workspace
      if (workspaces.length === 1) {
        store.set('activeWorkspaceId', newWorkspace.id);
      }

      return newWorkspace;
    });
  }

  private registerUpdateHandler(): void {
    ipcMain.handle(
      IPC_CHANNELS.WORKSPACE.UPDATE,
      async (_, id: string, data: Partial<Workspace>) => {
        const store = this.storeManager.getWorkspacesStore();
        const workspaces = store.get('workspaces', []);

        const index = workspaces.findIndex((w: Workspace) => w.id === id);
        if (index === -1) {
          throw new Error(`Workspace with id "${id}" not found`);
        }

        workspaces[index] = {
          ...workspaces[index],
          ...data,
          id, // Ensure id cannot be changed
          updatedAt: getCurrentTimestamp(),
        };

        store.set('workspaces', workspaces);
        return workspaces[index];
      }
    );
  }

  private registerDeleteHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.DELETE, async (_, id: string) => {
      const store = this.storeManager.getWorkspacesStore();
      const workspaces = store.get('workspaces', []);
      const filtered = workspaces.filter((w: Workspace) => w.id !== id);
      store.set('workspaces', filtered);

      // If deleted workspace was active, switch to first available
      const activeId = store.get('activeWorkspaceId');
      if (activeId === id && filtered.length > 0) {
        store.set('activeWorkspaceId', filtered[0].id);
      }
    });
  }

  private registerSwitchHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.SWITCH, async (_, id: string) => {
      const store = this.storeManager.getWorkspacesStore();
      store.set('activeWorkspaceId', id);
    });
  }

  private registerGetActiveHandler(): void {
    ipcMain.handle(IPC_CHANNELS.WORKSPACE.GET_ACTIVE, async () => {
      const store = this.storeManager.getWorkspacesStore();
      const activeId = store.get('activeWorkspaceId');
      if (!activeId) return null;

      const workspaces = store.get('workspaces', []);
      return workspaces.find((w: Workspace) => w.id === activeId) || null;
    });
  }
}
