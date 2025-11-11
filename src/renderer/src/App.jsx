import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AppDock } from './components/AppDock/AppDock';
import { WorkspaceSwitcher } from './components/Workspace/WorkspaceSwitcher';
import { EmptyState } from './components/Common/EmptyState';

function App() {
  const {
    profile,
    currentWorkspace,
    apps,
    isLoading,
    loadProfile,
    loadWorkspaces,
    setLoading,
  } = useStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadProfile();
        await loadWorkspaces();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [loadProfile, loadWorkspaces, setLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⚓</div>
          <div className="text-xl font-semibold">Loading Dockyard...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl font-semibold">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-gray-900">
      {/* App Dock - Left Sidebar */}
      <AppDock />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Workspace Switcher - Top Bar */}
        <WorkspaceSwitcher />

        {/* Content - BrowserView will be rendered here by Electron */}
        <div className="flex-1 relative">
          {!currentWorkspace && (
            <EmptyState
              icon="🏠"
              title="No Workspace Selected"
              message="Create a workspace to get started"
            />
          )}
          {currentWorkspace && apps.length === 0 && (
            <EmptyState
              icon="➕"
              title="No Apps Yet"
              message="Add your first app to this workspace"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
