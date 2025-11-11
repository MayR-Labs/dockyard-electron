export interface Profile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  theme?: ThemeSettings;
  settings: ProfileSettings;
  workspaces: string[];
}

export interface ProfileSettings {
  defaultWorkspace?: string;
  notifications: boolean;
  autoHibernate: boolean;
  hibernateTimeout: number; // in minutes
  launchOnStartup: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;
  background: 'glass' | 'solid' | 'minimal';
  customCSS?: string;
}
