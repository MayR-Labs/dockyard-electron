/**
 * App Auto Hibernation Settings
 * Allows overriding workspace-level idle timeout per app
 */

import { useState } from 'react';
import type { App } from '../../../../../shared/types/app';
import { debugError } from '../../../../../shared/utils/debug';

interface AppHibernationSettingsProps {
  app: App;
  workspaceIdleTimeMinutes: number;
  workspaceHibernationEnabled: boolean;
  onUpdate: (minutes: number | null) => Promise<void> | void;
}

const clampMinutes = (value: number): number => {
  if (Number.isNaN(value)) {
    return 1;
  }
  return Math.min(180, Math.max(1, Math.round(value)));
};

export function AppHibernationSettings({
  app,
  workspaceIdleTimeMinutes,
  workspaceHibernationEnabled,
  onUpdate,
}: AppHibernationSettingsProps) {
  const hasCustomDuration = typeof app.hibernation?.idleTimeMinutes === 'number';
  const [mode, setMode] = useState<'workspace' | 'custom'>(
    hasCustomDuration ? 'custom' : 'workspace'
  );
  const [customMinutes, setCustomMinutes] = useState<number>(() =>
    hasCustomDuration && app.hibernation?.idleTimeMinutes
      ? app.hibernation.idleTimeMinutes
      : workspaceIdleTimeMinutes
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!workspaceHibernationEnabled) {
      return;
    }

    setStatus('saving');
    setError(null);

    try {
      await Promise.resolve(onUpdate(mode === 'workspace' ? null : customMinutes));
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      debugError('Failed to update hibernation', err);
      setError(err instanceof Error ? err.message : 'Failed to update hibernation settings');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-300">Auto Hibernation</h3>
          <p className="text-xs text-gray-500">
            Control how long {app.name} can stay awake before Dockyard suspends it.
          </p>
        </div>
        {!workspaceHibernationEnabled && (
          <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            Disabled in workspace
          </span>
        )}
      </div>

      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="radio"
              name={`hibernate-mode-${app.id}`}
              value="workspace"
              checked={mode === 'workspace'}
              onChange={() => setMode('workspace')}
              disabled={!workspaceHibernationEnabled || status === 'saving'}
            />
            <span>Use workspace default ({workspaceIdleTimeMinutes} minutes)</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="radio"
              name={`hibernate-mode-${app.id}`}
              value="custom"
              checked={mode === 'custom'}
              onChange={() => setMode('custom')}
              disabled={!workspaceHibernationEnabled || status === 'saving'}
            />
            <span>Custom duration</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3">
          <label className="text-xs font-medium text-gray-400 flex items-center">
            Idle timeout (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={180}
            value={customMinutes}
            onChange={(event) => setCustomMinutes(clampMinutes(Number(event.target.value)))}
            className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            disabled={mode !== 'custom' || !workspaceHibernationEnabled || status === 'saving'}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === 'saving' || !workspaceHibernationEnabled}
          >
            {status === 'saving'
              ? 'Saving…'
              : mode === 'workspace'
                ? 'Use workspace default'
                : 'Apply custom duration'}
          </button>
          {status === 'success' && <span className="text-xs text-emerald-300">Saved</span>}
          {status === 'error' && error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>

      {hasCustomDuration && mode === 'workspace' && workspaceHibernationEnabled && (
        <p className="text-xs text-amber-300">
          Custom duration is currently set to {app.hibernation?.idleTimeMinutes} minutes. Apply
          workspace default to revert.
        </p>
      )}
    </div>
  );
}
