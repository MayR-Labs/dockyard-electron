import { useEffect, useState } from 'react';
import { useWorkspaceStore } from './store/workspaces';
import { useAppStore } from './store/apps';
import { useSettingsStore } from './store/settings';

function App() {
  const { loadWorkspaces, workspaces, activeWorkspaceId, createWorkspace } = useWorkspaceStore();
  const { loadApps, apps } = useAppStore();
  const { loadSettings, settings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCreateWorkspace = async () => {
    await createWorkspace({
      name: 'My Workspace',
      layout: {
        dockPosition: 'left',
        dockSize: 60,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚓</div>
          <div className="text-white text-2xl font-semibold">Loading Dockyard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="container mx-auto px-8 py-12 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">⚓</div>
          <h1 className="text-5xl font-bold mb-4">Welcome to Dockyard</h1>
          <p className="text-xl opacity-90">
            Phase 1: MVP - Core Architecture is now live!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold mb-2">{workspaces.length}</div>
            <div className="text-lg opacity-80">Workspaces</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold mb-2">{apps.length}</div>
            <div className="text-lg opacity-80">Apps</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold mb-2">
              {settings?.performance.autoHibernation ? 'On' : 'Off'}
            </div>
            <div className="text-lg opacity-80">Auto-Hibernation</div>
          </div>
        </div>

        {/* Workspaces Section */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold">Your Workspaces</h2>
            <button
              onClick={handleCreateWorkspace}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              + Create Workspace
            </button>
          </div>

          {workspaces.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-50">🗂️</div>
              <p className="text-xl opacity-80 mb-6">No workspaces yet</p>
              <p className="opacity-60">
                Create your first workspace to get started organizing your apps
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`bg-white/10 border-2 rounded-xl p-6 transition cursor-pointer hover:bg-white/20 ${
                    workspace.id === activeWorkspaceId
                      ? 'border-white'
                      : 'border-transparent'
                  }`}
                >
                  <div className="text-2xl font-semibold mb-2">{workspace.name}</div>
                  <div className="text-sm opacity-80">
                    {workspace.apps.length} apps • {workspace.sessionMode} mode
                  </div>
                  {workspace.id === activeWorkspaceId && (
                    <div className="mt-3 inline-block bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 opacity-70 text-sm">
          <p>🚀 Core Architecture Implementation Complete</p>
          <p className="mt-2">
            TypeScript • React • Vite • Zustand • TailwindCSS • Electron
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
