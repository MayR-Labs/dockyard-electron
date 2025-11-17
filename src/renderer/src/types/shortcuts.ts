export type AppShortcutSignalType = 'find' | 'print';

export interface AppShortcutSignal {
  appId: string;
  type: AppShortcutSignalType;
  timestamp: number;
}
