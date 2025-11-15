/**
 * BrowserView Container Component
 * Manages the container where BrowserView is rendered or shows dev mode placeholder
 * Single Responsibility: BrowserView positioning and lifecycle
 *
 * ARCHITECTURE NOTE:
 * BrowserView is rendered by Electron at the OS window level, NOT in the DOM.
 * This means it always appears "on top" of React components, regardless of z-index.
 * To show modals/menus/overlays, we must HIDE the BrowserView temporarily.
 * This is handled by useModalBrowserViewManager hook in App.tsx.
 *
 * The bounds calculated here determine where the BrowserView appears within the window,
 * but it will always render above DOM elements in that area.
 */

import { useRef, useEffect } from 'react';
import { App } from '../../../../shared/types/app';
import { LoadingIcon } from '../Icons';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface BrowserViewContainerProps {
  app: App;
  instanceId?: string;
  isCreating?: boolean;
}

export function BrowserViewContainer({
  app,
  instanceId,
  isCreating = false,
}: BrowserViewContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isElectron() || !instanceId || !containerRef.current) return;

    // Check if window.dockyard is available
    if (!window.dockyard || !window.dockyard.browserView) {
      console.error('Dockyard API not available. Preload script may not be loaded.');
      return;
    }

    // Show the BrowserView when the container is mounted
    const updateBounds = () => {
      if (containerRef.current && window.dockyard?.browserView) {
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

    // Apply zoom level if set
    if (app.display?.zoomLevel) {
      window.dockyard.browserView
        .setZoom(app.id, instanceId, app.display.zoomLevel)
        .catch((error) => {
          console.error('Failed to set zoom level:', error);
        });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [app.id, app.display?.zoomLevel, instanceId]);

  // Update zoom level when it changes
  useEffect(() => {
    if (!isElectron() || !instanceId || !app.display?.zoomLevel) return;

    if (window.dockyard?.browserView) {
      window.dockyard.browserView
        .setZoom(app.id, instanceId, app.display.zoomLevel)
        .catch((error) => {
          console.error('Failed to update zoom level:', error);
        });
    }
  }, [app.id, instanceId, app.display?.zoomLevel]);

  // Show loading state while creating instance
  if (isCreating || !instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="mb-4 flex justify-center">
            <LoadingIcon className="w-16 h-16 opacity-50 animate-spin" />
          </div>
          <p className="text-lg font-medium">Loading app...</p>
          <p className="text-sm mt-2">Creating instance for {app.name}</p>
          <p className="text-xs mt-4 text-gray-500">If this persists, try reloading the app</p>
        </div>
      </div>
    );
  }

  // Show browser dev mode placeholder when not in Electron
  if (!isElectron()) {
    return <BrowserDevPlaceholder appName={app.name} appUrl={app.url} appIcon={app.icon} />;
  }

  // Electron environment: render container for BrowserView
  return (
    <div ref={containerRef} className="flex-1 bg-gray-900 relative" style={{ minHeight: 0 }}>
      {/* The BrowserView will be rendered here by Electron */}
    </div>
  );
}
