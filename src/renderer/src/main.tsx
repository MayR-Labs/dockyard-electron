/**
 * Main Entry Point
 * Initializes the React application with error boundaries
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import './styles/index.css';
import type { App as AppType, AppInstance } from '../../shared/types/app';
import type { Workspace } from '../../shared/types/workspace';
import type { Settings } from '../../shared/types/settings';
import type { DockyardAPI, DockyardEventChannel, DockyardEventListener } from '../../shared/types/preload';

// Check if we're running in Electron
type ElectronProcess = NodeJS.Process & { type?: string };

interface MockStorage {
  workspaces: Workspace[];
  apps: AppType[];
  settings: Settings;
  activeWorkspaceId: string | null;
}

interface MockViewInfo {
  appId: string;
  instanceId: string;
  partitionId: string;
  lastActive: number;
  isActive: boolean;
  url: string;
}

const isElectron =
  typeof window !== 'undefined' &&
  typeof window.process !== 'undefined' &&
  ((window.process as ElectronProcess)?.type === 'renderer');

console.log('Environment check:', {
  isElectron,
  hasDockyardAPI: typeof window !== 'undefined' && !!window.dockyard,
  hasBrowserViewAPI: typeof window !== 'undefined' && !!window.dockyard?.browserView,
});

// Mock API for development in browser (when not in Electron)
if (typeof window !== 'undefined' && !window.dockyard) {
  console.log('Initializing mock Dockyard API for browser development');
  const mockStorage: MockStorage = {
    workspaces: [],
    apps: [],
    settings: {
      general: {
        launchAtStartup: false,
        minimizeToTray: false,
        closeToTray: false,
      },
      notifications: {
        enabled: true,
        doNotDisturb: false,
        soundEnabled: true,
      },
      performance: {
        hardwareAcceleration: true,
        autoHibernation: true,
        defaultIdleTimeMinutes: 15,
      },
      privacy: {
        clearDataOnExit: false,
        blockThirdPartyCookies: false,
      },
      shortcuts: {},
      advanced: {
        devToolsEnabled: true,
        debugMode: true,
      },
    },
    activeWorkspaceId: null,
  };

  const mockViewState: MockViewInfo[] = [];

  const ensureMockView = (appId: string, instanceId: string): MockViewInfo => {
    const existing = mockViewState.find(
      (view) => view.appId === appId && view.instanceId === instanceId
    );
    if (existing) {
      existing.lastActive = Date.now();
      return existing;
    }

    const app = mockStorage.apps.find((entry) => entry.id === appId);
    const instancePartition =
      app?.instances.find((instanceEntry) => instanceEntry.id === instanceId)?.partitionId ??
      `persist:mock-${appId}-${instanceId}`;

    const newView: MockViewInfo = {
      appId,
      instanceId,
      partitionId: instancePartition,
      lastActive: Date.now(),
      isActive: false,
      url: app?.url ?? '',
    };

    mockViewState.push(newView);
    return newView;
  };

  const createMockInstance = (appId: string, name?: string): AppInstance => ({
    id: `instance-${appId}-${Math.random().toString(36).slice(2, 9)}`,
    appId,
    name,
    partitionId: `persist:mock-${appId}-${Math.random().toString(36).slice(2, 9)}`,
    hibernated: false,
    lastActive: new Date().toISOString(),
  });

  const eventListeners = new Map<DockyardEventChannel, DockyardEventListener[]>();

  type NotificationOptions = Parameters<DockyardAPI['notifications']['show']>[0];

  const mockDockyardApi: DockyardAPI = {
    profiles: {
      list: async () => [],
      create: async (name: string) => ({
        id: name,
        name,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        dataPath: '',
      }),
      delete: async () => undefined,
      switch: async () => undefined,
      getCurrent: async () => null,
    },
    workspaces: {
      list: async () => mockStorage.workspaces,
      create: async (data: Partial<Workspace>) => {
        const now = new Date().toISOString();
        const workspaceId = data.id ?? `ws-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const dockPosition = data.layout?.dockPosition ?? 'left';
        const dockSize = data.layout?.dockSize ?? 64;

        const newWorkspace: Workspace = {
          id: workspaceId,
          name: data.name ?? 'New Workspace',
          icon: data.icon,
          apps: data.apps ?? [],
          layout: {
            dockPosition,
            dockSize,
            splitLayout: data.layout?.splitLayout,
          },
          theme: data.theme,
          sessionMode: data.sessionMode ?? 'isolated',
          hibernation:
            data.hibernation ??
            {
              enabled: true,
              idleTimeMinutes: 15,
            },
          createdAt: now,
          updatedAt: now,
        };

        mockStorage.workspaces.push(newWorkspace);
        if (!mockStorage.activeWorkspaceId) {
          mockStorage.activeWorkspaceId = newWorkspace.id;
        }
        return newWorkspace;
      },
      update: async (id: string, data: Partial<Workspace>) => {
        const workspace = mockStorage.workspaces.find((entry) => entry.id === id);
        if (!workspace) {
          throw new Error('Workspace not found');
        }

        Object.assign(workspace, data, { updatedAt: new Date().toISOString() });
        if (data.layout) {
          workspace.layout = { ...workspace.layout, ...data.layout };
        }
        return workspace;
      },
      delete: async (id: string) => {
        mockStorage.workspaces = mockStorage.workspaces.filter((workspace) => workspace.id !== id);
        if (mockStorage.activeWorkspaceId === id) {
          mockStorage.activeWorkspaceId = mockStorage.workspaces[0]?.id ?? null;
        }
      },
      switch: async (id: string) => {
        mockStorage.activeWorkspaceId = id;
      },
      getActive: async () =>
        mockStorage.workspaces.find((workspace) => workspace.id === mockStorage.activeWorkspaceId) ??
        null,
    },
    apps: {
      list: async () => mockStorage.apps,
      create: async (data: Partial<AppType>) => {
        const now = new Date().toISOString();
        const appId = data.id ?? `app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const instances: AppInstance[] = (data.instances && data.instances.length > 0
          ? data.instances
          : [createMockInstance(appId, data.name)]
        ).map((instance) => ({
          ...instance,
          appId,
          partitionId: instance.partitionId ?? `persist:mock-${appId}-${instance.id}`,
        }));

        const newApp: AppType = {
          id: appId,
          name: data.name ?? 'New App',
          url: data.url ?? '',
          icon: data.icon,
          customCSS: data.customCSS,
          customJS: data.customJS,
          workspaceId: data.workspaceId ?? '',
          instances,
          notifications: data.notifications,
          display: data.display,
          createdAt: now,
          updatedAt: now,
        };
        mockStorage.apps.push(newApp);
        return newApp;
      },
      update: async (id: string, data: Partial<AppType>) => {
        const app = mockStorage.apps.find((entry) => entry.id === id);
        if (!app) {
          throw new Error('App not found');
        }

        Object.assign(app, data, { updatedAt: new Date().toISOString() });
        if (data.instances) {
          app.instances = data.instances.map((instance) => ({
            ...instance,
            appId: id,
            partitionId: instance.partitionId ?? `persist:mock-${id}-${instance.id}`,
          }));
        }
        return app;
      },
      delete: async (id: string) => {
        mockStorage.apps = mockStorage.apps.filter((app) => app.id !== id);
      },
      hibernate: async (appId: string, instanceId: string) => {
        const app = mockStorage.apps.find((entry) => entry.id === appId);
        const instance = app?.instances.find((entry) => entry.id === instanceId);
        if (instance) {
          instance.hibernated = true;
        }
      },
      resume: async (appId: string, instanceId: string) => {
        const app = mockStorage.apps.find((entry) => entry.id === appId);
        const instance = app?.instances.find((entry) => entry.id === instanceId);
        if (instance) {
          instance.hibernated = false;
          instance.lastActive = new Date().toISOString();
        }
      },
      createInstance: async (
        appId: string,
        data: { name?: string; sessionMode?: 'isolated' | 'shared' }
      ) => {
        const app = mockStorage.apps.find((entry) => entry.id === appId);
        if (!app) {
          throw new Error('App not found');
        }

        const instance = createMockInstance(appId, data.name);
        if (data.sessionMode === 'shared') {
          instance.partitionId = `persist:workspace-${app.workspaceId}`;
        }
        app.instances.push(instance);
        app.updatedAt = new Date().toISOString();
        return instance;
      },
    },
    browserView: {
      show: async (appId: string, instanceId: string) => {
        const view = ensureMockView(appId, instanceId);
        mockViewState.forEach((entry) => {
          entry.isActive = entry.appId === appId && entry.instanceId === instanceId;
        });
        view.lastActive = Date.now();
      },
      hide: async () => {
        mockViewState.forEach((entry) => {
          entry.isActive = false;
        });
      },
      updateBounds: async (_appId, _instanceId, _bounds) => undefined,
      navigate: async (appId: string, instanceId: string, url: string) => {
        const view = ensureMockView(appId, instanceId);
        view.url = url;
      },
      goBack: async (_appId, _instanceId) => undefined,
      goForward: async (_appId, _instanceId) => undefined,
      reload: async (_appId, _instanceId) => undefined,
      getState: async (appId: string, instanceId: string) => {
        const view = ensureMockView(appId, instanceId);
        return {
          canGoBack: false,
          canGoForward: false,
          isLoading: false,
          url: view.url,
        };
      },
      setZoom: async (_appId, _instanceId, _zoomFactor) => undefined,
      openDevTools: async (_appId, _instanceId) => undefined,
      closeDevTools: async (_appId, _instanceId) => undefined,
      clearSession: async (_partitionId) => undefined,
      getMemory: async (appId, instanceId) => {
        ensureMockView(appId, instanceId);
        return { workingSetSize: 0, privateBytes: 0 };
      },
      getCPU: async (appId, instanceId) => {
        ensureMockView(appId, instanceId);
        return 0;
      },
      getAll: async () =>
        mockViewState.map(({ appId, instanceId, partitionId, lastActive, isActive }) => ({
          appId,
          instanceId,
          partitionId,
          lastActive,
          isActive,
        })),
    },
    webview: {
      register: async (_webContentsId, appId: string, instanceId: string, partitionId: string) => {
        const view = ensureMockView(appId, instanceId);
        view.partitionId = partitionId;
      },
      unregister: async (appId: string, instanceId: string) => {
        const index = mockViewState.findIndex(
          (view) => view.appId === appId && view.instanceId === instanceId
        );
        if (index >= 0) {
          mockViewState.splice(index, 1);
        }
      },
      navigate: async (appId: string, instanceId: string, url: string) => {
        const view = ensureMockView(appId, instanceId);
        view.url = url;
      },
      goBack: async (_appId, _instanceId) => undefined,
      goForward: async (_appId, _instanceId) => undefined,
      reload: async (_appId, _instanceId) => undefined,
      getState: async (appId: string, instanceId: string) => {
        const view = ensureMockView(appId, instanceId);
        return {
          canGoBack: false,
          canGoForward: false,
          isLoading: false,
          url: view.url,
        };
      },
      setZoom: async (_appId, _instanceId, _zoomFactor) => undefined,
      openDevTools: async (_appId, _instanceId) => undefined,
      closeDevTools: async (_appId, _instanceId) => undefined,
      clearSession: async (_partitionId) => undefined,
      getMemory: async (appId, instanceId) => {
        ensureMockView(appId, instanceId);
        return { workingSetSize: 0, privateBytes: 0 };
      },
      getCPU: async (appId, instanceId) => {
        ensureMockView(appId, instanceId);
        return 0;
      },
      getAll: async () =>
        mockViewState.map(({ appId, instanceId, partitionId, lastActive, isActive }) => ({
          appId,
          instanceId,
          partitionId,
          lastActive,
          isActive,
        })),
      updateActive: async (appId: string, instanceId: string) => {
        mockViewState.forEach((view) => {
          view.isActive = view.appId === appId && view.instanceId === instanceId;
        });
        ensureMockView(appId, instanceId);
      },
    },
    settings: {
      get: async () => mockStorage.settings,
      update: async (data: Partial<Settings>) => {
        mockStorage.settings = { ...mockStorage.settings, ...data };
        return mockStorage.settings;
      },
    },
    notifications: {
      show: async (options: NotificationOptions) => {
        console.log('Mock: notification.show', options);
      },
      updateBadge: async (appId: string, _count: number) => {
        const app = mockStorage.apps.find((entry) => entry.id === appId);
        if (!app) {
          throw new Error('App not found');
        }
        return app;
      },
    },
    on: (channel: DockyardEventChannel, callback: DockyardEventListener) => {
      const listeners = eventListeners.get(channel) ?? [];
      listeners.push(callback);
      eventListeners.set(channel, listeners);
    },
    off: (channel: DockyardEventChannel, callback: DockyardEventListener) => {
      const listeners = eventListeners.get(channel);
      if (!listeners) {
        return;
      }
      eventListeners.set(
        channel,
        listeners.filter((listener) => listener !== callback)
      );
    },
  };

  window.dockyard = mockDockyardApi;
  console.log('🔧 Mock Dockyard API initialized for browser development');
  console.warn('⚠️  Running in browser mode - BrowserView features will be mocked');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
