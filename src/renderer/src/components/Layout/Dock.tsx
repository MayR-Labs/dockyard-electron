/**
 * Dock Component
 * Displays app icons in a customizable dock (top, bottom, left, or right)
 * Single Responsibility: App icon display and interaction
 */

import { App } from '../../../../shared/types/app';

interface DockProps {
  apps: App[];
  position: 'top' | 'bottom' | 'left' | 'right';
  size: number;
  activeAppId: string | null;
  onAppClick: (appId: string) => void;
  onAppContextMenu: (appId: string, e: React.MouseEvent) => void;
  onAddApp: () => void;
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
}: DockProps) {
  const isHorizontal = position === 'top' || position === 'bottom';
  
  const dockStyle = isHorizontal
    ? { height: `${size}px`, width: '100%' }
    : { width: `${size}px`, height: '100%' };

  const containerClass = `bg-gray-900 border-gray-800 flex ${
    isHorizontal ? 'flex-row border-t' : 'flex-col border-r'
  } items-center ${isHorizontal ? 'px-2 gap-2' : 'py-2 gap-2'}`;

  return (
    <div style={dockStyle} className={containerClass}>
      {apps.map((app) => (
        <DockIcon
          key={app.id}
          app={app}
          isActive={app.id === activeAppId}
          onClick={() => onAppClick(app.id)}
          onContextMenu={(e) => onAppContextMenu(app.id, e)}
        />
      ))}
      
      {/* Add App Button */}
      <button
        onClick={onAddApp}
        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 transition border border-gray-700 hover:border-gray-600"
        title="Add App"
      >
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

interface DockIconProps {
  app: App;
  isActive: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

/**
 * Individual dock icon component with tooltip and instance badge
 */
function DockIcon({ app, isActive, onClick, onContextMenu }: DockIconProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`
          w-12 h-12 rounded-xl transition
          flex items-center justify-center
          ${isActive 
            ? 'bg-indigo-600 ring-2 ring-indigo-400' 
            : 'bg-gray-800 hover:bg-gray-700'
          }
        `}
        title={app.name}
      >
        {app.icon ? (
          <img src={app.icon} alt={app.name} className="w-8 h-8 rounded" />
        ) : (
          <span className="text-xl">{app.name.charAt(0).toUpperCase()}</span>
        )}
      </button>
      
      {/* Badge for multiple instances */}
      {app.instances.length > 1 && (
        <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {app.instances.length}
        </span>
      )}
      
      {/* Tooltip */}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 left-full ml-2">
        {app.name}
      </div>
    </div>
  );
}
