/**
 * App Context Menu Component
 * Right-click context menu for app actions
 * Single Responsibility: Context menu UI and interactions
 */

import { useEffect, useMemo, useRef } from 'react';
import { AppInstance } from '../../../../shared/types/app';

interface AppContextMenuProps {
  x: number;
  y: number;
  appId: string;
  appName: string;
  onClose: () => void;
  onSettings: () => void;
  onHibernate: () => void;
  onDelete: () => void;
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
