/**
 * App Context Menu Component
 * Right-click context menu for app actions
 * Single Responsibility: Context menu UI and interactions
 */

import { useEffect, useMemo, useRef } from 'react';

interface AppContextMenuProps {
  x: number;
  y: number;
  appId: string;
  appName: string;
  onClose: () => void;
  onSettings: () => void;
  onHibernate: () => void;
  onDelete: () => void;
  isMuted: boolean;
  onToggleMute: (muted: boolean) => void;
  onSplitWith?: () => void;
  onUnsplitAll?: () => void;
  isInSplitMode?: boolean;
}

/**
 * Context menu with app-related actions (settings, hibernate, delete)
 */
export function AppContextMenu({
  x,
  y,
  appId,
  appName,
  onClose,
  onSettings,
  onHibernate,
  onDelete,
  isMuted,
  onToggleMute,
  onSplitWith,
  onUnsplitAll,
  isInSplitMode = false,
}: AppContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const { left, top } = useMemo(() => {
    const menuWidth = 220; // approximate width in px
    const menuHeight = 220; // approximate height in px
    const padding = 8;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const computedLeft = x + menuWidth + padding > viewportWidth ? x - menuWidth : x;
    const computedTop = y + menuHeight + padding > viewportHeight ? y - menuHeight : y;

    return {
      left: Math.max(padding, computedLeft),
      top: Math.max(padding, computedTop),
    };
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 z-50 min-w-48"
      style={{ left, top }}
      data-app-id={appId}
    >
      <div className="px-3 py-2 border-b border-gray-700">
        <p className="text-xs font-medium text-gray-400 truncate">{appName}</p>
      </div>

      <button
        onClick={() => {
          onSettings();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Options
      </button>

      <button
        onClick={() => {
          onToggleMute(!isMuted);
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v12l-3.75-3.75H5.25A2.25 2.25 0 013 12.75v-1.5A2.25 2.25 0 015.25 9h3L12 5.25V6z"
          />
          {isMuted ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16.5 12l4.5 4.5m0-4.5L16.5 16.5"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16.5 9.75a2.25 2.25 0 010 4.5m1.5-6.75a5.25 5.25 0 010 8.25"
            />
          )}
        </svg>
        {isMuted ? 'Unmute audio' : 'Mute audio'}
      </button>

      <button
        onClick={() => {
          onHibernate();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        Hibernate
      </button>

      <div className="border-t border-gray-700 my-1" />

      {onSplitWith && (
        <button
          onClick={() => {
            onSplitWith();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          Split With...
        </button>
      )}

      {onUnsplitAll && isInSplitMode && (
        <button
          onClick={() => {
            onUnsplitAll();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          </svg>
          Unsplit All
        </button>
      )}

      {(onSplitWith || (onUnsplitAll && isInSplitMode)) && (
        <div className="border-t border-gray-700 my-1" />
      )}

      <button
        onClick={() => {
          if (confirm(`Are you sure you want to delete "${appName}"?`)) {
            onDelete();
            onClose();
          }
        }}
        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete App
      </button>
    </div>
  );
}
