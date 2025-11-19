/**
 * Split With Modal Component
 * Modal for selecting apps and layout for split screen view
 * Single Responsibility: Split screen configuration UI
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { LayoutMode } from '../../../../shared/types/workspace';

interface SplitWithModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: App[];
  currentAppId: string;
  onConfirm: (appIds: string[], layoutMode: LayoutMode) => void;
}

export function SplitWithModal({
  isOpen,
  onClose,
  apps,
  currentAppId,
  onConfirm,
}: SplitWithModalProps) {
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split-horizontal');

  // Filter out current app from available apps
  const availableApps = apps.filter((app) => app.id !== currentAppId);

  // Update layout mode based on total number of apps (including current)
  const totalApps = selectedAppIds.length + 1; // +1 for current app

  // Get available layout modes based on number of apps
  const getAvailableLayouts = (): { mode: LayoutMode; label: string; icon: JSX.Element }[] => {
    const layouts: { mode: LayoutMode; label: string; icon: JSX.Element }[] = [];

    if (totalApps === 2) {
      layouts.push(
        {
          mode: 'split-horizontal',
          label: 'Split Horizontally',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="18" rx="1" strokeWidth="2" />
              <rect x="13" y="3" width="8" height="18" rx="1" strokeWidth="2" />
            </svg>
          ),
        },
        {
          mode: 'split-vertical',
          label: 'Split Vertically',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="8" rx="1" strokeWidth="2" />
              <rect x="3" y="13" width="18" height="8" rx="1" strokeWidth="2" />
            </svg>
          ),
        }
      );
    } else if (totalApps === 3) {
      layouts.push(
        {
          mode: 'split-horizontal',
          label: 'Split Horizontally',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="5" height="18" rx="1" strokeWidth="2" />
              <rect x="9" y="3" width="5" height="18" rx="1" strokeWidth="2" />
              <rect x="16" y="3" width="5" height="18" rx="1" strokeWidth="2" />
            </svg>
          ),
        },
        {
          mode: 'split-vertical',
          label: 'Split Vertically',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="2" width="18" height="5" rx="1" strokeWidth="2" />
              <rect x="3" y="9" width="18" height="5" rx="1" strokeWidth="2" />
              <rect x="3" y="16" width="18" height="5" rx="1" strokeWidth="2" />
            </svg>
          ),
        }
      );
    } else if (totalApps === 4) {
      layouts.push({
        mode: 'grid',
        label: 'Grid (2x2)',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          </svg>
        ),
      });
    }

    return layouts;
  };

  const toggleAppSelection = (appId: string) => {
    if (selectedAppIds.includes(appId)) {
      setSelectedAppIds(selectedAppIds.filter((id) => id !== appId));
    } else if (selectedAppIds.length < 3) {
      // Max 3 additional apps (total 4 with current)
      setSelectedAppIds([...selectedAppIds, appId]);
    }
  };

  const handleConfirm = () => {
    if (selectedAppIds.length > 0) {
      // Include current app as the first app in the split
      const allAppIds = [currentAppId, ...selectedAppIds];
      onConfirm(allAppIds, effectiveLayoutMode);
      // Reset state and close
      setSelectedAppIds([]);
      setLayoutMode('split-horizontal');
      onClose();
    }
  };

  const availableLayouts = getAvailableLayouts();

  // Auto-select first available layout when number of apps changes
  const currentLayoutValid = availableLayouts.find((l) => l.mode === layoutMode);
  const effectiveLayoutMode = currentLayoutValid
    ? layoutMode
    : availableLayouts[0]?.mode || 'split-horizontal';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Split Screen</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Select 1-3 apps to split with ({totalApps - 1} selected)
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* App Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Select Apps</h3>
                {availableApps.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No other apps available in this workspace</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => toggleAppSelection(app.id)}
                        disabled={!selectedAppIds.includes(app.id) && selectedAppIds.length >= 3}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border transition-all
                          ${
                            selectedAppIds.includes(app.id)
                              ? 'bg-indigo-600/20 border-indigo-500'
                              : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                          }
                          ${
                            !selectedAppIds.includes(app.id) && selectedAppIds.length >= 3
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }
                        `}
                      >
                        {app.icon && (
                          <img src={app.icon} alt={app.name} className="w-8 h-8 rounded" />
                        )}
                        {!app.icon && (
                          <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-300">
                              {app.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white">{app.name}</p>
                        </div>
                        {selectedAppIds.includes(app.id) && (
                          <svg
                            className="w-5 h-5 text-indigo-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Layout Selection */}
              {selectedAppIds.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Select Layout</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableLayouts.map((layout) => (
                      <button
                        key={layout.mode}
                        onClick={() => setLayoutMode(layout.mode)}
                        className={`
                          flex flex-col items-center gap-2 p-4 rounded-lg border transition-all
                          ${
                            effectiveLayoutMode === layout.mode
                              ? 'bg-indigo-600/20 border-indigo-500'
                              : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                          }
                        `}
                      >
                        <div
                          className={`
                          ${effectiveLayoutMode === layout.mode ? 'text-indigo-400' : 'text-gray-400'}
                        `}
                        >
                          {layout.icon}
                        </div>
                        <p className="text-sm font-medium text-white">{layout.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedAppIds([]);
                  setLayoutMode('split-horizontal');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedAppIds.length === 0}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Split Screen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
