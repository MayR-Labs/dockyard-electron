import { create } from 'zustand';
import { Settings } from '../../../shared/types';

interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  loadSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await window.dockyard.settings.get();
      set({ settings, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateSettings: async (data: Partial<Settings>) => {
    set({ loading: true, error: null });
    try {
      const settings = await window.dockyard.settings.update(data);
      set({ settings, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
