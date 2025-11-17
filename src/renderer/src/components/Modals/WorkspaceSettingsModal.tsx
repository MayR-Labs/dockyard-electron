/**
 * Workspace Settings Modal
 * Allows users to configure per-workspace layout and behavior
 */

import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import { Workspace } from '../../../../shared/types';

interface WorkspaceSettingsModalProps {
  workspace: Workspace;
  onClose: () => void;
  onSave: (settings: {
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
    dockSize: number;
    sessionMode: 'isolated' | 'shared';
    hibernationEnabled: boolean;
    idleTimeMinutes: number;
  }) => Promise<void>;
}

const DOCK_SIZES = {
  MIN: 48,
  MAX: 120,
  STEP: 4,
};

export function WorkspaceSettingsModal({
  workspace,
  onClose,
  onSave,
}: WorkspaceSettingsModalProps) {
  const [dockPosition, setDockPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(
    workspace.layout?.dockPosition ?? 'left'
  );
  const [dockSize, setDockSize] = useState(workspace.layout?.dockSize ?? 64);
  const [sessionMode, setSessionMode] = useState<'isolated' | 'shared'>(
    workspace.sessionMode ?? 'isolated'
  );
  const [hibernationEnabled, setHibernationEnabled] = useState<boolean>(
    workspace.hibernation?.enabled ?? true
  );
  const [idleTimeMinutes, setIdleTimeMinutes] = useState<number>(
    workspace.hibernation?.idleTimeMinutes ?? 15
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDockPosition(workspace.layout?.dockPosition ?? 'left');
    setDockSize(workspace.layout?.dockSize ?? 64);
    setSessionMode(workspace.sessionMode ?? 'isolated');
    setHibernationEnabled(workspace.hibernation?.enabled ?? true);
    setIdleTimeMinutes(workspace.hibernation?.idleTimeMinutes ?? 15);
    setError(null);
    setIsSaving(false);
  }, [workspace]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSaving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        dockPosition,
        dockSize,
        sessionMode,
        hibernationEnabled,
        idleTimeMinutes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workspace');
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Workspace</p>
            <h2 className="text-2xl font-semibold text-white">{workspace.name}</h2>
            <p className="text-xs text-gray-500 mt-1">Customize how this workspace behaves</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-400"
            aria-label="Close workspace settings"
            disabled={isSaving}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Dock Placement</h3>
            <p className="text-xs text-gray-500 mb-3">
              Control where Dockyard displays the workspace dock.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['left', 'right', 'top', 'bottom'] as const).map((position) => (
                <button
                  type="button"
                  key={position}
                  onClick={() => setDockPosition(position)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition text-left capitalize ${
                    dockPosition === position
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-gray-800 bg-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{position}</span>
                  <span className="text-xs text-gray-500">
                    {position === 'left' && 'Default vertical dock'}
                    {position === 'right' && 'Mirrors the default layout'}
                    {position === 'top' && 'Horizontal dock under the toolbar'}
                    {position === 'bottom' && 'Keeps dock near status bar'}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-300">Dock Size</h3>
                <p className="text-xs text-gray-500">Adjust the dock width/height in pixels.</p>
              </div>
              <span className="text-sm font-semibold text-indigo-400">{dockSize}px</span>
            </div>
            <input
              type="range"
              min={DOCK_SIZES.MIN}
              max={DOCK_SIZES.MAX}
              step={DOCK_SIZES.STEP}
              value={dockSize}
              onChange={(event) => setDockSize(Number(event.target.value))}
              className="w-full accent-indigo-500"
              disabled={isSaving}
            />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Session Mode</h3>
            <p className="text-xs text-gray-500 mb-3">
              Choose how cookies and session data are shared between apps in this workspace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['isolated', 'shared'].map((mode) => (
                <label
                  key={mode}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    sessionMode === mode
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-800 bg-gray-800 hover:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="session-mode"
                    className="mt-1"
                    checked={sessionMode === mode}
                    onChange={() => setSessionMode(mode as 'isolated' | 'shared')}
                    disabled={isSaving}
                  />
                  <div>
                    <p className="text-sm font-medium capitalize text-white">{mode}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {mode === 'isolated'
                        ? 'Each app has its own cookies and device storage.'
                        : 'All apps reuse a shared session for quick context switching.'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-300">Auto Hibernation</h3>
                <p className="text-xs text-gray-500">
                  Suspend idle BrowserViews to reclaim memory automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHibernationEnabled((prev) => !prev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  hibernationEnabled
                    ? 'bg-green-500/20 text-green-300 border-green-500/40'
                    : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}
              >
                {hibernationEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Idle Timeout (minutes)</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={idleTimeMinutes}
                  onChange={(event) =>
                    setIdleTimeMinutes(() => {
                      const value = Number(event.target.value);
                      if (Number.isNaN(value)) {
                        return 1;
                      }
                      return Math.min(120, Math.max(1, value));
                    })
                  }
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-800 text-white focus:outline-none focus:border-indigo-500"
                  disabled={!hibernationEnabled || isSaving}
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
