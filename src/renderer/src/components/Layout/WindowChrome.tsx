interface WindowChromeProps {
  currentWorkspace: string;
  currentProfileName: string;
  onProfileClick: () => void;
  onSearchClick: () => void;
  onWorkspaceSwitchClick: () => void;
  onWorkspaceContextMenu?: (e: React.MouseEvent) => void;
  onSettingsClick?: () => void;
}

export function WindowChrome({
  currentWorkspace,
  currentProfileName,
  onProfileClick,
  onSearchClick,
  onWorkspaceSwitchClick,
  onWorkspaceContextMenu,
  onSettingsClick,
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
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
            title="Settings"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
