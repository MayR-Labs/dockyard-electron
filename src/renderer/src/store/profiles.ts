/**
 * Profile Store
 * Manages profile metadata and switching state
 */

import { create } from 'zustand';
import { ProfileMetadata } from '../../../shared/types';
import { profileAPI } from '../services/api';
import { getErrorMessage } from '../utils/errors';

interface ProfileStore {
  profiles: ProfileMetadata[];
  currentProfile: ProfileMetadata | null;
  loading: boolean;
  isSwitching: boolean;
  error: string | null;
  loadProfiles: () => Promise<void>;
  createProfile: (name: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  currentProfile: null,
  loading: false,
  isSwitching: false,
  error: null,

  loadProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const [profiles, currentProfile] = await Promise.all([
        profileAPI.list(),
        profileAPI.getCurrent(),
      ]);

      set({
        profiles,
        currentProfile,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  createProfile: async (name: string) => {
    set({ loading: true, error: null });
    try {
      await profileAPI.create(name);
      await get().loadProfiles();
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
      throw error;
    }
  },

  deleteProfile: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await profileAPI.delete(id);
      await get().loadProfiles();
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
      throw error;
    }
  },

  switchProfile: async (id: string) => {
    set({ isSwitching: true, error: null });
    try {
      await profileAPI.switch(id);
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), isSwitching: false });
      throw error;
    }
  },
}));
