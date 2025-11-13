/**
 * Main App Component
 * Orchestrates the application layout and state
 * Refactored to follow SOLID principles with proper separation of concerns
 */

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useModalBrowserViewManager } from './hooks/useModalBrowserViewManager';
import { WindowChrome } from './components/Layout/WindowChrome';
import { Sidebar } from './components/Layout/Sidebar';
import { Dock } from './components/Layout/Dock';
import { WorkspaceCanvas } from './components/Layout/WorkspaceCanvas';
import { StatusBar } from './components/Layout/StatusBar';
import { AddAppModal } from './components/Modals/AddAppModal';
import { EditAppModal } from './components/Modals/EditAppModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';
import { CreateInstanceModal } from './components/Modals/CreateInstanceModal';
import { AppOptionsModal } from './components/Modals/AppOptionsModal';
import { AppContextMenu } from './components/ContextMenu/AppContextMenu';
import { PerformanceDashboard } from './components/DevTools/PerformanceDashboard';
import { SessionManager } from './components/DevTools/SessionManager';
import { App as AppType, AppInstance } from '../../shared/types/app';

function App() {
  // Store hooks
  const {
    loadWorkspaces,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    createWorkspace,
    updateWorkspace,
  } = useWorkspaceStore();
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
  const [isAppOptionsModalOpen, setIsAppOptionsModalOpen] = useState(false);
  const [isPerformanceDashboardOpen, setIsPerformanceDashboardOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    appId: string;
    appName: string;
    x: number;
    y: number;
  } | null>(null);

  // Track if any modal or overlay is open to manage BrowserView visibility
  // This ensures BrowserView is hidden when any UI element needs to appear on top
  const isAnyModalOpen = useMemo(
    () =>
      isAddAppModalOpen ||
      isEditAppModalOpen ||
      isCreateWorkspaceModalOpen ||
      isCreateInstanceModalOpen ||
      isAppOptionsModalOpen ||
      isPerformanceDashboardOpen ||
      isSessionManagerOpen ||
      contextMenu !== null, // Include context menu in overlay detection
    [
      isAddAppModalOpen,
      isEditAppModalOpen,
      isCreateWorkspaceModalOpen,
      isCreateInstanceModalOpen,
      isAppOptionsModalOpen,
      isPerformanceDashboardOpen,
      isSessionManagerOpen,
      contextMenu,
    ]
  );

  // Automatically hide BrowserView when any modal is open
  useModalBrowserViewManager(isAnyModalOpen);

  useEffect(() => {
    // Load all data on startup
    const loadData = async () => {
      try {
        await Promise.all([loadWorkspaces(), loadApps(), loadSettings()]);
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
      action: () => setIsSidebarOpen((prev) => !prev),
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

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  // Sort apps by the order defined in workspace.apps
  const workspaceApps = apps
    .filter((app) => app.workspaceId === activeWorkspaceId)
    .sort((a, b) => {
      const orderA = activeWorkspace?.apps.indexOf(a.id) ?? -1;
      const orderB = activeWorkspace?.apps.indexOf(b.id) ?? -1;
      if (orderA === -1 && orderB === -1) return 0;
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });

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

  const handleAddApp = async (appData: { name: string; url: string; icon?: string }) => {
    if (!activeWorkspaceId || !activeWorkspace) return;

    const newApp = await createApp({
      name: appData.name,
      url: appData.url,
      icon: appData.icon,
      workspaceId: activeWorkspaceId,
    });

    // Add the new app to the workspace's app order
    if (newApp) {
      await updateWorkspace(activeWorkspaceId, {
        apps: [...activeWorkspace.apps, newApp.id],
      });
    }
  };

  const handleAddSampleApps = async () => {
    if (!activeWorkspaceId || !activeWorkspace) return;

    const sampleApps = [
      {
        name: 'Gmail',
        url: 'https://mail.google.com',
        icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'https://github.githubassets.com/favicons/favicon.svg',
      },
      {
        name: 'Notion',
        url: 'https://notion.so',
        icon: 'https://www.notion.so/images/favicon.ico',
      },
      {
        name: 'Slack',
        url: 'https://slack.com/signin',
        icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
      },
    ];

    // Add all sample apps
    const newAppIds: string[] = [];
    for (const appData of sampleApps) {
      const newApp = await createApp({
        name: appData.name,
        url: appData.url,
        icon: appData.icon,
        workspaceId: activeWorkspaceId,
      });
      if (newApp) {
        newAppIds.push(newApp.id);
      }
    }

    // Update workspace with all new app IDs
    if (newAppIds.length > 0) {
      await updateWorkspace(activeWorkspaceId, {
        apps: [...activeWorkspace.apps, ...newAppIds],
      });

      // Select the first app
      setActiveAppId(newAppIds[0]);
    }
  };

  const handleUpdateApp = async (id: string, data: Partial<AppType>) => {
    await updateApp(id, data);
  };

  const handleCreateInstance = async (appId: string, instance: AppInstance) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    // Add the new instance to the app
    await updateApp(appId, {
      instances: [...app.instances, instance],
    });
  };

  const handleOpenSettings = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (app) {
      setSelectedApp(app);
      setIsEditAppModalOpen(true);
    }
  };

  const handleOpenNewInstance = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (app) {
      setSelectedApp(app);
      setIsCreateInstanceModalOpen(true);
    }
  };

  const handleReorderApps = async (draggedAppId: string, targetIndex: number) => {
    if (!activeWorkspace) return;

    const currentApps = [...activeWorkspace.apps];
    const draggedIndex = currentApps.indexOf(draggedAppId);

    if (draggedIndex === -1) {
      // App not in order list, add it
      currentApps.splice(targetIndex, 0, draggedAppId);
    } else {
      // Remove from old position
      currentApps.splice(draggedIndex, 1);
      // Insert at new position
      const newIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
      currentApps.splice(newIndex, 0, draggedAppId);
    }

    // Update workspace with new order
    await updateWorkspace(activeWorkspace.id, {
      apps: currentApps,
    });
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
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white flex items-center justify-center overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div
            className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl px-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="text-8xl mb-6 inline-block"
          >
            ⚓
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome to Dockyard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl opacity-90 mb-8"
          >
            Your local-first multi-app workspace is ready!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-gray-300 mb-8"
          >
            Create your first workspace to start organizing your web apps.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateWorkspaceModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg"
          >
            Create Your First Workspace
          </motion.button>
        </motion.div>
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
        <div
          className="flex-1 flex"
          style={{
            flexDirection: dockPosition === 'top' || dockPosition === 'bottom' ? 'column' : 'row',
          }}
        >
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
                const app = workspaceApps.find((a) => a.id === appId);
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
              onReorder={handleReorderApps}
            />
          )}

          {/* Workspace Canvas */}
          <WorkspaceCanvas
            apps={workspaceApps}
            activeAppId={activeAppId}
            onAppSelect={setActiveAppId}
            onAddSampleApps={handleAddSampleApps}
            onAddCustomApp={() => setIsAddAppModalOpen(true)}
            onUpdateApp={handleUpdateApp}
            onOpenOptions={(appId) => {
              const app = workspaceApps.find((a) => a.id === appId);
              if (app) {
                setSelectedApp(app);
                setIsAppOptionsModalOpen(true);
              }
            }}
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
                const app = workspaceApps.find((a) => a.id === appId);
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
              onReorder={handleReorderApps}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        memoryUsage="256 MB"
        doNotDisturb={settings?.notifications.doNotDisturb || false}
        onToggleDnd={handleToggleDnd}
        onOpenPerformance={() => setIsPerformanceDashboardOpen(true)}
        onOpenSessions={() => setIsSessionManagerOpen(true)}
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
            const app = workspaceApps.find((a) => a.id === contextMenu.appId);
            if (app) {
              setSelectedApp(app);
              setIsAppOptionsModalOpen(true);
            }
            setContextMenu(null);
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

      {/* App Options Modal */}
      <AppOptionsModal
        isOpen={isAppOptionsModalOpen}
        app={selectedApp}
        instanceId={selectedApp?.instances[0]?.id}
        zoomLevel={selectedApp?.display?.zoomLevel || 1.0}
        onClose={() => {
          setIsAppOptionsModalOpen(false);
          setSelectedApp(null);
        }}
        onZoomChange={(level) => {
          if (selectedApp) {
            handleUpdateApp(selectedApp.id, {
              display: {
                ...selectedApp.display,
                zoomLevel: level,
              },
            });
          }
        }}
        onDuplicate={() => {
          if (selectedApp) {
            handleOpenNewInstance(selectedApp.id);
          }
        }}
        onSettings={() => {
          if (selectedApp) {
            setIsAppOptionsModalOpen(false);
            setIsEditAppModalOpen(true);
          }
        }}
        onHibernate={() => {
          if (selectedApp) {
            hibernateApp(selectedApp.id);
            setIsAppOptionsModalOpen(false);
            setSelectedApp(null);
          }
        }}
        onDelete={async () => {
          if (selectedApp) {
            await deleteApp(selectedApp.id);
            if (activeAppId === selectedApp.id) {
              setActiveAppId(null);
            }
            setIsAppOptionsModalOpen(false);
            setSelectedApp(null);
          }
        }}
        onResponsiveModeChange={(width, height) => {
          if (selectedApp) {
            handleUpdateApp(selectedApp.id, {
              display: {
                ...selectedApp.display,
                zoomLevel: selectedApp.display?.zoomLevel || 1.0,
                responsiveMode:
                  width > 0 && height > 0
                    ? {
                        enabled: true,
                        width,
                        height,
                      }
                    : undefined,
              },
            });
          }
        }}
      />

      {/* DevTools */}
      {isPerformanceDashboardOpen && (
        <PerformanceDashboard onClose={() => setIsPerformanceDashboardOpen(false)} />
      )}
      {isSessionManagerOpen && (
        <SessionManager apps={workspaceApps} onClose={() => setIsSessionManagerOpen(false)} />
      )}
    </div>
  );
}

export default App;
