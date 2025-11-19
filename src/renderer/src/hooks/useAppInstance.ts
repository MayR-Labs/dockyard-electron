/**
 * Hook for managing app instances
 * Single Responsibility: Handle instance creation and state
 */

import { useState, useEffect, useMemo } from 'react';
import { App } from '../../../shared/types/app';
import { debugError, debugLog, debugWarn } from '../../../shared/utils/debug';

export function useAppInstance(
  app: App,
  preferredInstanceId?: string,
  onUpdateApp?: (id: string, data: Partial<App>) => void
): {
  instanceId: string | undefined;
  isCreating: boolean;
} {
  const [isCreating, setIsCreating] = useState(false);
  const instanceId = useMemo(() => {
    if (!app.instances || app.instances.length === 0) {
      return undefined;
    }

    if (preferredInstanceId && app.instances.some((inst) => inst.id === preferredInstanceId)) {
      return preferredInstanceId;
    }

    return app.instances[0].id;
  }, [app.instances, preferredInstanceId]);

  useEffect(() => {
    const createInstance = async () => {
      if (!instanceId && !isCreating && onUpdateApp && app.instances.length === 0) {
        setIsCreating(true);
        debugLog('Creating default instance for app', { appId: app.id, appName: app.name });

        // Use the API to create instance with proper partition
        try {
          if (window.dockyard?.apps?.createInstance) {
            const newInstance = await window.dockyard.apps.createInstance(app.id, {
              sessionMode: 'isolated',
            });

            await onUpdateApp(app.id, {
              instances: [newInstance],
            });
            debugLog('Successfully created instance', { appId: app.id, instanceId: newInstance.id });
          } else {
            debugWarn('Instance creation API not available');
            setIsCreating(false);
          }
        } catch (error) {
          debugError('Failed to create default instance:', error);
          setIsCreating(false);
        }
      } else if (instanceId && isCreating) {
        // Instance now exists, reset creating flag
        setIsCreating(false);
      }
    };

    createInstance();
  }, [app, instanceId, isCreating, onUpdateApp]);

  return { instanceId, isCreating };
}
