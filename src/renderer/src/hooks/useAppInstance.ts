/**
 * Hook for managing app instances
 * Single Responsibility: Handle instance creation and state
 */

import { useState, useEffect } from 'react';
import { App } from '../../../shared/types/app';

export function useAppInstance(
  app: App,
  onUpdateApp?: (id: string, data: Partial<App>) => void
): {
  instanceId: string | undefined;
  isCreating: boolean;
} {
  const [isCreating, setIsCreating] = useState(false);
  const instanceId = app.instances && app.instances.length > 0 ? app.instances[0].id : undefined;

  useEffect(() => {
    const createInstance = async () => {
      if (!instanceId && !isCreating && onUpdateApp && app.instances.length === 0) {
        setIsCreating(true);
        console.log('Creating default instance for app:', app.name);

        // Use the API to create instance with proper partition
        try {
          if (window.dockyard?.apps?.createInstance) {
            const newInstance = await window.dockyard.apps.createInstance(app.id, {
              sessionMode: 'isolated',
            });

            await onUpdateApp(app.id, {
              instances: [newInstance],
            });
            console.log('Successfully created instance:', newInstance.id);
          } else {
            console.warn('Instance creation API not available');
            setIsCreating(false);
          }
        } catch (error) {
          console.error('Failed to create default instance:', error);
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
