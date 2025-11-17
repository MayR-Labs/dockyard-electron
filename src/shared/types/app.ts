export interface AppInstance {
  id: string;
  appId: string;
  name?: string; // Optional label for instance
  partitionId: string;
  hibernated: boolean;
  lastActive: string;
}

export interface AppNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  badgeCount?: number;
}

export interface AppDisplaySettings {
  zoomLevel: number; // 0.5 to 2.0, default 1.0
  responsiveMode?: {
    enabled: boolean;
    width: number;
    height: number;
  };
}

export interface App {
  id: string;
  name: string;
  url: string;
  icon?: string; // Path or URL to icon
  customCSS?: string;
  customJS?: string;
  workspaceId: string;
  instances: AppInstance[];
  notifications?: AppNotificationSettings;
  display?: AppDisplaySettings;
  createdAt: string;
  updatedAt: string;
}

export interface AppsConfig extends Record<string, unknown> {
  apps: App[];
}
