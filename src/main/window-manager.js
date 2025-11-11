import { BrowserWindow } from 'electron';
import path from 'path';

export class WindowManager {
  mainWindow = null;

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width,
      height,
      minWidth,
      minHeight,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      frame,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation,
        nodeIntegration,
        sandbox);

    // Load renderer
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  getMainWindow() {
    return this.mainWindow;
  }
}
