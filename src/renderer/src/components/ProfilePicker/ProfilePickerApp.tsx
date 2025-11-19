import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProfileMetadata } from '../../../../shared/types/profile';
import { profileAPI } from '../../services/api';
import { getErrorMessage } from '../../utils/errors';

interface ProfileActionState {
  launchingId: string | null;
  deletingId: string | null;
  creating: boolean;
}

const avatarColors = ['#6366f1', '#ec4899', '#f97316', '#14b8a6', '#0ea5e9', '#facc15'];

const getAvatarColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

export function ProfilePickerApp() {
  const [profiles, setProfiles] = useState<ProfileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [actionState, setActionState] = useState<ProfileActionState>({
    launchingId: null,
    deletingId: null,
    creating: false,
  });

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileAPI.list();
      setProfiles(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const handleCreateProfile = useCallback(async () => {
    if (!newProfileName.trim()) {
      return;
    }
    setActionState((state) => ({ ...state, creating: true }));
    setError(null);
    try {
      await profileAPI.create(newProfileName.trim());
      setNewProfileName('');
      await loadProfiles();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionState((state) => ({ ...state, creating: false }));
    }
  }, [loadProfiles, newProfileName]);

  const handleDeleteProfile = useCallback(
    async (profileId: string) => {
      setActionState((state) => ({ ...state, deletingId: profileId }));
      setError(null);
      try {
        await profileAPI.delete(profileId);
        await loadProfiles();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setActionState((state) => ({ ...state, deletingId: null }));
      }
    },
    [loadProfiles]
  );

  const handleLaunchProfile = useCallback(async (profileId: string) => {
    setActionState((state) => ({ ...state, launchingId: profileId }));
    setError(null);
    try {
      await profileAPI.launch(profileId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionState((state) => ({ ...state, launchingId: null }));
    }
  }, []);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort(
      (a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
    );
  }, [profiles]);

  return (
    <div className="h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dockyard</p>
          <h1 className="text-3xl font-semibold">Choose a profile to get started</h1>
          <p className="text-slate-400">
            Each profile keeps its own workspaces, apps, and settings. Launch multiple profiles to
            run different contexts side by side.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Available profiles
            </h2>
            <button
              onClick={() => void loadProfiles()}
              className="text-sm text-slate-400 hover:text-white transition"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading && (
              <div className="col-span-full text-center py-10 text-slate-400 text-sm">
                Loading profiles…
              </div>
            )}
            {!loading && sortedProfiles.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                No profiles yet. Create one below to get started.
              </div>
            )}
            {!loading &&
              sortedProfiles.map((profile) => {
                const launching = actionState.launchingId === profile.id;
                const deleting = actionState.deletingId === profile.id;
                const avatarColor = getAvatarColor(profile.id);
                return (
                  <div
                    key={profile.id}
                    className="relative flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-left hover:border-indigo-500/60 hover:bg-slate-900 transition"
                    onClick={() => void handleLaunchProfile(profile.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-2xl text-lg font-semibold flex items-center justify-center"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{profile.name}</p>
                        <p className="text-xs text-slate-400">{profile.id}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      Last active: {new Date(profile.lastAccessed).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-3 w-full">
                      <span className="flex-1 text-sm text-slate-300">
                        {launching ? 'Launching…' : 'Click to open in a new window'}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDeleteProfile(profile.id);
                        }}
                        disabled={profile.id === 'default' || deleting}
                        className="text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-red-400 disabled:opacity-40"
                      >
                        {deleting ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="border border-slate-800 rounded-2xl p-6 bg-slate-900/60">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Create new profile
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newProfileName}
              onChange={(event) => setNewProfileName(event.target.value)}
              placeholder="Work Focus"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleCreateProfile();
                }
              }}
            />
            <button
              onClick={() => void handleCreateProfile()}
              disabled={!newProfileName.trim() || actionState.creating}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold disabled:bg-slate-700 disabled:text-slate-400"
            >
              {actionState.creating ? 'Creating…' : 'Create Profile'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Profiles live locally inside{' '}
            <code className="font-mono text-slate-300">userData/profiles</code>. You can safely run
            multiple profiles simultaneously.
          </p>
        </section>
      </div>
    </div>
  );
}
