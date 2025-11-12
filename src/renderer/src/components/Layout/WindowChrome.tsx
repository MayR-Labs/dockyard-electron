interface WindowChromeProps {
  currentWorkspace: string;
  onProfileClick: () => void;
  onSearchClick: () => void;
}

export function WindowChrome({
  currentWorkspace,
  onProfileClick,
  onSearchClick,
}: WindowChromeProps) {
  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 select-none">
      {/* Left: Profile selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          <span className="text-sm font-medium text-gray-300">Default Profile</span>
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

      {/* Center: Current workspace name */}
      <div className="text-sm font-medium text-gray-300">
        {currentWorkspace || 'No Workspace Selected'}
      </div>

      {/* Right: Search and window controls */}
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
      </div>
    </div>
  );
}
