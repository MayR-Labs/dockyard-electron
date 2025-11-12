/**
 * BrowserView Container Component
 * Manages the container where BrowserView is rendered or shows dev mode placeholder
 * Single Responsibility: BrowserView positioning and lifecycle
 */

import { useRef, useEffect } from 'react';
import { App } from '../../../../shared/types/app';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface BrowserViewContainerProps {
  app: App;
  instanceId?: string;
  isAnyModalOpen?: boolean;
  isCreating?: boolean;
}

export function BrowserViewContainer({
  app,
  instanceId,
  isAnyModalOpen = false,
  isCreating = false,
}: BrowserViewContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isElectron() || !instanceId) return;

    // Hide BrowserView if any modal is open
    if (isAnyModalOpen) {
      window.dockyard?.browserView?.hide().catch((error) => {
        console.error('Failed to hide BrowserView:', error);
      });
      return;
    }

    // Show the BrowserView when the container is mounted
    const updateBounds = () => {
      if (containerRef.current && window.dockyard?.browserView && !isAnyModalOpen) {
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
      window.dockyard?.browserView?.hide().catch((error) => {
        console.error('Failed to hide BrowserView:', error);
      });
    };
  }, [app.id, instanceId, isAnyModalOpen]);

  // Show loading state while creating instance
  if (isCreating || !instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto opacity-50 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
