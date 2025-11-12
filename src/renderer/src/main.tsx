/**
 * Main Entry Point
 * Initializes the React application with error boundaries
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import './styles/index.css';

// Check if we're running in Electron
const isElectron =
  typeof window !== 'undefined' &&
  typeof window.process !== 'undefined' &&
  (window.process as any).type === 'renderer';

console.log('Environment check:', {
  isElectron,
  hasDockyardAPI: typeof window !== 'undefined' && !!window.dockyard,
  hasBrowserViewAPI: typeof window !== 'undefined' && !!window.dockyard?.browserView,
});

// Mock API for development in browser (when not in Electron)
if (typeof window !== 'undefined' && !window.dockyard) {
  console.log('Initializing mock Dockyard API for browser development');
  const mockStorage = {
    workspaces: [] as any[],
    apps: [] as any[],
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
    activeWorkspaceId: null as string | null,
  };

  (window as any).dockyard = {
    profiles: {
      list: async () => [],
      create: async (name: string) => ({
        id: name,
        name,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        dataPath: '',
      }),
      delete: async () => {},
      switch: async () => {},
      getCurrent: async () => null,
    },
    workspaces: {
      list: async () => mockStorage.workspaces,
      create: async (data: any) => {
        const newWorkspace = {
          id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: data.name || 'New Workspace',
          icon: data.icon,
          apps: data.apps || [],
          layout: data.layout || { dockPosition: 'left', dockSize: 64 },
          theme: data.theme,
          sessionMode: data.sessionMode || 'isolated',
          hibernation: data.hibernation || {
            enabled: true,
            idleTimeMinutes: 15,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockStorage.workspaces.push(newWorkspace);
        if (mockStorage.workspaces.length === 1) {
          mockStorage.activeWorkspaceId = newWorkspace.id;
        }
        return newWorkspace;
      },
      update: async (id: string, data: any) => {
        const idx = mockStorage.workspaces.findIndex((w) => w.id === id);
        if (idx !== -1) {
          mockStorage.workspaces[idx] = {
            ...mockStorage.workspaces[idx],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return mockStorage.workspaces[idx];
        }
        throw new Error('Workspace not found');
      },
      delete: async (id: string) => {
        mockStorage.workspaces = mockStorage.workspaces.filter((w) => w.id !== id);
      },
      switch: async (id: string) => {
        mockStorage.activeWorkspaceId = id;
      },
      getActive: async () => {
        return mockStorage.workspaces.find((w) => w.id === mockStorage.activeWorkspaceId) || null;
      },
    },
    apps: {
      list: async () => mockStorage.apps,
      create: async (data: any) => {
        const newApp = {
          id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: data.name || 'New App',
          url: data.url || '',
          icon: data.icon,
          customCSS: data.customCSS,
          customJS: data.customJS,
          workspaceId: data.workspaceId || '',
          instances: data.instances || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockStorage.apps.push(newApp);
        return newApp;
      },
      update: async (id: string, data: any) => {
        const idx = mockStorage.apps.findIndex((a) => a.id === id);
        if (idx !== -1) {
          mockStorage.apps[idx] = {
            ...mockStorage.apps[idx],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return mockStorage.apps[idx];
        }
        throw new Error('App not found');
      },
      delete: async (id: string) => {
        mockStorage.apps = mockStorage.apps.filter((a) => a.id !== id);
      },
      hibernate: async () => {},
      resume: async () => {},
    },
    browserView: {
      show: async () => {
        console.log('Mock: browserView.show');
      },
      hide: async () => {
        console.log('Mock: browserView.hide');
      },
      updateBounds: async () => {
        console.log('Mock: browserView.updateBounds');
      },
      navigate: async () => {
        console.log('Mock: browserView.navigate');
      },
      goBack: async () => {
        console.log('Mock: browserView.goBack');
      },
      goForward: async () => {
        console.log('Mock: browserView.goForward');
      },
      reload: async () => {
        console.log('Mock: browserView.reload');
      },
      getState: async () => ({
        canGoBack: false,
        canGoForward: false,
        isLoading: false,
        url: '',
      }),
      setZoom: async () => {
        console.log('Mock: browserView.setZoom');
      },
      openDevTools: async () => {
        console.log('Mock: browserView.openDevTools');
      },
      closeDevTools: async () => {
        console.log('Mock: browserView.closeDevTools');
      },
      clearSession: async () => {
        console.log('Mock: browserView.clearSession');
      },
      getMemory: async () => ({ workingSetSize: 0, privateBytes: 0 }),
      getCPU: async () => 0,
      getAll: async () => [],
    },
    notifications: {
      show: async () => {
        console.log('Mock: notification.show');
      },
      updateBadge: async (appId: string) => {
        const app = mockStorage.apps.find((a) => a.id === appId);
        if (!app) throw new Error('App not found');
        return app;
      },
    },
    settings: {
      get: async () => mockStorage.settings,
      update: async (data: any) => {
        mockStorage.settings = { ...mockStorage.settings, ...data };
        return mockStorage.settings;
      },
    },
    on: () => {},
    off: () => {},
  };
  console.log('🔧 Mock Dockyard API initialized for browser development');
  console.warn('⚠️  Running in browser mode - BrowserView features will be mocked');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
