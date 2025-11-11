import { useEffect, useState } from 'react';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';
import { WindowChrome } from './components/Layout/WindowChrome';
import { Sidebar } from './components/Layout/Sidebar';
import { Dock } from './components/Layout/Dock';
import { WorkspaceCanvas } from './components/Layout/WorkspaceCanvas';
import { StatusBar } from './components/Layout/StatusBar';
import { AddAppModal } from './components/Modals/AddAppModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';
import { AppContextMenu } from './components/ContextMenu/AppContextMenu';

function App() {
  const { loadWorkspaces, workspaces, activeWorkspaceId, setActiveWorkspace, createWorkspace } = useWorkspaceStore();
  const { loadApps, apps, createApp, deleteApp, hibernateApp } = useAppStore();
  const { loadSettings, settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
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

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey; // Cmd on Mac, Ctrl on Windows/Linux
      
      // Quick Launcher: Cmd/Ctrl+Space
      if (isMod && e.code === 'Space') {
        e.preventDefault();
        // TODO: Implement quick launcher
        console.log('Quick launcher shortcut triggered');
      }
      
      // Toggle Sidebar: Cmd/Ctrl+B
      if (isMod && e.code === 'KeyB') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      
      // Toggle DND: Cmd/Ctrl+Shift+D
      if (isMod && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        handleToggleDnd();
      }
      
      // Switch Workspace: Cmd/Ctrl+1-9
      if (isMod && !e.shiftKey && e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''));
        if (num >= 1 && num <= workspaces.length) {
          e.preventDefault();
          setActiveWorkspace(workspaces[num - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workspaces, setActiveWorkspace, handleToggleDnd]);

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
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={() => setIsCreateWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
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
            console.log('Create new instance for:', contextMenu.appId);
            // TODO: Implement instance creation
          }}
          onSettings={() => {
            console.log('Open settings for:', contextMenu.appId);
            // TODO: Implement app settings
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
