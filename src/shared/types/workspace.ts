import { ThemeSettings } from './profile';

export interface Workspace {
  id: string;
  profileId: string;
  name: string;
  icon?: string;
  position: number;
  createdAt: number;
  updatedAt: number;
  apps: string[]; // App IDs
  settings: WorkspaceSettings;
}

export interface WorkspaceSettings {
  sharedSession: boolean;
  theme?: ThemeSettings;
  layout: LayoutConfig;
  autoHibernate?: boolean;
  hibernateTimeout?: number;
}

export interface LayoutConfig {
  dockPosition: 'top' | 'bottom' | 'left' | 'right';
  activeAppId?: string;
}
