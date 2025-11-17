/**
 * Dock Component
 * Displays app icons in a customizable dock (top, bottom, left, or right)
 * Single Responsibility: App icon display and interaction
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';

interface DockProps {
  apps: App[];
  position: 'top' | 'bottom' | 'left' | 'right';
  size: number;
  activeAppId: string | null;
  onAppClick: (appId: string) => void;
  onAppContextMenu: (appId: string, e: React.MouseEvent) => void;
  onAddApp: () => void;
  onReorder?: (appId: string, targetIndex: number) => void;
  awakeApps?: Record<string, boolean>;
}

/**
 * Dock component that displays app icons with configurable positioning
 */
export function Dock({
  apps,
  position,
  size,
  activeAppId,
  onAppClick,
  onAppContextMenu,
  onAddApp,
  onReorder,
  awakeApps,
}: DockProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isHorizontal = position === 'top' || position === 'bottom';

  const dockStyle = isHorizontal
    ? { height: `${size}px`, width: '100%' }
    : { width: `${size}px`, height: '100%' };

  const containerClass = `bg-gray-900 border-gray-800 flex ${
    isHorizontal ? 'flex-row border-t overflow-x-auto' : 'flex-col border-r overflow-y-auto'
  } items-center ${isHorizontal ? 'px-2 gap-2' : 'py-2 gap-2'}`;

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const draggedAppId = e.dataTransfer.getData('application/dockyard-app-id');
    if (draggedAppId && onReorder) {
      onReorder(draggedAppId, targetIndex);
    }
  };

  return (
    <div style={dockStyle} className={containerClass}>
      {apps.map((app, index) => (
        <div
          key={app.id}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          className={`relative ${
            dragOverIndex === index
              ? isHorizontal
                ? 'border-l-2 border-indigo-500'
                : 'border-t-2 border-indigo-500'
              : ''
          }`}
        >
          <DockIcon
            app={app}
            isActive={app.id === activeAppId}
            isAwake={!!awakeApps?.[app.id]}
            onClick={() => onAppClick(app.id)}
            onContextMenu={(e) => onAppContextMenu(app.id, e)}
          />
        </div>
      ))}

      {/* Add App Button */}
      <button
        onClick={onAddApp}
        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 transition border border-gray-700 hover:border-gray-600"
        title="Add App"
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

interface DockIconProps {
  app: App;
  isActive: boolean;
  isAwake: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

/**
 * Individual dock icon component with tooltip and instance badge
 */
function DockIcon({ app, isActive, isAwake, onClick, onContextMenu }: DockIconProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/dockyard-app-id', app.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative group"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: isDragging ? 0.5 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`
          w-12 h-12 rounded-xl transition-all duration-200
          flex items-center justify-center
          ${
            isActive
              ? 'bg-indigo-600 ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/50'
              : 'bg-gray-800 hover:bg-gray-700'
          }
          ${isAwake ? '' : 'opacity-60'}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        title={app.name}
      >
        {app.icon ? (
          <img
            src={app.icon}
            alt={app.name}
            className={`w-8 h-8 rounded ${isAwake ? '' : 'grayscale saturate-0 opacity-60'}`}
          />
        ) : (
          <span className={`text-xl ${isAwake ? '' : 'text-gray-400'}`}>
            {app.name.charAt(0).toUpperCase()}
          </span>
        )}
      </motion.button>

        {/* Running indicator */}
        <div className="absolute inset-x-0 -bottom-1 flex justify-center">
          <span
            className={`h-1.5 w-4 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-white'
                : isAwake
                  ? 'bg-emerald-400/80'
                  : 'bg-gray-500/30'
            }`}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 left-full ml-2 shadow-xl">
          {app.name}
        </div>
      </motion.div>
    </div>
  );
}
