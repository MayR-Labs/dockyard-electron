/**
 * Workspace Canvas Component
 * Displays the main workspace area with app tiles
 * Single Responsibility: Workspace content display
 */

import { App } from '../../../../shared/types/app';
import { NavigationControls } from '../AppControls/NavigationControls';

interface WorkspaceCanvasProps {
  apps: App[];
  activeAppId: string | null;
  onAppSelect: (appId: string) => void;
}

export function WorkspaceCanvas({ apps, activeAppId, onAppSelect }: WorkspaceCanvasProps) {
  if (apps.length === 0) {
    return (
      <div className="flex-1 bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">📱</div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Apps Yet</h3>
          <p className="text-gray-500">Add apps from the dock to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-950 relative">
      {apps.map((app) => (
        <AppTile
          key={app.id}
          app={app}
          isActive={app.id === activeAppId}
          onSelect={() => onAppSelect(app.id)}
        />
      ))}
    </div>
  );
}

interface AppTileProps {
  app: App;
  isActive: boolean;
  onSelect: () => void;
}

function AppTile({ app, isActive, onSelect }: AppTileProps) {
  if (!isActive) return null;

  // Placeholder handlers for navigation controls
  // These will be connected to BrowserView in Phase 2.3
  const handleBack = () => console.log('Navigate back');
  const handleForward = () => console.log('Navigate forward');
  const handleReload = () => console.log('Reload');
  const handleHome = () => console.log('Navigate home');

  return (
    <div 
      className="absolute inset-0 flex flex-col bg-gray-900"
      onClick={onSelect}
    >
      {/* Micro-toolbar */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Navigation Controls */}
          <NavigationControls
            canGoBack={false}
            canGoForward={false}
            isLoading={false}
            onBack={handleBack}
            onForward={handleForward}
            onReload={handleReload}
            onHome={handleHome}
          />
          
          {/* App Info */}
          <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-3">
            {app.icon && (
              <img src={app.icon} alt={app.name} className="w-5 h-5 rounded" />
            )}
            <span className="text-sm font-medium text-gray-300">{app.name}</span>
            {app.instances.length > 1 && (
              <select className="text-xs bg-gray-700 text-gray-300 rounded px-2 py-1 border border-gray-600">
                {app.instances.map((instance, idx) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.name || `Instance ${idx + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Settings"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            title="Close"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* App content area - placeholder for now */}
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{app.name}</h3>
          <p className="text-gray-500 text-sm mb-4">{app.url}</p>
          <p className="text-xs text-gray-400 mb-2">
            App embedding will be implemented with BrowserView
          </p>
          <p className="text-xs text-gray-500">
            Navigation controls are ready for BrowserView integration
          </p>
        </div>
      </div>
    </div>
  );
}
