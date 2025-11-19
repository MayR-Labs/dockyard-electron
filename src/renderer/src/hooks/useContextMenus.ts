import { useCallback, useState } from 'react';

type AppContextMenuState = {
  appId: string;
  appName: string;
  x: number;
  y: number;
  isMuted: boolean;
};

type WorkspaceContextMenuState = {
  workspaceId: string;
  workspaceName: string;
  x: number;
  y: number;
};

export function useContextMenus() {
  const [appContextMenu, setAppContextMenu] = useState<AppContextMenuState | null>(null);
  const [workspaceContextMenu, setWorkspaceContextMenu] =
    useState<WorkspaceContextMenuState | null>(null);

  const openAppContextMenu = useCallback((state: AppContextMenuState) => {
    setAppContextMenu(state);
  }, []);

  const closeAppContextMenu = useCallback(() => {
    setAppContextMenu(null);
  }, []);

  const openWorkspaceContextMenu = useCallback((state: WorkspaceContextMenuState) => {
    setWorkspaceContextMenu(state);
  }, []);

  const closeWorkspaceContextMenu = useCallback(() => {
    setWorkspaceContextMenu(null);
  }, []);

  return {
    appContextMenu,
    workspaceContextMenu,
    openAppContextMenu,
    closeAppContextMenu,
    openWorkspaceContextMenu,
    closeWorkspaceContextMenu,
  };
}
