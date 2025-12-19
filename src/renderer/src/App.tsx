import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useModalBrowserViewManager } from './hooks/useModalBrowserViewManager';
import { useTheme } from './hooks/useTheme';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import { useAppRuntime } from './hooks/useAppRuntime';
import { useContextMenus } from './hooks/useContextMenus';
import { LoadingScreen } from './components/App/LoadingScreen';
import { WelcomeScreen } from './components/App/WelcomeScreen';
import { WindowChrome } from './components/Layout/WindowChrome';
import { Dock } from './components/Layout/Dock';
import { WorkspaceCanvas } from './components/Layout/WorkspaceCanvas';
import { StatusBar } from './components/Layout/StatusBar';
import { AddAppModal } from './components/Modals/AddAppModal';
import { EditAppModal } from './components/Modals/EditAppModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';
import { AppOptionsModal } from './components/Modals/AppOptionsModal';
import { SettingsModal } from './components/Modals/SettingsModal';
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
import { DEFAULTS } from '../../shared/constants';
import { debugError, debugLog } from '../../shared/utils/debug';
import { useProfileStore } from './store/profiles';
import { ProfileSwitcherModal } from './components/Modals/ProfileSwitcherModal';

function App() {
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
  const {
    profiles,
    currentProfile,
    loadProfiles,
    createProfile,
    deleteProfile,
    switchProfile,
    loading: profileLoading,
    error: profileError,
    isSwitching: isSwitchingProfile,
  } = useProfileStore();

  const { isBootstrapping } = useAppBootstrap({
    loadWorkspaces,
    loadApps,
    loadSettings,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
  });

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [addAppInitialCollection, setAddAppInitialCollection] = useState<string | null>(null);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [isAppOptionsModalOpen, setIsAppOptionsModalOpen] = useState(false);
  const [isAppCustomizationModalOpen, setIsAppCustomizationModalOpen] = useState(false);
  const [isWorkspaceSettingsModalOpen, setIsWorkspaceSettingsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPerformanceDashboardOpen, setIsPerformanceDashboardOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isSplitWithModalOpen, setIsSplitWithModalOpen] = useState(false);
  const [splitWithAppId, setSplitWithAppId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [customizationAppId, setCustomizationAppId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [activeAppIds, setActiveAppIds] = useState<string[]>([]);
  const [pendingProfileName, setPendingProfileName] = useState<string | null>(null);

  const selectedApp = useMemo(() => {
    if (!selectedAppId) {
      return null;
    }
    return apps.find((appEntry) => appEntry.id === selectedAppId) ?? null;
  }, [apps, selectedAppId]);

  const selectedAppWorkspace = useMemo(() => {
    if (!selectedApp) {
      return null;
    }
    return workspaces.find((workspace) => workspace.id === selectedApp.workspaceId) ?? null;
  }, [selectedApp, workspaces]);

  useTheme({
    mode: settings?.theme?.mode || 'dark',
    accentColor: settings?.theme?.accentColor || '#6366f1',
    backgroundStyle: settings?.theme?.backgroundStyle || 'solid',
  });

  const {
    appContextMenu,
    workspaceContextMenu,
    openAppContextMenu,
    closeAppContextMenu,
    openWorkspaceContextMenu,
    closeWorkspaceContextMenu,
  } = useContextMenus();

  const handleUpdateApp = useCallback(
    async (id: string, data: Partial<AppType>) => {
      await updateApp(id, data);
    },
    [updateApp]
  );

  const {
    awakeApps,
    activeInstances,
    shortcutSignal,
    handleWakeAppRequest,
    handleHibernateAppRequest,
    handleToggleMute,
    registerActiveApp,
  } = useAppRuntime({
    apps,
    resumeApp,
    hibernateApp,
    loadApps,
    updateApp: handleUpdateApp,
  });

  useEffect(() => {
    registerActiveApp(activeAppId);
  }, [activeAppId, registerActiveApp]);

  const isAppOptionsVisible = isAppOptionsModalOpen && Boolean(selectedApp);

  const handleToggleDnd = useCallback(() => {
    if (settings) {
      updateSettings({
        notifications: {
          ...settings.notifications,
          doNotDisturb: !settings.notifications.doNotDisturb,
        },
      });
    }
  }, [settings, updateSettings]);

  const isAnyModalOpen = useMemo(
    () =>
      isAddAppModalOpen ||
      isEditAppModalOpen ||
      isCreateWorkspaceModalOpen ||
      isAppOptionsVisible ||
      isAppCustomizationModalOpen ||
      isSettingsModalOpen ||
      isPerformanceDashboardOpen ||
      isSessionManagerOpen ||
      isWorkspaceSwitcherOpen ||
      isProfileSwitcherOpen ||
      isSplitWithModalOpen ||
      appContextMenu !== null ||
      workspaceContextMenu !== null,
    [
      isAddAppModalOpen,
      isEditAppModalOpen,
      isCreateWorkspaceModalOpen,
      isAppOptionsVisible,
      isAppCustomizationModalOpen,
      isSettingsModalOpen,
      isPerformanceDashboardOpen,
      isSessionManagerOpen,
      isWorkspaceSwitcherOpen,
      isProfileSwitcherOpen,
      isSplitWithModalOpen,
      appContextMenu,
      workspaceContextMenu,
    ]
  );

  useModalBrowserViewManager(isAnyModalOpen);

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);

  const workspaceApps = useMemo(() => {
    return apps
      .filter((app) => app.workspaceId === activeWorkspaceId)
      .sort((a, b) => {
        const orderA = activeWorkspace?.apps.indexOf(a.id) ?? -1;
        const orderB = activeWorkspace?.apps.indexOf(b.id) ?? -1;
        if (orderA === -1 && orderB === -1) return 0;
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
      });
  }, [apps, activeWorkspace?.apps, activeWorkspaceId]);

  const handleCreateWorkspace = useCallback(
    async (data: {
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
    },
    [createWorkspace]
  );

  const handleAddApp = useCallback(
    async (appData: { name: string; url: string; icon?: string; description?: string }) => {
      if (!activeWorkspaceId || !activeWorkspace) return;

      const newApp = await createApp({
        name: appData.name,
        url: appData.url,
        icon: appData.icon,
        description: appData.description,
        workspaceId: activeWorkspaceId,
      });

      if (newApp) {
        await updateWorkspace(activeWorkspaceId, {
          apps: [...activeWorkspace.apps, newApp.id],
        });
      }
    },
    [activeWorkspace, activeWorkspaceId, createApp, updateWorkspace]
  );

  const handleCollectionSelect = useCallback((collection: string) => {
    if (!collection) return;
    setAddAppInitialCollection(collection);
    setIsAddAppModalOpen(true);
  }, []);

  const handleSaveWorkspaceSettings = useCallback(
    async (workspaceSettings: {
      name: string;
      dockPosition: 'top' | 'bottom' | 'left' | 'right';
      dockSize: number;
      sessionMode: 'isolated' | 'shared';
      hibernationEnabled: boolean;
      idleTimeMinutes: number;
    }) => {
      if (!activeWorkspace) return;

      await updateWorkspace(activeWorkspace.id, {
        name: workspaceSettings.name,
        sessionMode: workspaceSettings.sessionMode,
        hibernation: {
          ...activeWorkspace.hibernation,
          enabled: workspaceSettings.hibernationEnabled,
          idleTimeMinutes: workspaceSettings.idleTimeMinutes,
        },
        layout: {
          ...activeWorkspace.layout,
          dockPosition: workspaceSettings.dockPosition,
          dockSize: workspaceSettings.dockSize,
        },
      });

      setIsWorkspaceSettingsModalOpen(false);
    },
    [activeWorkspace, updateWorkspace]
  );

  const handleReorderApps = useCallback(
    async (draggedAppId: string, targetIndex: number) => {
      if (!activeWorkspace) return;

      const currentApps = [...activeWorkspace.apps];
      const draggedIndex = currentApps.indexOf(draggedAppId);

      if (draggedIndex === -1) {
        currentApps.splice(targetIndex, 0, draggedAppId);
      } else {
        currentApps.splice(draggedIndex, 1);
        const newIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        currentApps.splice(newIndex, 0, draggedAppId);
      }

      await updateWorkspace(activeWorkspace.id, {
        apps: currentApps,
      });
    },
    [activeWorkspace, updateWorkspace]
  );

  const handleSplitWith = useCallback((appId: string) => {
    setSplitWithAppId(appId);
    setIsSplitWithModalOpen(true);
  }, []);

  const handleConfirmSplit = useCallback((appIds: string[], mode: LayoutMode) => {
    setActiveAppIds(appIds);
    setLayoutMode(mode);
    setActiveAppId(appIds[0] ?? null);
  }, []);

  const handleUnsplitAll = useCallback(() => {
    setLayoutMode('single');
    setActiveAppIds([]);
  }, []);

  const handleLayoutChange = useCallback(
    (mode: LayoutMode, panels: { appId: string; size?: number }[]) => {
      setLayoutMode(mode);
      if (panels.length > 0) {
        setActiveAppIds(panels.map((panel) => panel.appId));
      } else {
        setActiveAppIds([]);
      }
    },
    []
  );

  const handleSelectApp = useCallback(
    (appId: string) => {
      setActiveAppId(appId);

      if (layoutMode !== 'single' && !activeAppIds.includes(appId)) {
        setLayoutMode('single');
        setActiveAppIds([]);
      }
    },
    [activeAppIds, layoutMode]
  );

  const openAppCustomizationModal = useCallback((appId: string) => {
    setCustomizationAppId(appId);
    setIsAppCustomizationModalOpen(true);
  }, []);

  const handleToggleDockyardDevTools = useCallback(() => {
    if (!window.dockyard?.window?.toggleDevTools) {
      return;
    }

    window.dockyard.window.toggleDevTools().catch((error: unknown) => {
      debugError('Failed to toggle Dockyard devtools', error);
    });
  }, []);

  const handleCreateProfile = useCallback(
    async (name: string) => {
      try {
        await createProfile(name);
      } catch (error) {
        debugError('Failed to create profile', error);
      }
    },
    [createProfile]
  );

  const handleDeleteProfile = useCallback(
    async (profileId: string) => {
      try {
        await deleteProfile(profileId);
      } catch (error) {
        debugError('Failed to delete profile', error);
      }
    },
    [deleteProfile]
  );

  const handleProfileSelect = useCallback(
    async (profileId: string) => {
      if (currentProfile?.id === profileId) {
        setIsProfileSwitcherOpen(false);
        return;
      }

      const targetProfile = profiles.find((profile) => profile.id === profileId);
      setPendingProfileName(targetProfile?.name ?? null);
      setIsProfileSwitcherOpen(false);

      try {
        await switchProfile(profileId);
      } catch (error) {
        setPendingProfileName(null);
        debugError('Failed to switch profile', error);
      }
    },
    [currentProfile, profiles, switchProfile]
  );

  const handleAppContextMenu = useCallback(
    (appId: string, event: MouseEvent) => {
      event.preventDefault();
      const app = workspaceApps.find((entry) => entry.id === appId);
      if (!app) {
        return;
      }

      openAppContextMenu({
        appId,
        appName: app.name,
        x: event.clientX,
        y: event.clientY,
        isMuted: app.audio?.muted ?? false,
      });
    },
    [openAppContextMenu, workspaceApps]
  );

  const handleWorkspaceContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!activeWorkspace) {
        return;
      }

      openWorkspaceContextMenu({
        workspaceId: activeWorkspace.id,
        workspaceName: activeWorkspace.name,
        x: event.clientX,
        y: event.clientY,
      });
    },
    [activeWorkspace, openWorkspaceContextMenu]
  );

  useKeyboardShortcuts([
    {
      key: 'Space',
      modifier: 'ctrlOrMeta',
      action: () => {
        debugLog('Quick launcher shortcut triggered');
      },
      description: 'Open quick launcher',
    },
    {
      key: 'KeyB',
      modifier: 'ctrlOrMeta',
      action: () => setIsWorkspaceSwitcherOpen((prev) => !prev),
      description: 'Toggle workspace switcher',
    },
    {
      key: 'KeyD',
      modifier: 'ctrlOrMeta',
      shiftKey: true,
      action: handleToggleDnd,
      description: 'Toggle Do Not Disturb',
    },
    ...workspaces.slice(0, 9).map((workspace, index) => ({
      key: `Digit${index + 1}`,
      modifier: 'ctrlOrMeta' as const,
      shiftKey: false,
      action: () => setActiveWorkspace(workspace.id),
      description: `Switch to workspace ${index + 1}`,
    })),
  ]);

  const dockPosition = activeWorkspace?.layout.dockPosition || 'left';
  const dockSize = activeWorkspace?.layout.dockSize || 64;

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (workspaces.length === 0) {
    return (
      <WelcomeScreen
        isCreateWorkspaceModalOpen={isCreateWorkspaceModalOpen}
        onOpenCreateWorkspace={() => setIsCreateWorkspaceModalOpen(true)}
        onCloseCreateWorkspace={() => setIsCreateWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <WindowChrome
        currentWorkspace={activeWorkspace?.name || ''}
        currentProfileName={currentProfile?.name || 'Default Profile'}
        onProfileClick={() => setIsProfileSwitcherOpen(true)}
        onSearchClick={() => setIsWorkspaceSwitcherOpen((prev) => !prev)}
        onWorkspaceSwitchClick={() => setIsWorkspaceSwitcherOpen(true)}
        onWorkspaceContextMenu={handleWorkspaceContextMenu}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className="flex-1 flex"
          style={{
            flexDirection: dockPosition === 'top' || dockPosition === 'bottom' ? 'column' : 'row',
          }}
        >
          {(dockPosition === 'top' || dockPosition === 'left') && (
            <Dock
              apps={workspaceApps}
              position={dockPosition}
              size={dockSize}
              activeAppId={activeAppId}
              awakeApps={awakeApps}
              onAppClick={handleSelectApp}
              onAppContextMenu={handleAppContextMenu}
              onAddApp={() => setIsAddAppModalOpen(true)}
              onReorder={handleReorderApps}
            />
          )}

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
              const app = workspaceApps.find((entry) => entry.id === appId);
              if (!app) return;
              setSelectedAppId(app.id);
              setIsAppOptionsModalOpen(true);
            }}
            activeInstances={activeInstances}
            shortcutSignal={shortcutSignal}
            onToggleMute={handleToggleMute}
            layoutMode={layoutMode}
            activeAppIds={activeAppIds}
            onLayoutChange={handleLayoutChange}
          />

          {(dockPosition === 'bottom' || dockPosition === 'right') && (
            <Dock
              apps={workspaceApps}
              position={dockPosition}
              size={dockSize}
              activeAppId={activeAppId}
              awakeApps={awakeApps}
              onAppClick={handleSelectApp}
              onAppContextMenu={handleAppContextMenu}
              onAddApp={() => setIsAddAppModalOpen(true)}
              onReorder={handleReorderApps}
            />
          )}
        </div>
      </div>

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
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentMode={settings?.theme?.mode || 'dark'}
        currentAccentColor={settings?.theme?.accentColor || '#6366f1'}
        currentBackgroundStyle={settings?.theme?.backgroundStyle || 'solid'}
        customPresets={settings?.theme?.customPresets || []}
        onSaveTheme={(themeSettings) => {
          updateSettings({
            theme: themeSettings,
          });
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

      {appContextMenu && (
        <AppContextMenu
          x={appContextMenu.x}
          y={appContextMenu.y}
          appId={appContextMenu.appId}
          appName={appContextMenu.appName}
          onClose={closeAppContextMenu}
          onSettings={() => {
            const app = workspaceApps.find((entry) => entry.id === appContextMenu.appId);
            if (app) {
              setSelectedAppId(app.id);
              setIsAppOptionsModalOpen(true);
            }
            closeAppContextMenu();
          }}
          onHibernate={() => {
            void handleHibernateAppRequest(appContextMenu.appId);
            closeAppContextMenu();
          }}
          onDelete={async () => {
            await deleteApp(appContextMenu.appId);
            if (activeAppId === appContextMenu.appId) {
              setActiveAppId(null);
            }
            closeAppContextMenu();
          }}
          isMuted={appContextMenu.isMuted}
          onToggleMute={(muted) => {
            void handleToggleMute(appContextMenu.appId, muted);
            closeAppContextMenu();
          }}
          onSplitWith={() => {
            handleSplitWith(appContextMenu.appId);
            closeAppContextMenu();
          }}
          onUnsplitAll={() => {
            handleUnsplitAll();
            closeAppContextMenu();
          }}
          isInSplitMode={layoutMode !== 'single' && activeAppIds.length > 1}
        />
      )}

      {workspaceContextMenu && (
        <WorkspaceContextMenu
          x={workspaceContextMenu.x}
          y={workspaceContextMenu.y}
          workspaceId={workspaceContextMenu.workspaceId}
          workspaceName={workspaceContextMenu.workspaceName}
          currentDockPosition={
            workspaces.find((workspace) => workspace.id === workspaceContextMenu.workspaceId)
              ?.layout.dockPosition || 'left'
          }
          onClose={closeWorkspaceContextMenu}
          onDelete={async () => {
            if (workspaces.length > 1) {
              const { deleteWorkspace } = useWorkspaceStore.getState();
              await deleteWorkspace(workspaceContextMenu.workspaceId);
              closeWorkspaceContextMenu();
            } else {
              alert('Cannot delete the last workspace');
            }
          }}
          onHibernate={async () => {
            const appsInWorkspace = apps.filter(
              (app) => app.workspaceId === workspaceContextMenu.workspaceId
            );
            for (const app of appsInWorkspace) {
              if (app.instances.length > 0) {
                await handleHibernateAppRequest(app.id, app.instances[0].id);
              }
            }
            closeWorkspaceContextMenu();
          }}
          onChangeDockPosition={async (position) => {
            const workspace = workspaces.find(
              (entry) => entry.id === workspaceContextMenu.workspaceId
            );
            if (!workspace) return;
            await updateWorkspace(workspaceContextMenu.workspaceId, {
              layout: {
                ...workspace.layout,
                dockPosition: position,
              },
            });
            closeWorkspaceContextMenu();
          }}
          onOpenSettings={() => {
            closeWorkspaceContextMenu();
            setIsWorkspaceSettingsModalOpen(true);
          }}
        />
      )}

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

      <ProfileSwitcherModal
        isOpen={isProfileSwitcherOpen}
        profiles={profiles}
        currentProfileId={currentProfile?.id ?? null}
        isLoading={profileLoading}
        errorMessage={profileError}
        onClose={() => setIsProfileSwitcherOpen(false)}
        onSelectProfile={handleProfileSelect}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <AppOptionsModal
        isOpen={isAppOptionsVisible}
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
            void handleHibernateAppRequest(selectedApp.id, selectedApp.instances[0].id);
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
            void handleToggleMute(selectedApp.id, muted);
          }
        }}
        workspaceIdleTimeMinutes={
          selectedAppWorkspace?.hibernation?.idleTimeMinutes ?? DEFAULTS.IDLE_TIME_MINUTES
        }
        isWorkspaceHibernationEnabled={selectedAppWorkspace?.hibernation?.enabled ?? true}
        onUpdateHibernation={async (minutes) => {
          if (!selectedApp) {
            return;
          }

          if (minutes === null) {
            await handleUpdateApp(selectedApp.id, { hibernation: null });
          } else {
            await handleUpdateApp(selectedApp.id, {
              hibernation: { idleTimeMinutes: minutes },
            });
          }
        }}
      />

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
            void handleUpdateApp(appId, data);
          }}
        />
      )}

      {isSwitchingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-5 text-center space-y-3 shadow-2xl shadow-black/30">
            <p className="text-lg font-semibold text-white">Switching profile…</p>
            <p className="text-sm text-gray-300">
              {pendingProfileName
                ? `Loading ${pendingProfileName} profile`
                : 'Loading selected profile'}
            </p>
            <p className="text-xs text-gray-500">Dockyard will relaunch automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
