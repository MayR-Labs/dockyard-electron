/**
 * Profile Switcher Modal
 * Provides UI for switching, creating, and managing profiles
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileMetadata } from '../../../../shared/types';
import { CloseIcon } from '../Icons';

interface ProfileSwitcherModalProps {
  isOpen: boolean;
  profiles: ProfileMetadata[];
  currentProfileId: string | null;
  isLoading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSelectProfile: (profileId: string) => void | Promise<void>;
  onCreateProfile: (name: string) => void | Promise<void>;
  onDeleteProfile: (profileId: string) => void | Promise<void>;
}

export function ProfileSwitcherModal({
  isOpen,
  profiles,
  currentProfileId,
  isLoading,
  errorMessage,
  onClose,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}: ProfileSwitcherModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [profileName, setProfileName] = useState('');

  const handleClose = useCallback(() => {
    setProfileName('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleCreateProfile = async () => {
    if (!profileName.trim()) {
      return;
    }

    await Promise.resolve(onCreateProfile(profileName.trim()));
    setProfileName('');
  };

  const sortedProfiles = [...profiles].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-800"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-semibold text-white">Profiles</h2>
              <p className="text-sm text-gray-400">Switch between isolated workspaces</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
              aria-label="Close profile switcher"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="px-6 py-3 bg-red-500/10 text-red-300 text-sm border-b border-red-500/30">
              {errorMessage}
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {sortedProfiles.map((profile) => {
                const isActive = profile.id === currentProfileId;
                const isDefault = profile.id === 'default';

                return (
                  <div
                    key={profile.id}
                    className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                      isActive
                        ? 'border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-900/40'
                        : 'border-gray-800 bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-base font-semibold text-white">{profile.name}</p>
                        <p className="text-xs text-gray-400">{profile.id}</p>
                      </div>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>
                        Created: {new Date(profile.createdAt).toLocaleDateString()} {''}
                        {new Date(profile.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p>
                        Last used: {new Date(profile.lastAccessed).toLocaleDateString()} {''}
                        {new Date(profile.lastAccessed).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="truncate" title={profile.dataPath}>
                        Data: {profile.dataPath}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => void onSelectProfile(profile.id)}
                        disabled={isActive || isLoading}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isActive
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isActive ? 'Current' : 'Switch'}
                      </button>
                      <button
                        onClick={() => void onDeleteProfile(profile.id)}
                        disabled={isDefault || isActive || isLoading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isDefault || isActive
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {sortedProfiles.length === 0 && (
                <div className="col-span-2 text-center text-gray-400 py-16 border border-dashed border-gray-700 rounded-xl">
                  No profiles yet. Create one below to isolate workspaces.
                </div>
              )}
            </div>

            <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/60">
              <p className="text-sm font-semibold text-white mb-3">Create a new profile</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  placeholder="My Focused Workspace"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleCreateProfile();
                    }
                  }}
                />
                <button
                  onClick={handleCreateProfile}
                  disabled={!profileName.trim() || isLoading}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium disabled:bg-gray-700 disabled:text-gray-400"
                >
                  Create
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Profiles keep apps, workspaces, and settings separated. Perfect for work vs.
                personal contexts.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span>Profiles are stored locally and never synced.</span>
            <button
              onClick={handleClose}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
