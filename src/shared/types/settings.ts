export type ThemeMode = 'light' | 'dark' | 'system';
export type BackgroundStyle = 'solid' | 'glass' | 'minimal';

export interface ThemePreset {
  name: string;
  mode: ThemeMode;
  accentColor: string;
  backgroundStyle: BackgroundStyle;
}

export interface Settings extends Record<string, unknown> {
  general: {
    launchAtStartup: boolean;
    minimizeToTray: boolean;
    closeToTray: boolean;
  };
  notifications: {
    enabled: boolean;
    doNotDisturb: boolean;
    soundEnabled: boolean;
  };
  performance: {
    hardwareAcceleration: boolean;
    autoHibernation: boolean;
    defaultIdleTimeMinutes: number;
  };
  privacy: {
    clearDataOnExit: boolean;
    blockThirdPartyCookies: boolean;
  };
  theme: {
    mode: ThemeMode;
    accentColor: string;
    backgroundStyle: BackgroundStyle;
    customPresets: ThemePreset[];
  };
  shortcuts: {
    [action: string]: string; // e.g., "switchWorkspace": "Cmd+Tab"
  };
  advanced: {
    devToolsEnabled: boolean;
    debugMode: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  general: {
    launchAtStartup: false,
    minimizeToTray: false,
    closeToTray: false,
  },
  notifications: {
    enabled: true,
    doNotDisturb: false,
    soundEnabled: true,
  },
  performance: {
    hardwareAcceleration: true,
    autoHibernation: true,
    defaultIdleTimeMinutes: 15,
  },
  privacy: {
    clearDataOnExit: false,
    blockThirdPartyCookies: false,
  },
  theme: {
    mode: 'dark',
    accentColor: '#6366f1', // indigo-500
    backgroundStyle: 'solid',
    customPresets: [],
  },
  shortcuts: {
    switchWorkspace: 'CommandOrControl+Tab',
    quickLauncher: 'CommandOrControl+Space',
  },
  advanced: {
    devToolsEnabled: false,
    debugMode: false,
  },
};
