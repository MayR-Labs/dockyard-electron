/**
 * Workspace Canvas Component
 * Displays the main workspace area with app tiles
 * Single Responsibility: Workspace content display and layout orchestration
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { LayoutMode } from '../../../../shared/types/workspace';
import { LayoutControls } from './LayoutControls';
import { SplitLayout } from './SplitLayout';
import { QuickStartGuide } from './QuickStartGuide';
import { AppTile } from '../App/AppTile';
import { isElectron } from '../../utils/environment';

interface WorkspaceCanvasProps {
  apps: App[];
  activeAppId: string | null;
  onAppSelect: (appId: string) => void;
  onAddSampleApps?: () => void;
  onAddCustomApp?: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  onOpenOptions?: (appId: string) => void;
  isAnyModalOpen?: boolean;
}

export function WorkspaceCanvas({
  apps,
  activeAppId,
  onAppSelect,
  onAddSampleApps,
  onAddCustomApp,
  onUpdateApp,
  onOpenOptions,
  isAnyModalOpen = false,
}: WorkspaceCanvasProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [activeAppIds, setActiveAppIds] = useState<string[]>([]);

  // Hide BrowserView when any modal is open (only in Electron)
  useEffect(() => {
    if (isElectron() && isAnyModalOpen && window.dockyard?.browserView) {
      window.dockyard.browserView.hide().catch((error) => {
        console.error('Failed to hide BrowserView:', error);
      });
    }
  }, [isAnyModalOpen]);

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
      setActiveAppIds(panels.map((p) => p.appId));
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
          <LayoutControls currentMode={layoutMode} onModeChange={(mode) => setLayoutMode(mode)} />

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

  const activeApp = apps.find((app) => app.id === activeAppId);

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
                  .filter((app) => !activeAppIds.includes(app.id))
                  .map((app) => (
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
              onOpenOptions={() => onOpenOptions?.(activeApp.id)}
              isAnyModalOpen={isAnyModalOpen}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
