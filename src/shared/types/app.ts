export interface AppInstance {
  id: string;
  workspaceId: string;
  appDefinitionId?: string;
  name: string;
  url: string;
  icon: string;
  position: number;
  partition: string;
  createdAt: number;
  settings: AppSettings;
  state: AppState;
}

export interface AppDefinition {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  description?: string;
  customCSS?: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  badge: boolean;
  zoom: number; // 0.5 - 2.0
  customCSS?: string;
  customJS?: string;
  autoHibernate?: boolean;
  hibernateTimeout?: number;
}

export interface AppState {
  isLoaded: boolean;
  isHibernated: boolean;
  lastActiveAt: number;
  badgeCount?: number;
  title?: string;
  favicon?: string;
}
