export interface Settings {
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
  shortcuts: {
    switchWorkspace: 'CommandOrControl+Tab',
    quickLauncher: 'CommandOrControl+Space',
  },
  advanced: {
    devToolsEnabled: false,
    debugMode: false,
  },
};
