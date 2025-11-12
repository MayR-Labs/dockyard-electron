/**
 * Workspace Canvas Component
 * Displays the main workspace area with app tiles
 * Single Responsibility: Workspace content display
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { LayoutMode } from '../../../../shared/types/workspace';
import { NavigationControls } from '../AppControls/NavigationControls';
import { URLBar } from '../AppControls/URLBar';
import { ZoomControls } from '../AppControls/ZoomControls';
import { LayoutControls } from './LayoutControls';
import { SplitLayout } from './SplitLayout';
import { QuickStartGuide } from './QuickStartGuide';

interface WorkspaceCanvasProps {
  apps: App[];
  activeAppId: string | null;
  onAppSelect: (appId: string) => void;
  onAddSampleApps?: () => void;
  onAddCustomApp?: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
}

export function WorkspaceCanvas({ 
  apps, 
  activeAppId, 
  onAppSelect,
  onAddSampleApps,
  onAddCustomApp,
  onUpdateApp
}: WorkspaceCanvasProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [activeAppIds, setActiveAppIds] = useState<string[]>([]);

  if (apps.length === 0) {
    return (
      <QuickStartGuide 
        onAddSampleApps={onAddSampleApps || (() => {})}
        onAddCustomApp={onAddCustomApp || (() => {})}
      />
    );
  }

  const handleLayoutChange = (mode: LayoutMode, panels?: { appId: string; size?: number }[]) => {
    setLayoutMode(mode);
    if (panels && panels.length > 0) {
      setActiveAppIds(panels.map(p => p.appId));
    }
  };

  const handleAddToLayout = (appId: string) => {
    if (!activeAppIds.includes(appId)) {
      const newIds = [...activeAppIds, appId];
      setActiveAppIds(newIds);
      
      // Auto-switch to split layout if adding second app
      if (newIds.length === 2 && layoutMode === 'single') {
        setLayoutMode('split-horizontal');
      }
    }
  };

  // If in multi-app layout mode, use SplitLayout
  if (layoutMode !== 'single' && activeAppIds.length > 1) {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col">
        {/* Layout Toolbar */}
        <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <LayoutControls
            currentMode={layoutMode}
            onModeChange={(mode) => setLayoutMode(mode)}
          />
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{activeAppIds.length} apps displayed</span>
          </div>
        </div>

        <SplitLayout
          apps={apps}
          activeAppIds={activeAppIds}
          layoutMode={layoutMode}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    );
  }

  const activeApp = apps.find(app => app.id === activeAppId);

  return (
    <div className="flex-1 bg-gray-950 relative flex flex-col">
      {/* Layout Controls Bar */}
      {apps.length > 1 && (
        <div className="h-10 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <LayoutControls
            currentMode={layoutMode}
            onModeChange={(mode) => {
              if (mode !== 'single' && activeAppId) {
                // Start with current active app
                setActiveAppIds([activeAppId]);
                setLayoutMode(mode);
              }
            }}
          />
          
          {apps.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Add to layout:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddToLayout(e.target.value);
                  }
                }}
                value=""
                className="text-xs bg-gray-800 text-gray-300 rounded px-2 py-1 border border-gray-700"
              >
                <option value="">Select app...</option>
                {apps
                  .filter(app => !activeAppIds.includes(app.id))
                  .map(app => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeApp && (
            <AppTile
              key={activeApp.id}
              app={activeApp}
              isActive={true}
              onSelect={() => onAppSelect(activeApp.id)}
              onUpdateApp={onUpdateApp}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface AppTileProps {
  app: App;
  isActive: boolean;
  onSelect: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
}

function AppTile({ app, isActive, onSelect, onUpdateApp }: AppTileProps) {
  if (!isActive) return null;

  const [zoomLevel, setZoomLevel] = useState(app.display?.zoomLevel || 1.0);
  const [navigationState, setNavigationState] = useState({
    canGoBack: false,
    canGoForward: false,
    isLoading: false,
    url: app.url,
  });

  // Get the first instance for now (TODO: handle multiple instances)
  const instanceId = app.instances[0]?.id;

  // Poll navigation state
  useEffect(() => {
    const interval = setInterval(async () => {
      if (instanceId) {
        try {
          const state = await window.dockyard.browserView.getState(app.id, instanceId);
          setNavigationState(state);
        } catch (error) {
          console.error('Failed to get navigation state:', error);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [app.id, instanceId]);

  // Navigation handlers
  const handleBack = async () => {
    if (instanceId) {
      await window.dockyard.browserView.goBack(app.id, instanceId);
    }
  };

  const handleForward = async () => {
    if (instanceId) {
      await window.dockyard.browserView.goForward(app.id, instanceId);
    }
  };

  const handleReload = async () => {
    if (instanceId) {
      await window.dockyard.browserView.reload(app.id, instanceId);
    }
  };

  const handleHome = async () => {
    if (instanceId) {
      await window.dockyard.browserView.navigate(app.id, instanceId, app.url);
    }
  };

  const handleNavigate = async (url: string) => {
    if (instanceId) {
      await window.dockyard.browserView.navigate(app.id, instanceId, url);
    }
  };

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
            onBack={handleBack}
            onForward={handleForward}
            onReload={handleReload}
            onHome={handleHome}
          />
          
          {/* URL Bar */}
          <URLBar
            url={navigationState.url || app.url}
            isLoading={navigationState.isLoading}
            onNavigate={handleNavigate}
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
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <ZoomControls
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
          />
          
          <button
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Settings"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* App content area - BrowserView Container */}
      <BrowserViewContainer app={app} instanceId={instanceId} />
    </motion.div>
  );
}

/**
 * BrowserView Container
 * Manages the container where the BrowserView will be rendered
 */
function BrowserViewContainer({ app, instanceId }: { app: App; instanceId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!instanceId) return;

    // Show the BrowserView when the container is mounted
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const bounds = {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        window.dockyard.browserView.show(app.id, instanceId, bounds).catch((error) => {
          console.error('Failed to show BrowserView:', error);
        });
      }
    };

    // Initial bounds update
    updateBounds();

    // Update bounds on window resize
    const handleResize = () => {
      updateBounds();
    };

    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver for more accurate container size tracking
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(updateBounds);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      // Hide the BrowserView when component unmounts
      window.dockyard.browserView.hide().catch((error) => {
        console.error('Failed to hide BrowserView:', error);
      });
    };
  }, [app.id, instanceId]);

  if (!instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <p>No instance available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-gray-900 relative"
      style={{ minHeight: 0 }} // Important for flex layout
    >
      {/* The BrowserView will be rendered here by Electron */}
      {/* This div serves as a size reference for positioning the BrowserView */}
    </div>
  );
}
