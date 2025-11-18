# **Dockyard Implementation Plan**

This document provides a detailed technical plan for implementing Dockyard, covering architecture decisions, implementation strategies, and technical considerations for each major component.

---

## 📐 **Architecture Overview**

### **Technology Stack**

| Layer            | Technology               | Purpose                                      |
| ---------------- | ------------------------ | -------------------------------------------- |
| Desktop Shell    | Electron 39+             | Cross-platform desktop application framework |
| Frontend         | React 18+                | UI component library                         |
| Build Tool       | Vite 5+                  | Fast development and production builds       |
| Styling          | TailwindCSS 3+           | Utility-first CSS framework                  |
| Animation        | Framer Motion            | Smooth transitions and UI animations         |
| State Management | Zustand or React Context | Application state management                 |
| Data Persistence | electron-store           | Local JSON-based storage                     |
| TypeScript       | 5.0+                     | Type safety and better DX                    |
| Packaging        | Electron Forge           | Build and distribution                       |

### **Project Structure**

```
dockyard-electron/
├─ .github/
│  ├─ copilot-instructions.md      # AI coding assistant guidelines
│  └─ workflows/                    # CI/CD pipelines
├─ src/
│  ├─ main/                         # Electron main process
│  │  ├─ index.ts                   # Main entry point
│  │  ├─ window-manager.ts          # Window lifecycle management
│  │  ├─ ipc-handlers.ts            # IPC message handlers
│  │  ├─ profile-manager.ts         # Profile management logic
│  │  ├─ app-manager.ts             # App instance management
│  │  └─ menu.ts                    # Application menu
│  ├─ renderer/                     # React UI (renderer process)
│  │  ├─ src/
│  │  │  ├─ main.tsx                # React entry point
│  │  │  ├─ App.tsx                 # Root component
│  │  │  ├─ components/             # UI components
│  │  │  │  ├─ AppDock/             # App sidebar/dock
│  │  │  │  ├─ Workspace/           # Workspace views
│  │  │  │  ├─ Settings/            # Settings panels
│  │  │  │  ├─ AppView/             # Individual app container
│  │  │  │  └─ shared/              # Shared UI components
│  │  │  ├─ hooks/                  # Custom React hooks
│  │  │  ├─ store/                  # State management
│  │  │  ├─ utils/                  # Utility functions
│  │  │  └─ styles/                 # Global styles
│  │  ├─ index.html                 # HTML entry point
│  │  └─ vite.config.ts             # Vite configuration
│  ├─ preload/                      # Preload scripts
│  │  ├─ index.ts                   # Main preload script
│  │  └─ api.ts                     # Exposed IPC API
│  └─ shared/                       # Shared code
│     ├─ types/                     # TypeScript types/interfaces
│     │  ├─ profile.ts
│     │  ├─ workspace.ts
│     │  ├─ app.ts
│     │  └─ settings.ts
│     ├─ constants.ts               # App-wide constants
│     └─ utils.ts                   # Shared utilities
├─ assets/                          # Static assets
│  ├─ icons/                        # App icons
│  └─ app-templates/                # Built-in app configurations
├─ tests/                           # Test files
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ forge.config.js                  # Electron Forge config
├─ tsconfig.json                    # TypeScript config
├─ tailwind.config.js               # TailwindCSS config
├─ package.json
└─ README.md
```

---

## 🔧 **Phase 1: Core Architecture Implementation**

### **1.1 TypeScript & Build Setup**

#### Tasks:

1. **Configure TypeScript**
   - Set up `tsconfig.json` with strict mode
   - Separate configs for main, renderer, and preload
   - Path aliases for cleaner imports

2. **Vite Configuration**
   - Configure Vite for Electron renderer process
   - Set up hot module replacement (HMR)
   - Configure build output directories
   - Integrate TailwindCSS

3. **Electron Forge Configuration**
   - Configure makers for Windows, macOS, and Linux
   - Set up auto-update configuration
   - Configure app icons and metadata

#### Technical Decisions:

- **TypeScript strict mode**: Catch errors early, improve maintainability
- **Path aliases**: `@main`, `@renderer`, `@shared` for cleaner imports
- **Separate tsconfig files**: Different compiler options for each process

#### Implementation Steps:

```bash
# 1. Install dependencies
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npm install react react-dom zustand framer-motion electron-store

# 2. Create tsconfig.json files
# 3. Set up Vite config for renderer
# 4. Configure Tailwind
# 5. Update Electron Forge config
```

---

### **1.2 Main Process Architecture**

#### Core Components:

**`src/main/index.ts`**

- Entry point for main process
- Initialize app, handle lifecycle events
- Set up IPC handlers
- Manage command-line arguments

**`src/main/window-manager.ts`**

- Create and manage BrowserWindows
- Handle window state (minimize, maximize, close)
- Multi-window support for detached apps

**`src/main/ipc-handlers.ts`**

- Register IPC handlers for renderer communication
- Namespace handlers by domain (profile:_, workspace:_, app:\*)
- Validate and sanitize IPC messages

**`src/main/profile-manager.ts`**

- Profile creation, deletion, and switching
- Manage per-profile data stores
- Handle `--profile=<name>` command-line flag

**`src/main/app-manager.ts`**

- Manage app instances (BrowserViews)
- Handle app lifecycle (create, destroy, suspend, resume)
- Manage session partitions

#### IPC Communication Pattern:

```typescript
// Namespaced channels for organization
const IPC_CHANNELS = {
  PROFILE: {
    LIST: 'profile:list',
    CREATE: 'profile:create',
    DELETE: 'profile:delete',
    SWITCH: 'profile:switch',
  },
  WORKSPACE: {
    LIST: 'workspace:list',
    CREATE: 'workspace:create',
    UPDATE: 'workspace:update',
    DELETE: 'workspace:delete',
    SWITCH: 'workspace:switch',
  },
  APP: {
    LIST: 'app:list',
    CREATE: 'app:create',
    UPDATE: 'app:update',
    DELETE: 'app:delete',
    HIBERNATE: 'app:hibernate',
    RESUME: 'app:resume',
  },
};
```

#### Security Considerations:

- Use `contextBridge` in preload scripts (never expose full Node.js)
- Validate all IPC inputs in main process
- Sanitize URLs before loading in BrowserViews
- Enable `contextIsolation` and disable `nodeIntegration`

---

### **1.3 Data Layer with electron-store**

#### Data Schema:

**Profile Data** (`profiles.json` - root config)

```typescript
interface ProfileMetadata {
  id: string;
  name: string;
  createdAt: string;
  lastAccessed: string;
  dataPath: string;
}

interface ProfilesConfig {
  profiles: ProfileMetadata[];
  defaultProfile: string;
  lastActiveProfile: string;
}
```

**Workspace Data** (per-profile: `profile-{name}/workspaces.json`)

```typescript
interface Workspace {
  id: string;
  name: string;
  icon?: string;
  apps: string[]; // Array of app IDs
  layout: {
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
    dockSize: number;
  };
  theme?: {
    mode: 'light' | 'dark' | 'system';
    accentColor: string;
  };
  sessionMode: 'isolated' | 'shared';
  hibernation: {
    enabled: boolean;
    idleTimeMinutes: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface WorkspacesConfig {
  workspaces: Workspace[];
  activeWorkspaceId: string;
}
```

**App Data** (per-profile: `profile-{name}/apps.json`)

```typescript
interface App {
  id: string;
  name: string;
  url: string;
  icon?: string; // Path or URL to icon
  customCSS?: string;
  customJS?: string;
  workspaceId: string;
  instances: AppInstance[];
  createdAt: string;
  updatedAt: string;
}

interface AppInstance {
  id: string;
  appId: string;
  name?: string; // Optional label for instance
  partitionId: string;
  hibernated: boolean;
  lastActive: string;
}

interface AppsConfig {
  apps: App[];
}
```

**Settings Data** (per-profile: `profile-{name}/settings.json`)

```typescript
interface Settings {
  general: {
    launchAtStartup: boolean;
    minimizeToTray: boolean;
    closeToTray: boolean;
  };
  notifications: {
    enabled: boolean;
    doNotDisturb: boolean;
    soundEnabled: boolean;
  };
  performance: {
    hardwareAcceleration: boolean;
    autoHibernation: boolean;
    defaultIdleTimeMinutes: number;
  };
  privacy: {
    clearDataOnExit: boolean;
    blockThirdPartyCookies: boolean;
  };
  shortcuts: {
    [action: string]: string; // e.g., "switchWorkspace": "Cmd+Tab"
  };
  advanced: {
    devToolsEnabled: boolean;
    debugMode: boolean;
  };
}
```

#### Implementation:

```typescript
// src/main/data/store-manager.ts
import Store from 'electron-store';
import path from 'path';

class StoreManager {
  private stores: Map<string, Store> = new Map();

  getProfileStore(profileName: string): Store<WorkspacesConfig | AppsConfig | Settings> {
    const key = `profile-${profileName}`;
    if (!this.stores.has(key)) {
      const store = new Store({
        name: profileName,
        cwd: path.join(app.getPath('userData'), 'profiles', profileName),
      });
      this.stores.set(key, store);
    }
    return this.stores.get(key)!;
  }

  getRootStore(): Store<ProfilesConfig> {
    if (!this.stores.has('root')) {
      const store = new Store({
        name: 'profiles',
      });
      this.stores.set('root', store);
    }
    return this.stores.get('root')!;
  }
}
```

---

### **1.4 Preload Scripts for IPC Security**

**`src/preload/index.ts`**

```typescript
import { contextBridge, ipcRenderer } from 'electron';

// Expose safe API to renderer
contextBridge.exposeInMainWorld('dockyard', {
  // Profile APIs
  profiles: {
    list: () => ipcRenderer.invoke('profile:list'),
    create: (name: string) => ipcRenderer.invoke('profile:create', name),
    delete: (id: string) => ipcRenderer.invoke('profile:delete', id),
    switch: (id: string) => ipcRenderer.invoke('profile:switch', id),
  },

  // Workspace APIs
  workspaces: {
    list: () => ipcRenderer.invoke('workspace:list'),
    create: (data: Partial<Workspace>) => ipcRenderer.invoke('workspace:create', data),
    update: (id: string, data: Partial<Workspace>) =>
      ipcRenderer.invoke('workspace:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('workspace:delete', id),
    switch: (id: string) => ipcRenderer.invoke('workspace:switch', id),
  },

  // App APIs
  apps: {
    list: () => ipcRenderer.invoke('app:list'),
    create: (data: Partial<App>) => ipcRenderer.invoke('app:create', data),
    update: (id: string, data: Partial<App>) => ipcRenderer.invoke('app:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('app:delete', id),
    hibernate: (id: string) => ipcRenderer.invoke('app:hibernate', id),
    resume: (id: string) => ipcRenderer.invoke('app:resume', id),
  },

  // Settings APIs
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (data: Partial<Settings>) => ipcRenderer.invoke('settings:update', data),
  },

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['workspace-changed', 'app-updated', 'notification'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
});
```

**Type definitions for renderer** (`src/shared/types/preload.d.ts`)

```typescript
export interface DockyardAPI {
  profiles: {
    list: () => Promise<ProfileMetadata[]>;
    create: (name: string) => Promise<ProfileMetadata>;
    delete: (id: string) => Promise<void>;
    switch: (id: string) => Promise<void>;
  };
  workspaces: {
    /* ... */
  };
  apps: {
    /* ... */
  };
  settings: {
    /* ... */
  };
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    dockyard: DockyardAPI;
  }
}
```

---

### **1.5 React Renderer Setup**

#### State Management Strategy:

**Option 1: Zustand (Recommended)**

- Lightweight, minimal boilerplate
- Good TypeScript support
- Easy to test and debug

**Option 2: React Context**

- No external dependencies
- Good for smaller state trees
- More boilerplate

**Decision**: Start with **Zustand** for better DX and performance.

#### Store Structure:

```typescript
// src/renderer/src/store/workspaces.ts
import create from 'zustand';

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadWorkspaces: () => Promise<void>;
  setActiveWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: Partial<Workspace>) => Promise<void>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  loading: false,
  error: null,

  loadWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const workspaces = await window.dockyard.workspaces.list();
      set({ workspaces, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setActiveWorkspace: async (id: string) => {
    await window.dockyard.workspaces.switch(id);
    set({ activeWorkspaceId: id });
  },

  // ... other actions
}));
```

#### Component Structure:

```typescript
// src/renderer/src/App.tsx
import { useEffect } from 'react';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { AppDock } from './components/AppDock';
import { Workspace } from './components/Workspace';
import { SettingsModal } from './components/Settings';

export function App() {
  const { loadWorkspaces, activeWorkspaceId } = useWorkspaceStore();
  const { loadApps } = useAppStore();

  useEffect(() => {
    loadWorkspaces();
    loadApps();
  }, []);

  return (
    <div className="app-container">
      <AppDock />
      <Workspace workspaceId={activeWorkspaceId} />
      <SettingsModal />
    </div>
  );
}
```

---

## 🔧 **Phase 2: Workspace & App Management**

### **2.1 BrowserView Implementation**

#### Why BrowserView over WebView?

- Better performance
- Modern Electron API
- More control over sessions and partitions
- Easier to manage multiple instances

#### Implementation Pattern:

```typescript
// src/main/app-view-manager.ts
import { BrowserView, BrowserWindow } from 'electron';

class AppViewManager {
  private views: Map<string, BrowserView> = new Map();

  createAppView(appId: string, url: string, partition: string): BrowserView {
    const view = new BrowserView({
      webPreferences: {
        partition,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
    });

    view.webContents.loadURL(url);
    this.views.set(appId, view);
    return view;
  }

  showAppView(appId: string, window: BrowserWindow): void {
    const view = this.views.get(appId);
    if (view) {
      window.addBrowserView(view);
      // Position view based on dock position
      this.positionView(view, window);
    }
  }

  hideAppView(appId: string, window: BrowserWindow): void {
    const view = this.views.get(appId);
    if (view) {
      window.removeBrowserView(view);
    }
  }

  private positionView(view: BrowserView, window: BrowserWindow): void {
    const bounds = window.getBounds();
    // Calculate position based on dock settings
    view.setBounds({
      x: 60, // Dock width
      y: 0,
      width: bounds.width - 60,
      height: bounds.height,
    });
  }
}
```

### **2.2 Session Partition Strategy**

#### Partition Naming Conventions:

1. **Per-app isolated**: `persist:app-{appId}-{instanceId}`
   - Each app instance gets its own session
   - Login states are completely isolated
   - Most secure, best for multiple accounts

2. **Workspace-shared**: `persist:workspace-{workspaceId}`
   - All apps in a workspace share the same session
   - Useful for connected workflows (e.g., Google Workspace)
   - Cookies and local storage are shared

3. **Global-shared**: `persist:global`
   - All apps share one session (not recommended for most users)
   - Simplest but least flexible

#### Implementation:

```typescript
// src/main/partition-manager.ts
export class PartitionManager {
  static getPartitionForApp(app: App, instance: AppInstance, workspace: Workspace): string {
    if (workspace.sessionMode === 'shared') {
      return `persist:workspace-${workspace.id}`;
    }
    return `persist:app-${app.id}-${instance.id}`;
  }

  static clearPartitionData(partitionId: string): Promise<void> {
    const session = require('electron').session.fromPartition(partitionId);
    return session.clearStorageData();
  }
}
```

---

## 🔧 **Phase 3: Auto-Hibernation & Performance**

### **3.1 Hibernation System**

#### Idle Detection Strategy:

```typescript
// src/main/hibernation-manager.ts
export class HibernationManager {
  private idleTimers: Map<string, NodeJS.Timeout> = new Map();
  private idleThresholds: Map<string, number> = new Map();

  startMonitoring(appId: string, idleMinutes: number): void {
    this.stopMonitoring(appId);
    this.idleThresholds.set(appId, idleMinutes);

    const checkIdle = () => {
      const view = this.viewManager.getView(appId);
      if (view && !view.webContents.isLoading()) {
        const idleTime = this.getIdleTime(appId);
        if (idleTime > idleMinutes * 60 * 1000) {
          this.hibernateApp(appId);
        }
      }
    };

    const timer = setInterval(checkIdle, 60000); // Check every minute
    this.idleTimers.set(appId, timer);
  }

  stopMonitoring(appId: string): void {
    const timer = this.idleTimers.get(appId);
    if (timer) {
      clearInterval(timer);
      this.idleTimers.delete(appId);
    }
  }

  hibernateApp(appId: string): void {
    const view = this.viewManager.getView(appId);
    if (view) {
      // Method 1: Hide the view (lighter)
      view.webContents.setBackgroundThrottling(true);

      // Method 2: Destroy and recreate on resume (heavier)
      // this.viewManager.destroyView(appId);

      this.emit('app-hibernated', appId);
    }
  }

  resumeApp(appId: string): void {
    const view = this.viewManager.getView(appId);
    if (view) {
      view.webContents.setBackgroundThrottling(false);
      this.emit('app-resumed', appId);
    }
  }
}
```

### **3.2 Performance Monitoring**

```typescript
// src/main/performance-monitor.ts
export class PerformanceMonitor {
  getAppMemoryUsage(appId: string): number {
    const view = this.viewManager.getView(appId);
    if (view) {
      const info = view.webContents.getProcessMemoryInfo();
      return info.residentSet; // Memory in KB
    }
    return 0;
  }

  getCPUUsage(appId: string): Promise<number> {
    const view = this.viewManager.getView(appId);
    if (view) {
      return view.webContents.getProcessCPUUsage().then((info) => {
        return info.percentCPUUsage;
      });
    }
    return Promise.resolve(0);
  }

  async getPerformanceStats(): Promise<PerformanceStats> {
    const apps = this.appManager.getAllApps();
    const stats = await Promise.all(
      apps.map(async (app) => ({
        appId: app.id,
        memory: this.getAppMemoryUsage(app.id),
        cpu: await this.getCPUUsage(app.id),
      }))
    );
    return { apps: stats, timestamp: Date.now() };
  }
}
```

---

## 🔧 **Phase 4: Notifications & Layout**

### **4.1 Native Notifications**

```typescript
// src/main/notification-manager.ts
import { Notification } from 'electron';

export class NotificationManager {
  private doNotDisturb = false;

  setDoNotDisturb(enabled: boolean): void {
    this.doNotDisturb = enabled;
  }

  showNotification(appId: string, title: string, body: string): void {
    if (this.doNotDisturb) return;

    const notification = new Notification({
      title,
      body,
      icon: this.getAppIcon(appId),
    });

    notification.on('click', () => {
      this.appManager.focusApp(appId);
    });

    notification.show();
  }

  updateBadgeCount(appId: string, count: number): void {
    // Update app icon badge in dock
    this.emit('badge-updated', { appId, count });
  }
}
```

**Webview Integration:**

```typescript
// In renderer process
view.webContents.on('notification', (event, title, options) => {
  window.dockyard.notifications.show(appId, title, options.body);
});
```

### **4.2 Multi-App Layout System**

```typescript
// src/renderer/src/components/Workspace/LayoutManager.tsx
interface LayoutConfig {
  type: 'single' | 'split-horizontal' | 'split-vertical' | 'grid';
  apps: Array<{
    appId: string;
    flex?: number;  // For split layouts
    position?: { row: number; col: number };  // For grid
  }>;
}

export function LayoutManager({ layout, apps }: Props) {
  const renderLayout = () => {
    switch (layout.type) {
      case 'single':
        return <AppView appId={layout.apps[0]?.appId} />;

      case 'split-horizontal':
        return (
          <div className="flex flex-row h-full">
            {layout.apps.map((app) => (
              <AppView
                key={app.appId}
                appId={app.appId}
                style={{ flex: app.flex || 1 }}
              />
            ))}
          </div>
        );

      // ... other layout types
    }
  };

  return <div className="layout-container">{renderLayout()}</div>;
}
```

---

## 🧪 **Testing Strategy**

### **Unit Tests** (Jest)

- Data models and utilities
- State management logic
- IPC message handlers (mocked)

### **Integration Tests** (Spectron/Playwright)

- IPC communication flows
- Data persistence
- Window management

### **E2E Tests** (Playwright)

- Complete user workflows
- Profile creation and switching
- App management
- Workspace operations

### **Test Structure:**

```
tests/
├─ unit/
│  ├─ shared/
│  │  ├─ utils.test.ts
│  │  └─ partition-manager.test.ts
│  └─ renderer/
│     └─ stores/
│        └─ workspace.test.ts
├─ integration/
│  ├─ ipc-communication.test.ts
│  ├─ profile-management.test.ts
│  └─ app-lifecycle.test.ts
└─ e2e/
   ├─ workspace-creation.test.ts
   ├─ app-management.test.ts
   └─ hibernation.test.ts
```

---

## 🔒 **Security Considerations**

### **1. Electron Security Checklist**

- ✅ Enable `contextIsolation`
- ✅ Disable `nodeIntegration`
- ✅ Enable `sandbox`
- ✅ Use `contextBridge` for IPC
- ✅ Validate all IPC inputs
- ✅ Sanitize URLs before loading
- ✅ Set proper Content Security Policy
- ✅ Keep Electron updated

### **2. Session Security**

- Each partition is isolated by default
- Clear sensitive data on app exit (optional)
- Provide UI to clear cache/cookies per app
- Consider enabling `webSecurity` for all views

### **3. Data Security**

- All data stored locally, no network calls
- Consider encrypting sensitive profile data
- Implement secure backup/export with user password

---

## 🚀 **Deployment & Distribution**

### **Build Configuration**

**Electron Forge Makers:**

```javascript
// forge.config.js
{
  makers: [
    {
      name: '@electron-forge/maker-squirrel', // Windows
      config: { name: 'dockyard-electron' },
    },
    {
      name: '@electron-forge/maker-zip', // macOS
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb', // Linux (Debian)
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm', // Linux (Red Hat)
      config: {},
    },
  ];
}
```

### **Auto-Update Setup**

- Use `electron-updater` or Electron Forge's publisher
- GitHub Releases for distribution
- Update checks on app launch (optional, user-controlled)

### **Code Signing**

- macOS: Apple Developer certificate
- Windows: EV Code Signing certificate
- Linux: Not required

---

## 📊 **Performance Targets**

| Metric                         | Target      | Measurement                     |
| ------------------------------ | ----------- | ------------------------------- |
| App launch time                | < 3 seconds | Time to show first window       |
| Memory usage (idle, 5 apps)    | < 500 MB    | Activity Monitor / Task Manager |
| Memory usage (active, 10 apps) | < 1.5 GB    | Activity Monitor / Task Manager |
| App switch latency             | < 100ms     | Perceived responsiveness        |
| Hibernation resume time        | < 500ms     | Time to restore suspended app   |

---

## 🛠️ **Development Tools & Workflow**

### **Code Quality Tools**

- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### **Development Workflow**

1. Fork and clone the repository
2. Create feature branch: `feature/your-feature-name`
3. Make changes and test locally
4. Run linters and tests
5. Commit with conventional commits
6. Push and create Pull Request

### **Conventional Commits**

```
feat: add workspace template feature
fix: resolve memory leak in app hibernation
docs: update API documentation
chore: bump electron version
test: add tests for profile manager
```

---

## 🎯 **Success Criteria for Each Phase**

### **Phase 1 Success Criteria:**

- ✅ App launches and shows main window
- ✅ Can create and switch profiles
- ✅ Basic settings are persisted
- ✅ No critical bugs in core functionality
- ✅ Code passes all linters and tests

### **Phase 2 Success Criteria:**

- ✅ Can create and manage workspaces
- ✅ Can add custom apps by URL
- ✅ Apps load correctly in BrowserViews
- ✅ Session isolation works correctly
- ✅ UI is responsive and polished

### **Phase 3 Success Criteria:**

- ✅ Auto-hibernation works reliably
- ✅ Memory usage stays within targets
- ✅ Performance monitoring is accurate
- ✅ No crashes or data loss

---

## 📚 **Resources & References**

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Security Best Practices](https://www.electronjs.org/docs/tutorial/security)
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [electron-store](https://github.com/sindresorhus/electron-store)

---

**Last Updated**: November 2024
**Next Review**: After Phase 1 completion
