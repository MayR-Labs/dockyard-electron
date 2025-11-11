export interface AppInstance {
  id: string;
  appId: string;
  name?: string;  // Optional label for instance
  partitionId: string;
  hibernated: boolean;
  lastActive: string;
}

export interface App {
  id: string;
  name: string;
  url: string;
  icon?: string;  // Path or URL to icon
  customCSS?: string;
  customJS?: string;
  workspaceId: string;
  instances: AppInstance[];
  createdAt: string;
  updatedAt: string;
}

export interface AppsConfig {
  apps: App[];
}
