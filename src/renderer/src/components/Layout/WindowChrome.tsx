interface WindowChromeProps {
  currentWorkspace: string;
  currentProfileName: string;
  onProfileClick: () => void;
  onSearchClick: () => void;
  onWorkspaceSwitchClick: () => void;
  onWorkspaceContextMenu?: (e: React.MouseEvent) => void;
  onThemeClick?: () => void;
}

export function WindowChrome({
  currentWorkspace,
  currentProfileName,
  onProfileClick,
  onSearchClick,
  onWorkspaceSwitchClick,
  onWorkspaceContextMenu,
  onThemeClick,
}: WindowChromeProps) {
  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 select-none">
      <div className="flex">
        {/* Profile selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
          >
            <span className="text-sm font-medium text-gray-300">
              {currentProfileName || 'Default Profile'}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Current workspace name with switcher */}
        <button
          onClick={onWorkspaceSwitchClick}
          onContextMenu={(e) => {
            e.preventDefault();
            onWorkspaceContextMenu?.(e);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          <span className="text-sm font-medium text-gray-300">
            {currentWorkspace || 'No Workspace Selected'}
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Right: Search, Theme, and window controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
          title="Quick Launcher (Ctrl/Cmd+Space)"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        {onThemeClick && (
          <button
            onClick={onThemeClick}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
            title="Theme Settings"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
