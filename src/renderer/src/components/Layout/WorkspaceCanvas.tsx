/**
 * Workspace Canvas Component
 * Displays the main workspace area with app tiles
 * Single Responsibility: Workspace content display and layout orchestration
 */

import { useState, useEffect } from 'react';
import { App } from '../../../../shared/types/app';
import { LayoutMode } from '../../../../shared/types/workspace';
import { SplitLayout } from './SplitLayout';
import { QuickStartGuide } from './QuickStartGuide';
import { AppTile } from '../App/AppTile';
import { EmptyWorkspaceState } from './EmptyWorkspaceState';
import type { AppShortcutSignal } from '../../types/shortcuts';

interface WorkspaceCanvasProps {
  apps: App[];
  activeAppId: string | null;
  onAppSelect: (appId: string) => void;
  awakeApps: Record<string, boolean>;
  onWakeApp: (appId: string) => void;
  onAddSampleApps?: () => void;
  onAddCustomApp?: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  onOpenOptions?: (appId: string) => void;
  activeInstances?: Record<string, string>;
  shortcutSignal?: AppShortcutSignal | null;
  onToggleMute?: (appId: string, muted: boolean, instanceId?: string) => void;
  layoutMode?: LayoutMode;
  activeAppIds?: string[];
  onLayoutChange?: (mode: LayoutMode, panels: { appId: string; size?: number }[]) => void;
}

export function WorkspaceCanvas({
  apps,
  activeAppId,
  onAppSelect,
  awakeApps,
  onWakeApp,
  onAddSampleApps,
  onAddCustomApp,
  onUpdateApp,
  onOpenOptions,
  activeInstances,
  shortcutSignal,
  onToggleMute,
  layoutMode: externalLayoutMode,
  activeAppIds: externalActiveAppIds,
  onLayoutChange: externalOnLayoutChange,
}: WorkspaceCanvasProps) {
  // Use external state if provided, otherwise use internal state
  const [internalLayoutMode, setInternalLayoutMode] = useState<LayoutMode>('single');
  const [internalActiveAppIds, setInternalActiveAppIds] = useState<string[]>([]);

  const layoutMode = externalLayoutMode !== undefined ? externalLayoutMode : internalLayoutMode;
  const activeAppIds =
    externalActiveAppIds !== undefined ? externalActiveAppIds : internalActiveAppIds;

  // Ensure there is always a selected app when apps exist
  useEffect(() => {
    if (!activeAppId && apps.length > 0) {
      onAppSelect(apps[0].id);
    }
  }, [activeAppId, apps, onAppSelect]);

  if (apps.length === 0) {
    return (
      <QuickStartGuide
        onAddSampleApps={onAddSampleApps || (() => {})}
        onAddCustomApp={onAddCustomApp || (() => {})}
      />
    );
  }

  const handleLayoutChange = (mode: LayoutMode, panels?: { appId: string; size?: number }[]) => {
    if (externalOnLayoutChange) {
      externalOnLayoutChange(mode, panels || []);
    } else {
      setInternalLayoutMode(mode);
      if (panels && panels.length > 0) {
        setInternalActiveAppIds(panels.map((p) => p.appId));
      }
    }
  };

  // If in multi-app layout mode, use SplitLayout
  if (layoutMode !== 'single' && activeAppIds.length > 1) {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col">
        <SplitLayout
          apps={apps}
          activeAppIds={activeAppIds}
          layoutMode={layoutMode}
          onLayoutChange={handleLayoutChange}
          resolveInstanceId={(appId) => activeInstances?.[appId]}
        />
      </div>
    );
  }

  const activeAppExists = activeAppId ? apps.some((app) => app.id === activeAppId) : false;
  const resolvedActiveAppId = activeAppExists ? activeAppId : null;

  return (
    <div className="flex-1 bg-gray-950 relative flex flex-col">
      <div className="flex-1 relative">
        {apps.map((app) => {
          const persistedAwake = app.instances.some((instance) => !instance.hibernated);
          const transientAwake = awakeApps[app.id];
          const isAwake = typeof transientAwake === 'boolean' ? transientAwake : persistedAwake;

          return (
            <AppTile
              key={app.id}
              app={app}
              isActive={resolvedActiveAppId === app.id}
              isAwake={isAwake}
              onSelect={() => onAppSelect(app.id)}
              onWakeApp={() => onWakeApp(app.id)}
              onUpdateApp={onUpdateApp}
              activeInstanceId={activeInstances?.[app.id]}
              onOpenOptions={() => onOpenOptions?.(app.id)}
              shortcutSignal={shortcutSignal}
              onToggleMute={onToggleMute}
            />
          );
        })}

        {!resolvedActiveAppId && apps.length > 0 && (
          <EmptyWorkspaceState
            apps={apps}
            onSelectApp={onAppSelect}
            onAddCustomApp={onAddCustomApp}
          />
        )}
      </div>
    </div>
  );
}
