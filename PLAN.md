# **Dockyard Technical Implementation Plan**

This document provides detailed technical specifications, architecture decisions, and implementation guidelines for building Dockyard with TypeScript, Electron, React, and modern web technologies.

---

## **Table of Contents**

1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Data Models](#data-models)
4. [Implementation Details](#implementation-details)
5. [Security Considerations](#security-considerations)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [Build & Deployment](#build--deployment)

---

## **Technology Stack**

### Core Technologies
- **Electron** (v28+) - Desktop application framework
- **TypeScript** (v5+) - Type-safe JavaScript
- **React** (v18+) - UI framework
- **Vite** (v5+) - Build tool and dev server

### Supporting Libraries
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **electron-store** - Local data persistence
- **Zustand** or **Redux Toolkit** - State management
- **React Router** - Navigation (if needed)
- **Lucide React** or **Heroicons** - Icon library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TS-specific linting
- **Jest** - Unit testing
- **Playwright** or **Spectron** - E2E testing
- **electron-builder** - Application packaging

---

## **Project Architecture**

### Directory Structure

```
dockyard-electron/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Main entry point
│   │   ├── window-manager.ts   # Window creation & management
│   │   ├── app-manager.ts      # App/webview lifecycle
│   │   ├── profile-manager.ts  # Profile handling
│   │   ├── ipc-handlers.ts     # IPC communication handlers
│   │   ├── menu.ts              # Application menu
│   │   ├── tray.ts              # System tray icon
│   │   └── utils/               # Main process utilities
│   │
│   ├── renderer/                # React UI (renderer process)
│   │   ├── src/
│   │   │   ├── main.tsx         # React entry point
│   │   │   ├── App.tsx          # Root component
│   │   │   ├── components/      # React components
│   │   │   │   ├── AppDock/     # App dock UI
│   │   │   │   ├── Workspace/   # Workspace management
│   │   │   │   ├── Settings/    # Settings panels
│   │   │   │   └── Common/      # Shared components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── store/           # State management
│   │   │   ├── styles/          # Global styles
│   │   │   └── utils/           # Renderer utilities
│   │   ├── index.html           # HTML entry point
│   │   └── vite.config.ts       # Vite configuration
│   │
│   ├── preload/                 # Preload scripts (bridge)
│   │   ├── index.ts             # Main preload script
│   │   └── api.ts               # Exposed API to renderer
│   │
│   └── shared/                  # Shared code
│       ├── types/               # TypeScript types/interfaces
│       │   ├── profile.ts       # Profile types
│       │   ├── workspace.ts     # Workspace types
│       │   ├── app.ts           # App types
│       │   ├── settings.ts      # Settings types
│       │   └── ipc.ts           # IPC message types
│       ├── models/              # Data models
│       ├── constants.ts         # Application constants
│       └── utils/               # Shared utilities
│
├── assets/                      # Static assets
│   ├── icons/                   # App icons
│   ├── images/                  # Images
│   └── app-catalog/             # Curated app metadata
│
├── forge.config.js              # Electron Forge configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # TailwindCSS configuration
├── .eslintrc.js                 # ESLint configuration
└── package.json                 # Project dependencies
```

---

## **Data Models**

### Profile Model
```typescript
interface Profile {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Profile name (e.g., "Work", "Personal")
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
  theme?: ThemeSettings;         // Optional profile-specific theme
  settings: ProfileSettings;     // Profile-level settings
  workspaces: string[];          // Array of workspace IDs
}

interface ProfileSettings {
  defaultWorkspace?: string;     // Default workspace ID
  notifications: boolean;        // Enable notifications
  autoHibernate: boolean;        // Enable auto-hibernation
  hibernateTimeout: number;      // Minutes (default: 15)
  launchOnStartup: boolean;      // Launch on system startup
}
```

### Workspace Model
```typescript
interface Workspace {
  id: string;                    // Unique identifier (UUID)
  profileId: string;             // Parent profile ID
  name: string;                  // Workspace name
  icon?: string;                 // Icon (emoji or path)
  position: number;              // Order/position
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
  apps: AppInstance[];           // Array of app instances
  settings: WorkspaceSettings;   // Workspace-specific settings
}

interface WorkspaceSettings {
  sharedSession: boolean;        // Share sessions between apps
  theme?: ThemeSettings;         // Workspace-specific theme override
  layout: LayoutConfig;          // Layout configuration
  autoHibernate?: boolean;       // Override profile setting
  hibernateTimeout?: number;     // Override profile setting
}

interface LayoutConfig {
  dockPosition: 'top' | 'bottom' | 'left' | 'right';
  splitViews?: SplitViewConfig[];
  activeAppId?: string;          // Currently active app
}
```

### App Model
```typescript
interface AppInstance {
  id: string;                    // Unique instance identifier
  workspaceId: string;           // Parent workspace ID
  appDefinitionId?: string;      // Reference to catalog app (if curated)
  name: string;                  // Display name
  url: string;                   // App URL
  icon: string;                  // Icon URL or path
  position: number;              // Order in dock
  partition: string;             // Electron partition name
  createdAt: number;             // Timestamp
  settings: AppSettings;         // App-specific settings
  state: AppState;               // Runtime state
}

interface AppDefinition {
  id: string;                    // Catalog app ID (e.g., "gmail", "slack")
  name: string;                  // App name
  url: string;                   // Default URL
  icon: string;                  // Icon URL
  category: string;              // Category (e.g., "Communication")
  description?: string;          // Short description
  customCSS?: string;            // Optional default CSS
}

interface AppSettings {
  notificationsEnabled: boolean;
  badge: boolean;                // Show badge count
  zoom: number;                  // Zoom level (0.5 - 2.0)
  customCSS?: string;            // Custom CSS injection
  customJS?: string;             // Custom JS injection
  autoHibernate?: boolean;       // Override workspace setting
  hibernateTimeout?: number;     // Override workspace setting
}

interface AppState {
  isLoaded: boolean;             // WebView loaded
  isHibernated: boolean;         // Currently hibernated
  lastActiveAt: number;          // Last interaction timestamp
  badgeCount?: number;           // Notification badge count
  title?: string;                // Current page title
  favicon?: string;              // Current favicon
}
```

### Theme Model
```typescript
interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;           // Hex color
  background: 'glass' | 'solid' | 'minimal';
  customCSS?: string;            // Additional CSS overrides
}
```

---

## **Implementation Details**

### 1. Main Process (Electron)

#### Window Management
```typescript
// src/main/window-manager.ts
class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  
  createMainWindow(profile: Profile): BrowserWindow {
    const win = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hiddenInset', // macOS
      frame: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true, // Enable sandboxing for security
      },
    });
    
    // Load renderer
    if (isDev) {
      win.loadURL('http://localhost:5173');
    } else {
      win.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
    
    return win;
  }
}
```

#### App Management with BrowserView
```typescript
// src/main/app-manager.ts
class AppManager {
  private browserViews: Map<string, BrowserView> = new Map();
  
  createAppView(appInstance: AppInstance, mainWindow: BrowserWindow): BrowserView {
    const view = new BrowserView({
      webPreferences: {
        partition: `persist:${appInstance.partition}`,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        devTools: true,
      },
    });
    
    view.webContents.loadURL(appInstance.url);
    
    // Handle notifications
    view.webContents.on('notification', (event, notification) => {
      this.forwardNotification(appInstance, notification);
    });
    
    // Track title changes for badge/state
    view.webContents.on('page-title-updated', (event, title) => {
      this.updateAppState(appInstance.id, { title });
    });
    
    this.browserViews.set(appInstance.id, view);
    return view;
  }
  
  hibernateApp(appId: string): void {
    const view = this.browserViews.get(appId);
    if (view) {
      // Suspend renderer process to save memory
      view.webContents.executeJavaScript('window.isHibernated = true');
      // Note: Actual suspension requires custom implementation
    }
  }
  
  wakeApp(appId: string): void {
    const view = this.browserViews.get(appId);
    if (view) {
      view.webContents.executeJavaScript('window.isHibernated = false');
    }
  }
}
```

#### Profile Management
```typescript
// src/main/profile-manager.ts
import Store from 'electron-store';

class ProfileManager {
  private profileStore: Store;
  private currentProfile: Profile | null = null;
  
  constructor(profileName?: string) {
    this.profileStore = new Store({
      name: profileName || 'default',
      cwd: app.getPath('userData'),
    });
  }
  
  loadProfile(name: string): Profile {
    const profile = this.profileStore.get(`profiles.${name}`) as Profile;
    if (!profile) {
      return this.createProfile(name);
    }
    this.currentProfile = profile;
    return profile;
  }
  
  createProfile(name: string): Profile {
    const profile: Profile = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        notifications: true,
        autoHibernate: true,
        hibernateTimeout: 15,
        launchOnStartup: false,
      },
      workspaces: [],
    };
    
    this.profileStore.set(`profiles.${name}`, profile);
    return profile;
  }
  
  saveWorkspace(workspace: Workspace): void {
    this.profileStore.set(`workspaces.${workspace.id}`, workspace);
  }
}
```

#### IPC Communication
```typescript
// src/main/ipc-handlers.ts
import { ipcMain } from 'electron';

export function setupIPCHandlers(
  profileManager: ProfileManager,
  appManager: AppManager
): void {
  // Profile operations
  ipcMain.handle('profile:get', () => {
    return profileManager.getCurrentProfile();
  });
  
  ipcMain.handle('profile:create', (_event, name: string) => {
    return profileManager.createProfile(name);
  });
  
  // Workspace operations
  ipcMain.handle('workspace:create', (_event, data: CreateWorkspaceData) => {
    return profileManager.createWorkspace(data);
  });
  
  ipcMain.handle('workspace:switch', (_event, workspaceId: string) => {
    return appManager.switchWorkspace(workspaceId);
  });
  
  // App operations
  ipcMain.handle('app:create', (_event, data: CreateAppData) => {
    return appManager.createApp(data);
  });
  
  ipcMain.handle('app:hibernate', (_event, appId: string) => {
    appManager.hibernateApp(appId);
  });
  
  ipcMain.handle('app:wake', (_event, appId: string) => {
    appManager.wakeApp(appId);
  });
  
  ipcMain.handle('app:clear-session', (_event, appId: string) => {
    return appManager.clearAppSession(appId);
  });
}
```

### 2. Preload Script

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // Profile API
  profile: {
    get: () => ipcRenderer.invoke('profile:get'),
    create: (name: string) => ipcRenderer.invoke('profile:create', name),
  },
  
  // Workspace API
  workspace: {
    create: (data: CreateWorkspaceData) => ipcRenderer.invoke('workspace:create', data),
    switch: (id: string) => ipcRenderer.invoke('workspace:switch', id),
    delete: (id: string) => ipcRenderer.invoke('workspace:delete', id),
    list: () => ipcRenderer.invoke('workspace:list'),
  },
  
  // App API
  app: {
    create: (data: CreateAppData) => ipcRenderer.invoke('app:create', data),
    delete: (id: string) => ipcRenderer.invoke('app:delete', id),
    hibernate: (id: string) => ipcRenderer.invoke('app:hibernate', id),
    wake: (id: string) => ipcRenderer.invoke('app:wake', id),
    clearSession: (id: string) => ipcRenderer.invoke('app:clear-session', id),
  },
  
  // System events
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['app:state-changed', 'notification', 'workspace:changed'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

// Type definition for renderer process
export type ElectronAPI = typeof api;
```

### 3. Renderer Process (React)

#### State Management with Zustand
```typescript
// src/renderer/src/store/useStore.ts
import { create } from 'zustand';

interface StoreState {
  profile: Profile | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  apps: AppInstance[];
  
  // Actions
  setProfile: (profile: Profile) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  switchWorkspace: (workspaceId: string) => void;
  addApp: (app: AppInstance) => void;
  updateAppState: (appId: string, state: Partial<AppState>) => void;
}

export const useStore = create<StoreState>((set) => ({
  profile: null,
  workspaces: [],
  currentWorkspace: null,
  apps: [],
  
  setProfile: (profile) => set({ profile }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  switchWorkspace: (workspaceId) => {
    window.electronAPI.workspace.switch(workspaceId);
    set((state) => ({
      currentWorkspace: state.workspaces.find(w => w.id === workspaceId) || null,
    }));
  },
  addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),
  updateAppState: (appId, newState) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === appId ? { ...app, state: { ...app.state, ...newState } } : app
    ),
  })),
}));
```

#### Component Structure
```typescript
// src/renderer/src/components/AppDock/AppDock.tsx
export const AppDock: React.FC = () => {
  const { apps, currentWorkspace } = useStore();
  const dockPosition = currentWorkspace?.settings.layout.dockPosition || 'left';
  
  return (
    <motion.div 
      className={`app-dock dock-${dockPosition}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {apps.map(app => (
        <AppIcon key={app.id} app={app} />
      ))}
      <AddAppButton />
    </motion.div>
  );
};
```

---

## **Security Considerations**

### 1. Content Security Policy
```typescript
// Apply strict CSP to prevent XSS
const csp = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self';
`;
```

### 2. Sandbox Mode
- Enable `sandbox: true` in BrowserView webPreferences
- Use `contextIsolation: true` in all webPreferences
- Never set `nodeIntegration: true`

### 3. Custom JS Injection
- Warn users about security risks
- Use `executeJavaScript` with caution
- Validate and sanitize all user-provided code
- Consider using Content Security Policy to limit injection capabilities

### 4. Partition Isolation
- Use unique partition names per app instance
- Clear sessions only when explicitly requested
- Store partition data in user data directory

---

## **Performance Optimization**

### 1. Auto-Hibernation Strategy
```typescript
class HibernationManager {
  private idleTimers: Map<string, NodeJS.Timeout> = new Map();
  
  startIdleTracking(appId: string, timeout: number): void {
    const timer = setTimeout(() => {
      this.hibernateApp(appId);
    }, timeout * 60 * 1000);
    
    this.idleTimers.set(appId, timer);
  }
  
  resetIdleTimer(appId: string, timeout: number): void {
    const timer = this.idleTimers.get(appId);
    if (timer) {
      clearTimeout(timer);
    }
    this.startIdleTracking(appId, timeout);
  }
}
```

### 2. Lazy Loading
- Create BrowserViews only when workspace is activated
- Unload hibernated apps from memory after extended inactivity
- Use virtual scrolling for large app lists

### 3. Memory Management
- Monitor memory usage per BrowserView
- Set memory limits for webContents
- Implement garbage collection triggers

---

## **Testing Strategy**

### Unit Tests (Jest)
```typescript
// Example: Profile Manager Tests
describe('ProfileManager', () => {
  it('should create a new profile', () => {
    const manager = new ProfileManager();
    const profile = manager.createProfile('test-profile');
    expect(profile.name).toBe('test-profile');
  });
  
  it('should load existing profile', () => {
    const manager = new ProfileManager();
    const profile = manager.loadProfile('test-profile');
    expect(profile).toBeDefined();
  });
});
```

### Integration Tests (Playwright)
```typescript
// Example: E2E Test
test('should create and switch workspace', async ({ page }) => {
  await page.click('[data-testid="new-workspace"]');
  await page.fill('[data-testid="workspace-name"]', 'Test Workspace');
  await page.click('[data-testid="create-workspace"]');
  
  const workspace = await page.locator('[data-testid="workspace-item"]').first();
  expect(await workspace.textContent()).toBe('Test Workspace');
});
```

---

## **Build & Deployment**

### electron-builder Configuration
```json
// electron-builder.yml
{
  "appId": "com.mayrlabs.dockyard",
  "productName": "Dockyard",
  "directories": {
    "output": "dist",
    "buildResources": "assets"
  },
  "files": [
    "out/**/*"
  ],
  "mac": {
    "category": "public.app-category.productivity",
    "target": ["dmg", "zip"]
  },
  "win": {
    "target": ["nsis", "portable"]
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"],
    "category": "Utility"
  }
}
```

### Build Scripts
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "start": "electron .",
    "dev:electron": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "build:electron": "npm run build && electron-builder",
    "test": "jest",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

---

## **Development Workflow**

### Getting Started
1. Clone repository
2. Run `npm install`
3. Run `npm run dev:electron` for development
4. Make changes with hot reload
5. Run tests: `npm test`
6. Build: `npm run build:electron`

### Git Workflow
- `main` branch: stable releases
- `develop` branch: active development
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`

### Code Review Checklist
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] ESLint/Prettier passed
- [ ] No security vulnerabilities
- [ ] Performance considered

---

## **Next Steps**

1. **Initialize TypeScript + Vite + React setup**
2. **Create basic window with dummy data**
3. **Implement Profile Manager with electron-store**
4. **Build Workspace UI and switcher**
5. **Integrate BrowserView for app embedding**
6. **Implement session isolation**
7. **Add auto-hibernation logic**
8. **Build theming system**
9. **Create settings panels**
10. **Package and distribute**

---

*This plan is a living document and will be updated as development progresses.*
