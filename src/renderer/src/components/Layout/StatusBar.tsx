interface StatusBarProps {
  memoryUsage?: string;
  doNotDisturb: boolean;
  onToggleDnd: () => void;
  onOpenPerformance?: () => void;
  onOpenSessions?: () => void;
}

export function StatusBar({
  memoryUsage,
  doNotDisturb,
  onToggleDnd,
  onOpenPerformance,
  onOpenSessions,
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
