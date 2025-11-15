/**
 * Workspace Context Menu Component
 * Right-click context menu for workspace actions
 * Single Responsibility: Context menu UI and interactions
 */

import { useEffect, useRef } from 'react';

interface WorkspaceContextMenuProps {
  x: number;
  y: number;
  workspaceId: string;
  workspaceName: string;
  currentDockPosition: 'top' | 'bottom' | 'left' | 'right';
  onClose: () => void;
  onDelete: () => void;
  onHibernate: () => void;
  onChangeDockPosition: (position: 'top' | 'bottom' | 'left' | 'right') => void;
}

/**
 * Context menu with workspace-related actions (delete, hibernate, dock position)
 */
export function WorkspaceContextMenu({
  x,
  y,
  workspaceId,
  workspaceName,
  currentDockPosition,
  onClose,
  onDelete,
  onHibernate,
  onChangeDockPosition,
}: WorkspaceContextMenuProps) {
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

  const dockPositions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'left', 'right', 'bottom'];

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 z-50 min-w-48"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-2 border-b border-gray-700">
        <p className="text-xs font-medium text-gray-400 truncate">{workspaceName}</p>
      </div>

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
        Hibernate All Apps
      </button>

      <div className="border-t border-gray-700 my-1" />

      <div className="px-3 py-1">
        <p className="text-xs font-medium text-gray-400 mb-1">Dock Position</p>
      </div>

      {dockPositions.map((position) => (
        <button
          key={position}
          onClick={() => {
            onChangeDockPosition(position);
            onClose();
          }}
          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 ${
            position === currentDockPosition ? 'text-indigo-400' : 'text-gray-300'
          }`}
        >
          {position === currentDockPosition && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {position === currentDockPosition ? '' : <span className="w-4" />}
          <span className="capitalize">{position}</span>
        </button>
      ))}

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={() => {
          if (confirm(`Are you sure you want to delete "${workspaceName}"?`)) {
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
        Delete Workspace
      </button>
    </div>
  );
}
