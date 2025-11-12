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
    // Single app view
    const app = apps.find((a) => a.id === activeAppIds[0]);
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{app?.name}</h3>
          <p className="text-gray-400">App content will be displayed here</p>
        </div>
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

              {/* Panel Content */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">
                    {app?.icon ? (
                      <img src={app.icon} alt={app.name} className="w-16 h-16 mx-auto rounded-lg" />
                    ) : (
                      <span>{app?.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{app?.url}</p>
                  <p className="text-gray-500 text-xs mt-2">App embedding coming soon...</p>
                </div>
              </div>

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

              {/* Panel Content */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {app?.icon ? (
                      <img src={app.icon} alt={app.name} className="w-12 h-12 mx-auto rounded-lg" />
                    ) : (
                      <span>{app?.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">{app?.url}</p>
                </div>
              </div>
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
