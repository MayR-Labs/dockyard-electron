/**
 * Settings Store
 * Manages application settings using Zustand
 * Follows Single Responsibility Principle - only handles state management
 */

import { create } from 'zustand';
import { Settings } from '../../../shared/types';
import { settingsAPI } from '../services/api';
import { getErrorMessage } from '../utils/errors';

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
      const settings = await settingsAPI.get();
      set({ settings, loading: false });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  updateSettings: async (data: Partial<Settings>) => {
    set({ loading: true, error: null });
    try {
      const settings = await settingsAPI.update(data);
      set({ settings, loading: false });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
}));
