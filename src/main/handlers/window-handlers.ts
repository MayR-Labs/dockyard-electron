import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { WindowManager } from '../window-manager';

/**
 * Window IPC Handlers
 * Single Responsibility: Handle window-level IPC calls (e.g., Dockyard devtools)
 */
export class WindowHandlers {
  constructor(private windowManager: WindowManager) {
    this.register();
  }

  private register(): void {
    ipcMain.handle(IPC_CHANNELS.WINDOW.TOGGLE_DEVTOOLS, async () => {
      const window = this.windowManager.getMainWindow();
      if (!window || window.isDestroyed()) {
        return;
      }

      if (window.webContents.isDevToolsOpened()) {
        window.webContents.closeDevTools();
      } else {
        window.webContents.openDevTools({ mode: 'detach' });
      }
    });
  }
}
