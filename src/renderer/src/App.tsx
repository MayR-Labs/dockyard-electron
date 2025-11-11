/**
 * Main App Component
 * Orchestrates the application layout and state
 * Refactored to follow SOLID principles with proper separation of concerns
 */

import { useEffect, useState } from 'react';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { WindowChrome } from './components/Layout/WindowChrome';
import { Sidebar } from './components/Layout/Sidebar';
import { Dock } from './components/Layout/Dock';
import { WorkspaceCanvas } from './components/Layout/WorkspaceCanvas';
import { StatusBar } from './components/Layout/StatusBar';
import { AddAppModal } from './components/Modals/AddAppModal';
import { EditAppModal } from './components/Modals/EditAppModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';
import { CreateInstanceModal } from './components/Modals/CreateInstanceModal';
import { AppContextMenu } from './components/ContextMenu/AppContextMenu';
import { App as AppType, AppInstance } from '../../shared/types/app';

function App() {
  // Store hooks
  const { loadWorkspaces, workspaces, activeWorkspaceId, setActiveWorkspace, createWorkspace } = useWorkspaceStore();
  const { loadApps, apps, createApp, updateApp, deleteApp, hibernateApp } = useAppStore();
  const { loadSettings, settings, updateSettings } = useSettingsStore();
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  
  // Modal state
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [isCreateInstanceModalOpen, setIsCreateInstanceModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    appId: string;
    appName: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    // Load all data on startup
    const loadData = async () => {
      try {
        await Promise.all([
          loadWorkspaces(),
          loadApps(),
          loadSettings(),
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadWorkspaces, loadApps, loadSettings]);

  useEffect(() => {
    // Set first workspace as active if none is active
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspace(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setActiveWorkspace]);

  // Handlers
  const handleToggleDnd = () => {
    if (settings) {
      updateSettings({
        notifications: {
          ...settings.notifications,
          doNotDisturb: !settings.notifications.doNotDisturb,
        },
      });
    }
  };

  // Keyboard shortcuts using custom hook
  useKeyboardShortcuts([
    // Quick Launcher: Cmd/Ctrl+Space
    {
      key: 'Space',
      modifier: 'ctrlOrMeta',
      action: () => {
        // TODO: Implement quick launcher
        console.log('Quick launcher shortcut triggered');
      },
      description: 'Open quick launcher',
    },
    // Toggle Sidebar: Cmd/Ctrl+B
    {
      key: 'KeyB',
      modifier: 'ctrlOrMeta',
      action: () => setIsSidebarOpen(prev => !prev),
      description: 'Toggle sidebar',
    },
    // Toggle DND: Cmd/Ctrl+Shift+D
    {
      key: 'KeyD',
      modifier: 'ctrlOrMeta',
      shiftKey: true,
      action: handleToggleDnd,
      description: 'Toggle Do Not Disturb',
    },
    // Workspace switching: Cmd/Ctrl+1-9
    ...workspaces.slice(0, 9).map((workspace, index) => ({
      key: `Digit${index + 1}`,
      modifier: 'ctrlOrMeta' as const,
      shiftKey: false,
      action: () => setActiveWorkspace(workspace.id),
      description: `Switch to workspace ${index + 1}`,
    })),
  ]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const workspaceApps = apps.filter(app => app.workspaceId === activeWorkspaceId);

  const handleCreateWorkspace = async (data: {
    name: string;
    sessionMode: 'isolated' | 'shared';
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
  }) => {
    await createWorkspace({
      name: data.name,
      sessionMode: data.sessionMode,
      layout: {
        dockPosition: data.dockPosition,
        dockSize: 64,
      },
    });
  };

  const handleAddApp = async (appData: {
    name: string;
    url: string;
    icon?: string;
  }) => {
    if (!activeWorkspaceId) return;

    await createApp({
      name: appData.name,
      url: appData.url,
      icon: appData.icon,
      workspaceId: activeWorkspaceId,
    });
  };

  const handleUpdateApp = async (id: string, data: Partial<AppType>) => {
    await updateApp(id, data);
  };

  const handleCreateInstance = async (appId: string, instance: AppInstance) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    // Add the new instance to the app
    await updateApp(appId, {
      instances: [...app.instances, instance],
    });
  };

  const handleOpenSettings = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      setSelectedApp(app);
      setIsEditAppModalOpen(true);
    }
  };

  const handleOpenNewInstance = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      setSelectedApp(app);
      setIsCreateInstanceModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚓</div>
          <div className="text-white text-2xl font-semibold">Loading Dockyard...</div>
        </div>
      </div>
    );
  }

  // Show welcome screen if no workspaces exist
  if (workspaces.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-8">
          <div className="text-8xl mb-6">⚓</div>
          <h1 className="text-5xl font-bold mb-4">Welcome to Dockyard</h1>
          <p className="text-xl opacity-90 mb-8">
            Your local-first multi-app workspace is ready!
          </p>
          <p className="text-gray-300 mb-8">
            Create your first workspace to start organizing your web apps.
          </p>
          <button
            onClick={() => setIsCreateWorkspaceModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg"
          >
            Create Your First Workspace
          </button>
        </div>
        <CreateWorkspaceModal
          isOpen={isCreateWorkspaceModalOpen}
          onClose={() => setIsCreateWorkspaceModalOpen(false)}
          onCreateWorkspace={handleCreateWorkspace}
        />
      </div>
    );
  }

  const dockPosition = activeWorkspace?.layout.dockPosition || 'left';
  const dockSize = activeWorkspace?.layout.dockSize || 64;

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Window Chrome */}
      <WindowChrome
        currentWorkspace={activeWorkspace?.name || ''}
        onProfileClick={() => {}}
        onSearchClick={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onWorkspaceSelect={(id) => setActiveWorkspace(id)}
          onCreateWorkspace={() => setIsCreateWorkspaceModalOpen(true)}
        />

        {/* Dock and Canvas Container */}
        <div className="flex-1 flex" style={{
          flexDirection: dockPosition === 'top' || dockPosition === 'bottom' ? 'column' : 'row'
        }}>
          {/* Dock - positioned based on workspace settings */}
          {(dockPosition === 'top' || dockPosition === 'left') && (
            <Dock
              apps={workspaceApps}
              position={dockPosition}
              size={dockSize}
              activeAppId={activeAppId}
              onAppClick={setActiveAppId}
              onAppContextMenu={(appId, e) => {
                e.preventDefault();
                const app = workspaceApps.find(a => a.id === appId);
                if (app) {
                  setContextMenu({
                    appId,
                    appName: app.name,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              }}
              onAddApp={() => setIsAddAppModalOpen(true)}
            />
          )}

          {/* Workspace Canvas */}
          <WorkspaceCanvas
            apps={workspaceApps}
            activeAppId={activeAppId}
            onAppSelect={setActiveAppId}
          />

          {/* Dock - right or bottom position */}
          {(dockPosition === 'bottom' || dockPosition === 'right') && (
            <Dock
              apps={workspaceApps}
              position={dockPosition}
              size={dockSize}
              activeAppId={activeAppId}
              onAppClick={setActiveAppId}
              onAppContextMenu={(appId, e) => {
                e.preventDefault();
                const app = workspaceApps.find(a => a.id === appId);
                if (app) {
                  setContextMenu({
                    appId,
                    appName: app.name,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              }}
              onAddApp={() => setIsAddAppModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        memoryUsage="256 MB"
        doNotDisturb={settings?.notifications.doNotDisturb || false}
        onToggleDnd={handleToggleDnd}
      />

      {/* Modals */}
      <AddAppModal
        isOpen={isAddAppModalOpen}
        workspaceId={activeWorkspaceId || ''}
        onClose={() => setIsAddAppModalOpen(false)}
        onAddApp={handleAddApp}
      />
      <EditAppModal
        isOpen={isEditAppModalOpen}
        app={selectedApp}
        onClose={() => {
          setIsEditAppModalOpen(false);
          setSelectedApp(null);
        }}
        onUpdateApp={handleUpdateApp}
      />
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={() => setIsCreateWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
      <CreateInstanceModal
        isOpen={isCreateInstanceModalOpen}
        app={selectedApp}
        onClose={() => {
          setIsCreateInstanceModalOpen(false);
          setSelectedApp(null);
        }}
        onCreateInstance={handleCreateInstance}
      />

      {/* Context Menu */}
      {contextMenu && (
        <AppContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          appId={contextMenu.appId}
          appName={contextMenu.appName}
          onClose={() => setContextMenu(null)}
          onNewInstance={() => {
            handleOpenNewInstance(contextMenu.appId);
          }}
          onSettings={() => {
            handleOpenSettings(contextMenu.appId);
          }}
          onHibernate={() => {
            hibernateApp(contextMenu.appId);
          }}
          onDelete={async () => {
            await deleteApp(contextMenu.appId);
            if (activeAppId === contextMenu.appId) {
              setActiveAppId(null);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
