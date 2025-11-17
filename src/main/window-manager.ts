import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import { IPC_EVENTS } from '../shared/constants';

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
    if (existsSync(preloadPath)) {
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
        webviewTag: true, // Enable webview tag support
      },
      show: false, // Don't show until ready
    });

    this.setupApplicationMenu();
    this.registerInputShortcuts(this.mainWindow);

    // Load the renderer
    if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
      // In development, load from Vite dev server
      const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
      this.mainWindow.loadURL(devServerUrl);
      // this.mainWindow.webContents.openDevTools();
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

  private registerInputShortcuts(window: BrowserWindow): void {
    const isMac = process.platform === 'darwin';

    window.webContents.on('before-input-event', (event, input) => {
      const key = input.key?.toLowerCase();
      if (!key) return;

      const cmdOrCtrl = isMac ? input.meta : input.control;
      const isF5 = input.key?.toUpperCase() === 'F5';

      if (!cmdOrCtrl && isF5) {
        event.preventDefault();
        if (input.shift) {
          this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_FORCE_RELOAD);
        } else {
          this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_RELOAD);
        }
        return;
      }

      if (cmdOrCtrl && key === 'r' && !input.shift && !input.alt) {
        event.preventDefault();
        this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_RELOAD);
        return;
      }

      if (cmdOrCtrl && key === 'r' && input.shift && !input.alt) {
        event.preventDefault();
        this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_FORCE_RELOAD);
        return;
      }

      if (cmdOrCtrl && key === 'f' && !input.shift && !input.alt) {
        event.preventDefault();
        this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_FIND);
        return;
      }

      if (cmdOrCtrl && key === 'p' && !input.shift && !input.alt) {
        event.preventDefault();
        this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_PRINT);
        return;
      }

      const toggleDevToolsShortcut =
        (isMac && input.meta && input.alt && !input.control && key === 'i' && !input.shift) ||
        (!isMac && input.control && input.shift && key === 'i');

      if (toggleDevToolsShortcut) {
        event.preventDefault();
        this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS);
      }
    });
  }

  private emitShortcutEvent(channel: string): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel);
    }
  }

  private setupApplicationMenu(): void {
    const isMac = process.platform === 'darwin';
    const macAppSubmenu: MenuItemConstructorOptions[] = [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ];

    const fileSubmenu: MenuItemConstructorOptions[] = isMac
      ? [{ role: 'close' }]
      : [{ role: 'quit' }];

    const editSubmenu: MenuItemConstructorOptions[] = [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ];

    if (isMac) {
      editSubmenu.push(
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        { label: 'Speech', submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }] }
      );
    } else {
      editSubmenu.push({ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' });
    }

    const viewSubmenu: MenuItemConstructorOptions[] = [
      {
        label: 'Reload Active App',
        accelerator: 'CmdOrCtrl+R',
        click: () => this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_RELOAD),
      },
      {
        label: 'Force Reload Active App',
        accelerator: 'Shift+CmdOrCtrl+R',
        click: () => this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_FORCE_RELOAD),
      },
      {
        label: 'Toggle Active App DevTools',
        accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: () => this.emitShortcutEvent(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS),
      },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      {
        label: 'Toggle Dockyard DevTools',
        accelerator: isMac ? 'Alt+Command+D' : 'Ctrl+Shift+D',
        click: () => this.toggleDockyardDevTools(),
      },
    ];

    const windowSubmenu: MenuItemConstructorOptions[] = [{ role: 'minimize' }, { role: 'zoom' }];
    if (isMac) {
      windowSubmenu.push({ type: 'separator' }, { role: 'front' });
    } else {
      windowSubmenu.push({ role: 'close' });
    }

    const helpSubmenu: MenuItemConstructorOptions[] = [
      {
        label: 'Dockyard Documentation',
        click: () => {
          void shell.openExternal('https://github.com/MayR-Labs/dockyard-electron');
        },
      },
    ];

    const template: MenuItemConstructorOptions[] = [];

    if (isMac) {
      template.push({ label: app.name, submenu: macAppSubmenu });
    }

    template.push(
      { label: 'File', submenu: fileSubmenu },
      { label: 'Edit', submenu: editSubmenu },
      { label: 'View', submenu: viewSubmenu },
      { label: 'Window', submenu: windowSubmenu },
      { role: 'help', submenu: helpSubmenu }
    );

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private toggleDockyardDevTools(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      return;
    }

    if (this.mainWindow.webContents.isDevToolsOpened()) {
      this.mainWindow.webContents.closeDevTools();
    } else {
      this.mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
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
