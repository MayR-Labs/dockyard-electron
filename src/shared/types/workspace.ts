export type LayoutMode = 'single' | 'split-horizontal' | 'split-vertical' | 'grid';

export interface SplitLayoutConfig {
  mode: LayoutMode;
  panels: {
    appId: string;
    size?: number; // percentage, 0-100
  }[];
}

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  apps: string[];  // Array of app IDs
  layout: {
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
    dockSize: number;
    splitLayout?: SplitLayoutConfig;
  };
  theme?: {
    mode: 'light' | 'dark' | 'system';
    accentColor: string;
  };
  sessionMode: 'isolated' | 'shared';
  hibernation: {
    enabled: boolean;
    idleTimeMinutes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacesConfig {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
}
