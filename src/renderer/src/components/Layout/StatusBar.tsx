interface StatusBarProps {
  memoryUsage?: string;
  doNotDisturb: boolean;
  onToggleDnd: () => void;
  onOpenPerformance?: () => void;
  onOpenSessions?: () => void;
  onOpenWorkspaceSettings?: () => void;
  onToggleDockyardDevTools?: () => void;
}

export function StatusBar({
  memoryUsage,
  doNotDisturb,
  onToggleDnd,
  onOpenPerformance,
  onOpenSessions,
  onOpenWorkspaceSettings,
  onToggleDockyardDevTools,
}: StatusBarProps) {
  return (
    <div className="h-8 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 text-xs">
      {/* Left: Status info */}
      <div className="flex items-center gap-4 text-gray-400">
        {memoryUsage && (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span>{memoryUsage}</span>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {onOpenWorkspaceSettings && (
          <button
            onClick={onOpenWorkspaceSettings}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:bg-gray-800 transition"
            title="Workspace settings"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.7 2.154a1 1 0 00.95.69h2.262c.969 0 1.371 1.24.588 1.81l-1.832 1.332a1 1 0 00-.364 1.118l.7 2.154c.3.921-.755 1.688-1.54 1.118l-1.832-1.332a1 1 0 00-1.175 0l-1.832 1.332c-.784.57-1.838-.197-1.539-1.118l.7-2.154a1 1 0 00-.364-1.118L4.55 7.58c-.783-.57-.38-1.81.588-1.81H7.4a1 1 0 00.95-.69l.7-2.154z"
              />
            </svg>
            <span>Workspace</span>
          </button>
        )}

        {/* DevTools buttons */}
        {onOpenPerformance && (
          <button
            onClick={onOpenPerformance}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:bg-gray-800 transition"
            title="Performance Monitor"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Performance</span>
          </button>
        )}

        {onOpenSessions && (
          <button
            onClick={onOpenSessions}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:bg-gray-800 transition"
            title="Session Manager"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            <span>Sessions</span>
          </button>
        )}

        {onToggleDockyardDevTools && (
          <button
            onClick={onToggleDockyardDevTools}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:bg-gray-800 transition"
            title="Toggle Dockyard Developer Tools"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 4h4l2 4-2 4H5l-2-4 2-4zm10 0h4l2 4-2 4h-4l-2-4 2-4zm-5 12h4l2 4-2 4h-4l-2-4 2-4z"
              />
            </svg>
            <span>Dockyard DevTools</span>
          </button>
        )}

        <div className="w-px h-4 bg-gray-700" />

        <button
          onClick={onToggleDnd}
          className={`flex items-center gap-1 px-2 py-1 rounded transition ${
            doNotDisturb ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`}
          title="Do Not Disturb (Ctrl/Cmd+Shift+D)"
        >
          {doNotDisturb ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          )}
          <span>{doNotDisturb ? 'DND On' : 'DND Off'}</span>
        </button>
      </div>
    </div>
  );
}
