/**
 * Navigation Controls Component
 * Provides back, forward, reload, and home navigation controls for apps
 * Single Responsibility: Navigation UI
 */

interface NavigationControlsProps {
  canGoBack?: boolean;
  canGoForward?: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
}

export function NavigationControls({
  canGoBack = false,
  canGoForward = false,
  isLoading = false,
  onBack,
  onForward,
  onReload,
  onHome,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center gap-1 px-2">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`p-2 rounded-lg transition ${
          canGoBack ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-600 cursor-not-allowed'
        }`}
        title="Go Back"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Forward Button */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`p-2 rounded-lg transition ${
          canGoForward ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-600 cursor-not-allowed'
        }`}
        title="Go Forward"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Reload Button */}
      <button
        onClick={onReload}
        className={`p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition ${
          isLoading ? 'animate-spin' : ''
        }`}
        title="Reload"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Home Button */}
      <button
        onClick={onHome}
        className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition"
        title="Go Home"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
    </div>
  );
}
