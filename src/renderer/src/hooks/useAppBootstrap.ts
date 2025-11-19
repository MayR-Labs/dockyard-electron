import { useEffect, useState } from 'react';
import type { Workspace } from '../../../shared/types/workspace';
import { debugError, debugLog } from '../../../shared/utils/debug';

type UseAppBootstrapParams = {
  loadWorkspaces: () => Promise<void>;
  loadApps: () => Promise<void>;
  loadSettings: () => Promise<void>;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setActiveWorkspace: (workspaceId: string) => void;
};

export function useAppBootstrap({
  loadWorkspaces,
  loadApps,
  loadSettings,
  workspaces,
  activeWorkspaceId,
  setActiveWorkspace,
}: UseAppBootstrapParams) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        debugLog('Bootstrapping workspace, apps, and settings data');
        await Promise.all([loadWorkspaces(), loadApps(), loadSettings()]);
        debugLog('Bootstrap finished successfully');
      } catch (error) {
        debugError('Failed to load initial data', error);
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [loadWorkspaces, loadApps, loadSettings]);

  useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspace(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setActiveWorkspace]);

  return { isBootstrapping };
}
