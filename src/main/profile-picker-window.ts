import { BrowserWindow } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import { debugError, debugLog } from '../shared/utils/debug';

export class ProfilePickerWindow {
  private window: BrowserWindow | null = null;

  createWindow(): BrowserWindow {
    const preloadPath = path.join(__dirname, '../preload/index.js');
    if (!existsSync(preloadPath)) {
      debugError('Profile picker preload script missing at:', preloadPath);
    }

    this.window = new BrowserWindow({
      width: 900,
      height: 620,
      minWidth: 720,
      minHeight: 480,
      show: false,
      title: 'Dockyard Profiles',
      backgroundColor: '#0f172a',
      webPreferences: {
        preload: preloadPath,
        scrollBounce: true,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
      const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
      this.window.loadURL(`${devServerUrl}/profile-picker.html`);
    } else {
      this.window.loadFile(path.join(__dirname, '..', 'renderer', 'profile-picker.html'));
    }

    this.window.once('ready-to-show', () => {
      this.window?.show();
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    debugLog('Profile picker window created');
    return this.window;
  }

  getWindow(): BrowserWindow | null {
    return this.window;
  }
}
