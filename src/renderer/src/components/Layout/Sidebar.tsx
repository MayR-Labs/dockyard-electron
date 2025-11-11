/**
 * Sidebar Component
 * Displays workspace list with navigation and creation controls
 * Single Responsibility: Workspace navigation UI
 */

import { Workspace } from '../../../../shared/types/workspace';

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onWorkspaceSelect: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
}

/**
 * Collapsible sidebar for workspace management
 */
export function Sidebar({
  workspaces,
  activeWorkspaceId,
  isOpen,
  onToggle,
  onWorkspaceSelect,
  onCreateWorkspace,
}: SidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 p-2 rounded-r-lg z-10"
        title="Open Sidebar (Ctrl/Cmd+B)"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Sidebar header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className="text-sm font-semibold text-gray-300">Workspaces</h2>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-800 rounded"
          title="Close Sidebar"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Workspace list */}
      <div className="flex-1 overflow-y-auto p-2">
        {workspaces.map((workspace, index) => (
          <button
            key={workspace.id}
            onClick={() => onWorkspaceSelect(workspace.id)}
            className={`
              w-full text-left p-3 rounded-lg mb-2 transition
              ${workspace.id === activeWorkspaceId
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono opacity-60">#{index + 1}</span>
                <span className="font-medium">{workspace.name}</span>
              </div>
              {workspace.id === activeWorkspaceId && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-xs opacity-70">
              {workspace.apps.length} apps • {workspace.sessionMode}
            </div>
          </button>
        ))}
      </div>

      {/* Create workspace button */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={onCreateWorkspace}
          className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Workspace
        </button>
      </div>
    </div>
  );
}
