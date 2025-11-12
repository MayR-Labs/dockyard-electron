/**
 * Split Layout Component
 * Manages multi-app tiling with resizable panels
 * Single Responsibility: Layout management for multiple apps
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { LayoutMode } from '../../../../shared/types/workspace';

interface SplitLayoutProps {
  apps: App[];
  activeAppIds: string[]; // Array of app IDs to display
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode, panels: { appId: string; size?: number }[]) => void;
}

/**
 * SplitLayout component that displays multiple apps side by side or in a grid
 */
export function SplitLayout({ apps, activeAppIds, layoutMode, onLayoutChange }: SplitLayoutProps) {
  const [panelSizes, setPanelSizes] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize panel sizes equally
    const count = activeAppIds.length;
    if (count > 0) {
      setPanelSizes(new Array(count).fill(100 / count));
    }
  }, [activeAppIds.length]);

  if (activeAppIds.length === 0) {
    return null;
  }

  if (activeAppIds.length === 1 || layoutMode === 'single') {
    // Single app view - shouldn't happen in SplitLayout but handle it gracefully
    const app = apps.find((a) => a.id === activeAppIds[0]);
    const instanceId = app?.instances && app.instances.length > 0 ? app.instances[0].id : undefined;
    
    return (
      <div className="flex-1 bg-gray-900 flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm font-medium text-white">{app?.name}</span>
        </div>
        <SplitPanelBrowserView app={app} instanceId={instanceId} />
      </div>
    );
  }

  const renderSplitView = () => {
    const isHorizontal = layoutMode === 'split-horizontal';
    const flexDirection = isHorizontal ? 'flex-row' : 'flex-col';

    return (
      <div className={`flex ${flexDirection} flex-1 gap-1`}>
        {activeAppIds.map((appId, index) => {
          const app = apps.find((a) => a.id === appId);
          const size = panelSizes[index] || 50;
          const instanceId = app?.instances && app.instances.length > 0 ? app.instances[0].id : undefined;

          return (
            <motion.div
              key={appId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                [isHorizontal ? 'width' : 'height']: `${size}%`,
              }}
              className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm font-medium text-white">{app?.name}</span>
                <button
                  onClick={() => {
                    // Remove this app from the layout
                    const newActiveIds = activeAppIds.filter((id) => id !== appId);
                    if (newActiveIds.length === 0) {
                      onLayoutChange('single', []);
                    } else {
                      onLayoutChange(
                        layoutMode,
                        newActiveIds.map((id) => ({ appId: id }))
                      );
                    }
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                >
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

              {/* Panel Content - BrowserView */}
              <SplitPanelBrowserView app={app} instanceId={instanceId} />

              {/* Resize Handle */}
              {index < activeAppIds.length - 1 && (
                <div
                  className={`absolute ${
                    isHorizontal
                      ? 'right-0 top-0 w-1 h-full cursor-col-resize'
                      : 'bottom-0 left-0 h-1 w-full cursor-row-resize'
                  } bg-gray-700 hover:bg-indigo-500 transition-colors z-10`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startPos = isHorizontal ? e.clientX : e.clientY;
                    const startSizes = [...panelSizes];

                    const handleMouseMove = (e: MouseEvent) => {
                      const currentPos = isHorizontal ? e.clientX : e.clientY;
                      const delta = currentPos - startPos;
                      const containerSize = isHorizontal
                        ? containerRef.current?.offsetWidth || 1
                        : containerRef.current?.offsetHeight || 1;
                      const deltaPercent = (delta / containerSize) * 100;

                      const newSizes = [...startSizes];
                      newSizes[index] = Math.max(
                        10,
                        Math.min(90, startSizes[index] + deltaPercent)
                      );
                      newSizes[index + 1] = Math.max(
                        10,
                        Math.min(90, startSizes[index + 1] - deltaPercent)
                      );

                      setPanelSizes(newSizes);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);

                      // Save layout
                      onLayoutChange(
                        layoutMode,
                        activeAppIds.map((id, i) => ({ appId: id, size: panelSizes[i] }))
                      );
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderGridView = () => {
    const count = activeAppIds.length;
    const cols = Math.ceil(Math.sqrt(count));

    return (
      <div
        className="flex-1 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {activeAppIds.map((appId) => {
          const app = apps.find((a) => a.id === appId);
          const instanceId = app?.instances && app.instances.length > 0 ? app.instances[0].id : undefined;

          return (
            <motion.div
              key={appId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm font-medium text-white">{app?.name}</span>
                <button
                  onClick={() => {
                    const newActiveIds = activeAppIds.filter((id) => id !== appId);
                    if (newActiveIds.length === 0) {
                      onLayoutChange('single', []);
                    } else if (newActiveIds.length === 1) {
                      onLayoutChange(
                        'single',
                        newActiveIds.map((id) => ({ appId: id }))
                      );
                    } else {
                      onLayoutChange(
                        layoutMode,
                        newActiveIds.map((id) => ({ appId: id }))
                      );
                    }
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                >
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

              {/* Panel Content - BrowserView */}
              <SplitPanelBrowserView app={app} instanceId={instanceId} />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-gray-950 p-2">
      {layoutMode === 'grid' ? renderGridView() : renderSplitView()}
    </div>
  );
}

/**
 * BrowserView Container for Split Panel
 * Similar to BrowserViewContainer but optimized for split layout panels
 */
function SplitPanelBrowserView({
  app,
  instanceId,
}: {
  app: App | undefined;
  instanceId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!instanceId || !app) return;

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
  }, [app?.id, instanceId]);

  if (!instanceId || !app) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto opacity-50"
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
          <p className="text-sm font-medium">Loading app...</p>
          {app && <p className="text-xs mt-2">Creating instance for {app.name}</p>}
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
    </div>
  );
}
