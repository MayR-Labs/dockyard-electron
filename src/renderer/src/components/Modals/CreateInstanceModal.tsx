/**
 * Create Instance Modal Component
 * Allows creating new instances of an app
 * Single Responsibility: Instance creation UI
 */

import { useState } from 'react';
import { App, AppInstance } from '../../../../shared/types/app';
import { appAPI } from '../../services/api';

interface CreateInstanceModalProps {
  isOpen: boolean;
  app: App | null;
  onClose: () => void;
  onCreateInstance: (appId: string, instance: AppInstance) => Promise<void>;
}

export function CreateInstanceModal({
  isOpen,
  app,
  onClose,
  onCreateInstance,
}: CreateInstanceModalProps) {
  const [instanceName, setInstanceName] = useState('');
  const [sessionMode, setSessionMode] = useState<'isolated' | 'shared'>('isolated');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !app) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsSubmitting(true);
    try {
      // Create instance via API which will generate proper partition ID with slugs
      const newInstance = await appAPI.createInstance(app.id, {
        name: instanceName.trim() || undefined,
        sessionMode,
      });

      // Notify parent about the new instance
      await onCreateInstance(app.id, newInstance);

      // Reset form and close
      setInstanceName('');
      setSessionMode('isolated');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">New Instance</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* App Info */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Creating instance for:</p>
          <p className="text-white font-semibold">{app.name}</p>
          <p className="text-xs text-gray-500 mt-1">{app.url}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instance Name (Optional)
            </label>
            <input
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder={`${app.name} - Work`}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Give this instance a memorable name, like "Personal" or "Work"
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Mode</label>
            <div className="space-y-2">
              <label className="flex items-start p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition">
                <input
                  type="radio"
                  value="isolated"
                  checked={sessionMode === 'isolated'}
                  onChange={(e) => setSessionMode(e.target.value as 'isolated')}
                  className="mt-1 mr-3"
                  disabled={isSubmitting}
                />
                <div>
                  <div className="text-white font-medium">Isolated Session</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Separate cookies and storage. Use for different accounts.
                  </div>
                </div>
              </label>

              <label className="flex items-start p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition">
                <input
                  type="radio"
                  value="shared"
                  checked={sessionMode === 'shared'}
                  onChange={(e) => setSessionMode(e.target.value as 'shared')}
                  className="mt-1 mr-3"
                  disabled={isSubmitting}
                />
                <div>
                  <div className="text-white font-medium">Shared Session</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Share cookies with other apps in this workspace.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Instance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
