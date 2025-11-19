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

export interface AppAudioSettings {
  muted: boolean;
}

export interface AppHibernationSettings {
  idleTimeMinutes: number;
}

export interface App {
  id: string;
  name: string;
  url: string;
  icon?: string; // Path or URL to icon
  description?: string; // Optional description of the app
  customCSS?: string;
  customJS?: string;
  userAgent?: string;
  workspaceId: string;
  instances: AppInstance[];
  notifications?: AppNotificationSettings;
  display?: AppDisplaySettings;
  audio?: AppAudioSettings;
  hibernation?: AppHibernationSettings | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppsConfig extends Record<string, unknown> {
  apps: App[];
}
