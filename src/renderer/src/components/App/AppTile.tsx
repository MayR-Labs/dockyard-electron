/**
 * App Tile Component
 * Displays a single app with navigation controls and toolbar
 * Single Responsibility: Render individual app view
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { NavigationControls } from '../AppControls/NavigationControls';
import { URLBar } from '../AppControls/URLBar';
import { ZoomControls } from '../AppControls/ZoomControls';
import { BrowserViewContainer } from '../Layout/BrowserViewContainer';
import { useAppInstance } from '../../hooks/useAppInstance';
import { useNavigationState } from '../../hooks/useNavigationState';

interface AppTileProps {
  app: App;
  isActive: boolean;
  onSelect: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  isAnyModalOpen?: boolean;
}

export function AppTile({
  app,
  isActive,
  onSelect,
  onUpdateApp,
  isAnyModalOpen = false,
}: AppTileProps) {
  if (!isActive) return null;

  const [zoomLevel, setZoomLevel] = useState(app.display?.zoomLevel || 1.0);

  // Use custom hooks for instance and navigation management
  const { instanceId, isCreating } = useAppInstance(app, onUpdateApp);
  const { navigationState, goBack, goForward, reload, goHome, navigate } = useNavigationState(
    app,
    instanceId
  );

  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
    if (onUpdateApp) {
      onUpdateApp(app.id, {
        display: {
          zoomLevel: level,
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col bg-gray-900"
      onClick={onSelect}
    >
      {/* Micro-toolbar */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Navigation Controls */}
          <NavigationControls
            canGoBack={navigationState.canGoBack}
            canGoForward={navigationState.canGoForward}
            isLoading={navigationState.isLoading}
            onBack={goBack}
            onForward={goForward}
            onReload={reload}
            onHome={goHome}
          />

          {/* URL Bar */}
          <URLBar
            url={navigationState.url || app.url}
            isLoading={navigationState.isLoading}
            onNavigate={navigate}
          />

          {/* App Info */}
          <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-3">
            {app.icon && <img src={app.icon} alt={app.name} className="w-5 h-5 rounded" />}
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

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <ZoomControls zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />

          <button className="p-1 hover:bg-gray-700 rounded transition-colors" title="Settings">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-700 rounded transition-colors" title="Close">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* App content area - BrowserView Container */}
      <BrowserViewContainer
        app={app}
        instanceId={instanceId}
        isAnyModalOpen={isAnyModalOpen}
        isCreating={isCreating}
      />
    </motion.div>
  );
}
