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
  instances?: AppInstance[];
  activeInstanceId?: string;
  onClose: () => void;
  onNewInstance: () => void;
  onSettings: () => void;
  onHibernate: () => void;
  onDelete: () => void;
  onSelectInstance?: (instanceId: string) => void;
}

/**
 * Context menu with app-related actions (new instance, settings, hibernate, delete)
 */
export function AppContextMenu({
  x,
  y,
  appId,
  appName,
  instances = [],
  activeInstanceId,
  onClose,
  onNewInstance,
  onSettings,
  onHibernate,
  onDelete,
  onSelectInstance,
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

      {instances.length > 1 && (
        <div className="border-b border-gray-700">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-gray-500 mb-1">Instances</p>
            <div className="flex flex-col gap-1">
              {instances.map((instance, index) => {
                const isActiveInstance = instance.id === activeInstanceId;
                return (
                  <button
                    key={instance.id}
                    onClick={() => {
                      onSelectInstance?.(instance.id);
                      onClose();
                    }}
                    className={`w-full px-2 py-1 rounded text-left text-xs flex items-center gap-2 transition ${
                      isActiveInstance
                        ? 'bg-indigo-600/20 text-indigo-200'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {isActiveInstance ? (
                      <svg className="w-3 h-3 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="w-3" />
                    )}
                    <span>
                      {instance.name || `Instance ${index + 1}`}
                      {instance.hibernated && (
                        <span className="ml-1 text-[10px] text-gray-500">(sleeping)</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          onNewInstance();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Duplicate Instance
      </button>

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
