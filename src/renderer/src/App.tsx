/**
 * Main App Component
 * Orchestrates the application layout and state
 * Refactored to follow SOLID principles with proper separation of concerns
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useModalBrowserViewManager } from './hooks/useModalBrowserViewManager';
import { useTheme } from './hooks/useTheme';
import { WindowChrome } from './components/Layout/WindowChrome';
import { Dock } from './components/Layout/Dock';
import { WorkspaceCanvas } from './components/Layout/WorkspaceCanvas';
import { StatusBar } from './components/Layout/StatusBar';
import { AddAppModal } from './components/Modals/AddAppModal';
import { EditAppModal } from './components/Modals/EditAppModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';
import { AppOptionsModal } from './components/Modals/AppOptionsModal';
import { ThemeSettingsModal } from './components/Modals/ThemeSettingsModal';
import { AppCustomizationModal } from './components/Modals/AppCustomizationModal';
import { AppContextMenu } from './components/ContextMenu/AppContextMenu';
import { WorkspaceContextMenu } from './components/ContextMenu/WorkspaceContextMenu';
import { WorkspaceSwitcherModal } from './components/Modals/WorkspaceSwitcherModal';
import { SplitWithModal } from './components/Modals/SplitWithModal';
import { PerformanceDashboard } from './components/DevTools/PerformanceDashboard';
import { SessionManager } from './components/DevTools/SessionManager';
import { WorkspaceSettingsModal } from './components/Modals/WorkspaceSettingsModal';
import { App as AppType } from '../../shared/types/app';
import { LayoutMode } from '../../shared/types/workspace';
import { IPC_EVENTS } from '../../shared/constants';
import type { AppShortcutSignal, AppShortcutSignalType } from './types/shortcuts';

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
  const { loadApps, apps, createApp, updateApp, deleteApp, hibernateApp, resumeApp } =
    useAppStore();
  const { loadSettings, settings, updateSettings } = useSettingsStore();

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  // Modal state
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [addAppInitialCollection, setAddAppInitialCollection] = useState<string | null>(null);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [isAppOptionsModalOpen, setIsAppOptionsModalOpen] = useState(false);
  const [isAppCustomizationModalOpen, setIsAppCustomizationModalOpen] = useState(false);
  const [isWorkspaceSettingsModalOpen, setIsWorkspaceSettingsModalOpen] = useState(false);
  const [isThemeSettingsModalOpen, setIsThemeSettingsModalOpen] = useState(false);
  const [isPerformanceDashboardOpen, setIsPerformanceDashboardOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = useState(false);
  const [isSplitWithModalOpen, setIsSplitWithModalOpen] = useState(false);
  const [splitWithAppId, setSplitWithAppId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const selectedApp = useMemo(() => {
    if (!selectedAppId) {
      return null;
    }
    return apps.find((appEntry) => appEntry.id === selectedAppId) ?? null;
  }, [apps, selectedAppId]);
  const [customizationAppId, setCustomizationAppId] = useState<string | null>(null);
  const [awakeApps, setAwakeApps] = useState<Record<string, boolean>>({});
  const [activeInstances, setActiveInstances] = useState<Record<string, string>>({});
  const [shortcutSignal, setShortcutSignal] = useState<AppShortcutSignal | null>(null);

  // Split layout state
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [activeAppIds, setActiveAppIds] = useState<string[]>([]);

  const activeAppIdRef = useRef<string | null>(null);
  const awakeAppsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    activeAppIdRef.current = activeAppId;
  }, [activeAppId]);

  useEffect(() => {
    awakeAppsRef.current = awakeApps;
  }, [awakeApps]);

  const emitShortcutToActiveApp = useCallback((type: AppShortcutSignalType) => {
    const targetAppId = activeAppIdRef.current;
    if (!targetAppId) return;
    setShortcutSignal({ appId: targetAppId, type, timestamp: Date.now() });
  }, []);

  // Apply theme
  useTheme({
    mode: settings?.theme?.mode || 'dark',
    accentColor: settings?.theme?.accentColor || '#6366f1',
    backgroundStyle: settings?.theme?.backgroundStyle || 'solid',
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    appId: string;
    appName: string;
    x: number;
    y: number;
    isMuted: boolean;
  } | null>(null);

  const [workspaceContextMenu, setWorkspaceContextMenu] = useState<{
    workspaceId: string;
    workspaceName: string;
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
      isAppOptionsModalOpen ||
      isAppCustomizationModalOpen ||
      isThemeSettingsModalOpen ||
      isPerformanceDashboardOpen ||
      isSessionManagerOpen ||
      isWorkspaceSwitcherOpen ||
      isSplitWithModalOpen ||
      contextMenu !== null ||
      workspaceContextMenu !== null,
    [
      isAddAppModalOpen,
      isEditAppModalOpen,
      isCreateWorkspaceModalOpen,
      isAppOptionsModalOpen,
      isAppCustomizationModalOpen,
      isThemeSettingsModalOpen,
      isPerformanceDashboardOpen,
      isSessionManagerOpen,
      isWorkspaceSwitcherOpen,
      isSplitWithModalOpen,
      contextMenu,
      workspaceContextMenu,
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

  useEffect(() => {
    if (isAppOptionsModalOpen && !selectedApp) {
      setIsAppOptionsModalOpen(false);
      setSelectedAppId(null);
    }
  }, [isAppOptionsModalOpen, selectedApp]);

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

  const setAppAwakeState = (appId: string, awake: boolean) => {
    setAwakeApps((prev) => {
      if (awake) {
        if (prev[appId]) return prev;
        return { ...prev, [appId]: true };
      }

      if (!prev[appId]) return prev;
      const { [appId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const getInstanceId = useCallback(
    (appId: string, explicitInstanceId?: string) => {
      if (explicitInstanceId) return explicitInstanceId;
      const app = apps.find((a) => a.id === appId);
      if (!app) return undefined;

      const preferred = activeInstances[appId];
      if (preferred && app.instances.some((inst) => inst.id === preferred)) {
        return preferred;
      }

      return app.instances[0]?.id;
    },
    [activeInstances, apps]
  );

  const getInstanceIdRef = useRef(getInstanceId);

  useEffect(() => {
    getInstanceIdRef.current = getInstanceId;
  }, [getInstanceId]);

  const handleWakeAppRequest = async (appId: string, instanceId?: string) => {
    const targetInstanceId = getInstanceId(appId, instanceId);
    if (!targetInstanceId) return;

    setAppAwakeState(appId, true);
    try {
      await resumeApp(appId, targetInstanceId);
    } catch (error) {
      console.error('Failed to resume app instance', error);
      setAppAwakeState(appId, false);
    }
  };

  const handleHibernateAppRequest = async (appId: string, instanceId?: string) => {
    const targetInstanceId = getInstanceId(appId, instanceId);
    if (!targetInstanceId) return;

    try {
      await hibernateApp(appId, targetInstanceId);
    } catch (error) {
      console.error('Failed to hibernate app instance', error);
    } finally {
      setAppAwakeState(appId, false);
    }
  };

  const handleToggleDockyardDevTools = () => {
    if (!window.dockyard?.window?.toggleDevTools) {
      return;
    }

    window.dockyard.window.toggleDevTools().catch((error: unknown) => {
      console.error('Failed to toggle Dockyard devtools', error);
    });
  };

  useEffect(() => {
    if (!window.dockyard?.on || !window.dockyard?.off || !window.dockyard?.webview) {
      return;
    }

    const performReload = (ignoreCache: boolean) => {
      const currentAppId = activeAppIdRef.current;
      if (!currentAppId) return;
      if (!awakeAppsRef.current[currentAppId]) return;
      const instanceId = getInstanceIdRef.current(currentAppId);
      if (!instanceId) return;

      const action = ignoreCache
        ? window.dockyard.webview.forceReload
        : window.dockyard.webview.reload;

      action(currentAppId, instanceId).catch((error: unknown) => {
        console.error(ignoreCache ? 'Force reload failed' : 'Reload failed', error);
      });
    };

    const toggleAppDevtools = () => {
      const currentAppId = activeAppIdRef.current;
      if (!currentAppId) return;
      if (!awakeAppsRef.current[currentAppId]) return;
      const instanceId = getInstanceIdRef.current(currentAppId);
      if (!instanceId) return;

      window.dockyard.webview.toggleDevTools(currentAppId, instanceId).catch((error: unknown) => {
        console.error('Failed to toggle app devtools', error);
      });
    };

    const reloadListener = () => performReload(false);
    const forceReloadListener = () => performReload(true);
    const toggleDevtoolsListener = () => toggleAppDevtools();
    const shortcutFindListener = () => emitShortcutToActiveApp('find');
    const shortcutPrintListener = () => emitShortcutToActiveApp('print');

    window.dockyard.on(IPC_EVENTS.SHORTCUT_RELOAD, reloadListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_FORCE_RELOAD, forceReloadListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS, toggleDevtoolsListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_FIND, shortcutFindListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_PRINT, shortcutPrintListener);

    return () => {
      window.dockyard.off(IPC_EVENTS.SHORTCUT_RELOAD, reloadListener);
      window.dockyard.off(IPC_EVENTS.SHORTCUT_FORCE_RELOAD, forceReloadListener);
      window.dockyard.off(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS, toggleDevtoolsListener);
      window.dockyard.off(IPC_EVENTS.SHORTCUT_FIND, shortcutFindListener);
      window.dockyard.off(IPC_EVENTS.SHORTCUT_PRINT, shortcutPrintListener);
    };
  }, [emitShortcutToActiveApp]);

  // Clean up awake map when apps list changes
  useEffect(() => {
    setAwakeApps((prev) => {
      const validIds = new Set(apps.map((app) => app.id));
      const next: Record<string, boolean> = {};
      for (const id of Object.keys(prev)) {
        if (validIds.has(id) && prev[id]) {
          next[id] = true;
        }
      }
      return next;
    });
  }, [apps]);

  useEffect(() => {
    setActiveInstances((prev) => {
      let changed = false;
      const next = { ...prev };

      const validAppIds = new Set(apps.map((app) => app.id));
      for (const appId of Object.keys(next)) {
        if (!validAppIds.has(appId)) {
          delete next[appId];
          changed = true;
        }
      }

      apps.forEach((app) => {
        if (app.instances.length === 0) {
          if (next[app.id]) {
            delete next[app.id];
            changed = true;
          }
          return;
        }

        const current = next[app.id];
        const hasCurrent = current && app.instances.some((inst) => inst.id === current);
        if (!hasCurrent) {
          next[app.id] = app.instances[0].id;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [apps]);

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
    // Toggle Workspace Switcher: Cmd/Ctrl+B
    {
      key: 'KeyB',
      modifier: 'ctrlOrMeta',
      action: () => setIsWorkspaceSwitcherOpen((prev) => !prev),
      description: 'Toggle workspace switcher',
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

  const handleAddApp = async (appData: {
    name: string;
    url: string;
    icon?: string;
    description?: string;
  }) => {
    if (!activeWorkspaceId || !activeWorkspace) return;

    const newApp = await createApp({
      name: appData.name,
      url: appData.url,
      icon: appData.icon,
      description: appData.description,
      workspaceId: activeWorkspaceId,
    });

    // Add the new app to the workspace's app order
    if (newApp) {
      await updateWorkspace(activeWorkspaceId, {
        apps: [...activeWorkspace.apps, newApp.id],
      });
    }
  };

  const handleCollectionSelect = (collection: string) => {
    if (!collection) return;
    setAddAppInitialCollection(collection);
    setIsAddAppModalOpen(true);
  };

  const handleSaveWorkspaceSettings = async (settings: {
    name: string;
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
    dockSize: number;
    sessionMode: 'isolated' | 'shared';
    hibernationEnabled: boolean;
    idleTimeMinutes: number;
  }) => {
    if (!activeWorkspace) return;

    await updateWorkspace(activeWorkspace.id, {
      name: settings.name,
      sessionMode: settings.sessionMode,
      hibernation: {
        ...activeWorkspace.hibernation,
        enabled: settings.hibernationEnabled,
        idleTimeMinutes: settings.idleTimeMinutes,
      },
      layout: {
        ...activeWorkspace.layout,
        dockPosition: settings.dockPosition,
        dockSize: settings.dockSize,
      },
    });

    setIsWorkspaceSettingsModalOpen(false);
  };

  const handleUpdateApp = useCallback(
    async (id: string, data: Partial<AppType>) => {
      await updateApp(id, data);
    },
    [updateApp]
  );

  const handleToggleMute = useCallback(
    async (appId: string, muted: boolean, instanceId?: string) => {
      await handleUpdateApp(appId, {
        audio: {
          muted,
        },
      });

      const targetInstanceId = instanceId ?? getInstanceIdRef.current(appId);
      if (!targetInstanceId) {
        return;
      }

      if (window.dockyard?.webview?.setAudioMuted) {
        window.dockyard.webview
          .setAudioMuted(appId, targetInstanceId, muted)
          .catch((error: unknown) => {
            console.error('Failed to toggle audio mute', error);
          });
      }
    },
    [handleUpdateApp]
  );

  const openAppCustomizationModal = (appId: string) => {
    setCustomizationAppId(appId);
    setIsAppCustomizationModalOpen(true);
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

  const handleSplitWith = (appId: string) => {
    setSplitWithAppId(appId);
    setIsSplitWithModalOpen(true);
  };

  const handleConfirmSplit = (appIds: string[], mode: LayoutMode) => {
    setActiveAppIds(appIds);
    setLayoutMode(mode);
    setActiveAppId(appIds[0]); // Set first app as active
  };

  const handleUnsplitAll = () => {
    setLayoutMode('single');
    setActiveAppIds([]);
    // Keep current active app
  };

  const handleLayoutChange = (mode: LayoutMode, panels: { appId: string; size?: number }[]) => {
    setLayoutMode(mode);
    if (panels && panels.length > 0) {
      setActiveAppIds(panels.map((p) => p.appId));
    } else {
      setActiveAppIds([]);
    }
  };

  const handleSelectApp = useCallback(
    (appId: string) => {
      setActiveAppId(appId);

      if (layoutMode !== 'single' && !activeAppIds.includes(appId)) {
        setLayoutMode('single');
        setActiveAppIds([]);
      }
    },
    [layoutMode, activeAppIds]
  );

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
        onWorkspaceSwitchClick={() => setIsWorkspaceSwitcherOpen(true)}
        onWorkspaceContextMenu={(e) => {
          if (activeWorkspace) {
            setWorkspaceContextMenu({
              workspaceId: activeWorkspace.id,
              workspaceName: activeWorkspace.name,
              x: e.clientX,
              y: e.clientY,
            });
          }
        }}
        onThemeClick={() => setIsThemeSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
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
              awakeApps={awakeApps}
              onAppClick={handleSelectApp}
              onAppContextMenu={(appId, e) => {
                e.preventDefault();
                const app = workspaceApps.find((a) => a.id === appId);
                if (app) {
                  setContextMenu({
                    appId,
                    appName: app.name,
                    x: e.clientX,
                    y: e.clientY,
                    isMuted: app.audio?.muted ?? false,
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
            onAppSelect={handleSelectApp}
            awakeApps={awakeApps}
            onWakeApp={handleWakeAppRequest}
            onCollectionSelect={handleCollectionSelect}
            onAddCustomApp={() => setIsAddAppModalOpen(true)}
            onUpdateApp={handleUpdateApp}
            onOpenOptions={(appId) => {
              const app = workspaceApps.find((a) => a.id === appId);
              if (app) {
                setSelectedAppId(app.id);
                setIsAppOptionsModalOpen(true);
              }
            }}
            activeInstances={activeInstances}
            shortcutSignal={shortcutSignal}
            onToggleMute={handleToggleMute}
            layoutMode={layoutMode}
            activeAppIds={activeAppIds}
            onLayoutChange={handleLayoutChange}
          />

          {/* Dock - right or bottom position */}
          {(dockPosition === 'bottom' || dockPosition === 'right') && (
            <Dock
              apps={workspaceApps}
              position={dockPosition}
              size={dockSize}
              activeAppId={activeAppId}
              awakeApps={awakeApps}
              onAppClick={handleSelectApp}
              onAppContextMenu={(appId, e) => {
                e.preventDefault();
                const app = workspaceApps.find((a) => a.id === appId);
                if (app) {
                  setContextMenu({
                    appId,
                    appName: app.name,
                    x: e.clientX,
                    y: e.clientY,
                    isMuted: app.audio?.muted ?? false,
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
        onOpenWorkspaceSettings={
          activeWorkspace ? () => setIsWorkspaceSettingsModalOpen(true) : undefined
        }
        onOpenPerformance={() => setIsPerformanceDashboardOpen(true)}
        onOpenSessions={() => setIsSessionManagerOpen(true)}
        onToggleDockyardDevTools={handleToggleDockyardDevTools}
      />

      {/* Modals */}
      <AddAppModal
        key={addAppInitialCollection ? `collection-${addAppInitialCollection}` : 'default'}
        isOpen={isAddAppModalOpen}
        initialCollection={addAppInitialCollection || undefined}
        onClose={() => {
          setIsAddAppModalOpen(false);
          setAddAppInitialCollection(null);
        }}
        onAddApp={handleAddApp}
      />
      <EditAppModal
        isOpen={isEditAppModalOpen}
        app={selectedApp}
        onClose={() => {
          setIsEditAppModalOpen(false);
          setSelectedAppId(null);
        }}
        onUpdateApp={handleUpdateApp}
      />
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={() => setIsCreateWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
      {isWorkspaceSettingsModalOpen && activeWorkspace && (
        <WorkspaceSettingsModal
          workspace={activeWorkspace}
          onClose={() => setIsWorkspaceSettingsModalOpen(false)}
          onSave={handleSaveWorkspaceSettings}
        />
      )}
      <ThemeSettingsModal
        isOpen={isThemeSettingsModalOpen}
        onClose={() => setIsThemeSettingsModalOpen(false)}
        currentMode={settings?.theme?.mode || 'dark'}
        currentAccentColor={settings?.theme?.accentColor || '#6366f1'}
        currentBackgroundStyle={settings?.theme?.backgroundStyle || 'solid'}
        customPresets={settings?.theme?.customPresets || []}
        onSave={(themeSettings) => {
          updateSettings({
            theme: themeSettings,
          });
          setIsThemeSettingsModalOpen(false);
        }}
      />
      <SplitWithModal
        isOpen={isSplitWithModalOpen}
        onClose={() => {
          setIsSplitWithModalOpen(false);
          setSplitWithAppId(null);
        }}
        apps={workspaceApps}
        currentAppId={splitWithAppId || ''}
        onConfirm={handleConfirmSplit}
      />

      {/* Context Menus */}
      {contextMenu && (
        <AppContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          appId={contextMenu.appId}
          appName={contextMenu.appName}
          onClose={() => setContextMenu(null)}
          onSettings={() => {
            const app = workspaceApps.find((a) => a.id === contextMenu.appId);
            if (app) {
              setSelectedAppId(app.id);
              setIsAppOptionsModalOpen(true);
            }
            setContextMenu(null);
          }}
          onHibernate={() => {
            handleHibernateAppRequest(contextMenu.appId);
          }}
          onDelete={async () => {
            await deleteApp(contextMenu.appId);
            if (activeAppId === contextMenu.appId) {
              setActiveAppId(null);
            }
          }}
          isMuted={contextMenu.isMuted}
          onToggleMute={(muted) => handleToggleMute(contextMenu.appId, muted)}
          onSplitWith={() => handleSplitWith(contextMenu.appId)}
          onUnsplitAll={handleUnsplitAll}
          isInSplitMode={layoutMode !== 'single' && activeAppIds.length > 1}
        />
      )}

      {workspaceContextMenu && activeWorkspace && (
        <WorkspaceContextMenu
          x={workspaceContextMenu.x}
          y={workspaceContextMenu.y}
          workspaceId={workspaceContextMenu.workspaceId}
          workspaceName={workspaceContextMenu.workspaceName}
          currentDockPosition={activeWorkspace.layout.dockPosition}
          onClose={() => setWorkspaceContextMenu(null)}
          onDelete={async () => {
            // Don't allow deleting the last workspace
            if (workspaces.length > 1) {
              const { deleteWorkspace } = useWorkspaceStore.getState();
              await deleteWorkspace(workspaceContextMenu.workspaceId);
            } else {
              alert('Cannot delete the last workspace');
            }
          }}
          onHibernate={async () => {
            // Hibernate all apps in the workspace
            const appsInWorkspace = apps.filter(
              (app) => app.workspaceId === workspaceContextMenu.workspaceId
            );
            for (const app of appsInWorkspace) {
              if (app.instances.length > 0) {
                await handleHibernateAppRequest(app.id, app.instances[0].id);
              }
            }
          }}
          onChangeDockPosition={async (position) => {
            await updateWorkspace(workspaceContextMenu.workspaceId, {
              layout: {
                ...activeWorkspace.layout,
                dockPosition: position,
              },
            });
          }}
          onOpenSettings={() => {
            setIsWorkspaceSettingsModalOpen(true);
          }}
        />
      )}

      {/* Workspace Switcher Modal */}
      <WorkspaceSwitcherModal
        isOpen={isWorkspaceSwitcherOpen}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onClose={() => setIsWorkspaceSwitcherOpen(false)}
        onSelectWorkspace={(id) => setActiveWorkspace(id)}
        onCreateWorkspace={() => {
          setIsWorkspaceSwitcherOpen(false);
          setIsCreateWorkspaceModalOpen(true);
        }}
      />

      {/* App Options Modal */}
      <AppOptionsModal
        isOpen={isAppOptionsModalOpen}
        app={selectedApp}
        zoomLevel={selectedApp?.display?.zoomLevel || 1.0}
        isMuted={selectedApp?.audio?.muted ?? false}
        onClose={() => {
          setIsAppOptionsModalOpen(false);
          setSelectedAppId(null);
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
        onSettings={() => {
          if (selectedApp) {
            setIsAppOptionsModalOpen(false);
            setIsEditAppModalOpen(true);
          }
        }}
        onCustomize={() => {
          if (selectedApp) {
            openAppCustomizationModal(selectedApp.id);
            setIsAppOptionsModalOpen(false);
            setSelectedAppId(null);
          }
        }}
        onHibernate={() => {
          if (selectedApp && selectedApp.instances.length > 0) {
            handleHibernateAppRequest(selectedApp.id, selectedApp.instances[0].id);
            setIsAppOptionsModalOpen(false);
            setSelectedAppId(null);
          }
        }}
        onDelete={async () => {
          if (selectedApp) {
            await deleteApp(selectedApp.id);
            if (activeAppId === selectedApp.id) {
              setActiveAppId(null);
            }
            setIsAppOptionsModalOpen(false);
            setSelectedAppId(null);
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
        onUserAgentChange={(value) => {
          if (selectedApp) {
            handleUpdateApp(selectedApp.id, {
              userAgent: value || undefined,
            });
          }
        }}
        onToggleMute={(muted) => {
          if (selectedApp) {
            handleToggleMute(selectedApp.id, muted);
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

      {isAppCustomizationModalOpen && (
        <AppCustomizationModal
          key={customizationAppId ?? 'none'}
          isOpen={isAppCustomizationModalOpen}
          app={apps.find((app) => app.id === customizationAppId) || null}
          onClose={() => {
            setIsAppCustomizationModalOpen(false);
            setCustomizationAppId(null);
          }}
          onSave={(appId, data) => {
            handleUpdateApp(appId, data);
          }}
        />
      )}
    </div>
  );
}

export default App;
