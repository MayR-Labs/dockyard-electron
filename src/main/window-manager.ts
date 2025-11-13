import { BrowserWindow } from 'electron';
import path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  /**
   * Create the main application window
   */
  createMainWindow(): BrowserWindow {
    const preloadPath = path.join(__dirname, '../preload/index.js');
    console.log('Preload script path:', preloadPath);
    console.log('__dirname:', __dirname);

    // Check if preload file exists
    const fs = require('fs');
    if (fs.existsSync(preloadPath)) {
      console.log('✓ Preload script found');
    } else {
      console.error('✗ Preload script NOT found at:', preloadPath);
    }

    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false, // Temporarily disable sandbox to see if that's the issue
        webviewTag: true, // Enable webview tag
      },
      show: false, // Don't show until ready
    });

    // Load the renderer
    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
      // In development, load from Vite dev server
      const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
      this.mainWindow.loadURL(devServerUrl);
      this.mainWindow.webContents.openDevTools();
    } else {
      // In production, load from built files
      // dist/main/index.js -> dist/renderer/index.html
      this.mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Handle window close
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  /**
   * Get the main window instance
   */
  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  /**
   * Close all windows
   */
  closeAllWindows(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.close();
    }
  }
}
