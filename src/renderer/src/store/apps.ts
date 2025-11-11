/**
 * App Store
 * Manages application state using Zustand
 * Follows Single Responsibility Principle - only handles state management
 */

import { create } from 'zustand';
import { App } from '../../../shared/types';
import { appAPI } from '../services/api';

interface AppStore {
  apps: App[];
  loading: boolean;
  error: string | null;

  // Actions
  loadApps: () => Promise<void>;
  createApp: (data: Partial<App>) => Promise<void>;
  updateApp: (id: string, data: Partial<App>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  hibernateApp: (id: string) => Promise<void>;
  resumeApp: (id: string) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  apps: [],
  loading: false,
  error: null,

  loadApps: async () => {
    set({ loading: true, error: null });
    try {
      const apps = await appAPI.list();
      set({ apps, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createApp: async (data: Partial<App>) => {
    set({ loading: true, error: null });
    try {
      await appAPI.create(data);
      // Reload apps from storage to ensure consistency
      const apps = await appAPI.list();
      set({ apps, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateApp: async (id: string, data: Partial<App>) => {
    set({ loading: true, error: null });
    try {
      await appAPI.update(id, data);
      // Reload apps from storage to ensure consistency
      const apps = await appAPI.list();
      set({ apps, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteApp: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await appAPI.delete(id);
      // Reload apps from storage to ensure consistency
      const apps = await appAPI.list();
      set({ apps, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  hibernateApp: async (id: string) => {
    try {
      await appAPI.hibernate(id);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  resumeApp: async (id: string) => {
    try {
      await appAPI.resume(id);
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
