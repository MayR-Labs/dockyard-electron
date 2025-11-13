/**
 * Navigation Controls Component
 * Provides back, forward, reload, and home navigation controls for apps
 * Single Responsibility: Navigation UI
 */

import { ChevronLeftIcon, ChevronRightIcon, RefreshIcon, HomeIcon } from '../Icons';

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
        <ChevronLeftIcon className="w-4 h-4" />
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
        <ChevronRightIcon className="w-4 h-4" />
      </button>

      {/* Reload Button */}
      <button
        onClick={onReload}
        className={`p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition ${
          isLoading ? 'animate-spin' : ''
        }`}
        title="Reload"
      >
        <RefreshIcon className="w-4 h-4" />
      </button>

      {/* Home Button */}
      <button
        onClick={onHome}
        className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 transition"
        title="Go Home"
      >
        <HomeIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
