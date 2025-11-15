/**
 * App Tile Component
 * Displays a single app with navigation controls and toolbar
 * Single Responsibility: Render individual app view
 */

import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { MenuDotsIcon } from '../Icons';
import { NavigationControls } from '../AppControls/NavigationControls';
import { URLBar } from '../AppControls/URLBar';
import { WebViewContainer } from '../Layout/WebViewContainer';
import { useAppInstance } from '../../hooks/useAppInstance';
import { useNavigationState } from '../../hooks/useNavigationState';

interface AppTileProps {
  app: App;
  isActive: boolean;
  onSelect: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  onOpenOptions?: () => void;
}

export function AppTile({ app, isActive, onSelect, onUpdateApp, onOpenOptions }: AppTileProps) {
  // Use custom hooks for instance and navigation management
  const { instanceId, isCreating } = useAppInstance(app, onUpdateApp);
  const { navigationState, goBack, goForward, reload, goHome, navigate } = useNavigationState(
    app,
    instanceId
  );

  // Keep the component mounted but hide it when not active
  // This preserves the webview state instead of destroying it
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col bg-gray-900"
      style={{
        visibility: isActive ? 'visible' : 'hidden',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Options Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenOptions) {
                onOpenOptions();
              }
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Options"
          >
            <MenuDotsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App content area - WebView Container */}
      <WebViewContainer app={app} instanceId={instanceId} isCreating={isCreating} />
    </motion.div>
  );
}
