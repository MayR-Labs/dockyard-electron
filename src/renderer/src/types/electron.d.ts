import type { ElectronAPI } from '../../../preload';

declare global {
  interface Window {
    electronAPI: typeof ElectronAPI;
  }
}

export {};
