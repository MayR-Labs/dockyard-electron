/**
 * Session Manager Component
 * Allows users to manage sessions and clear cache/cookies
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';

interface SessionManagerProps {
  apps: App[];
  onClose?: () => void;
}

export function SessionManager({ apps, onClose }: SessionManagerProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearSession = async (app: App, instanceId: string) => {
    setClearing(true);
    setMessage(null);

    try {
      const instance = app.instances.find((i) => i.id === instanceId);
      if (!instance) {
        throw new Error('Instance not found');
      }

      await window.dockyard.browserView.clearSession(instance.partitionId);
      setMessage({ type: 'success', text: `Session cleared for ${app.name}` });
    } catch (error) {
      console.error('Failed to clear session:', error);
      setMessage({ type: 'error', text: 'Failed to clear session. Please try again.' });
    } finally {
      setClearing(false);
    }
  };

  const getSessionType = (app: App): string => {
    if (app.instances.length === 0) return 'No instances';

    const firstPartition = app.instances[0].partitionId;

    if (firstPartition.startsWith('persist:workspace-')) {
      return 'Workspace-shared';
    } else if (firstPartition.startsWith('persist:app-')) {
      return 'Isolated per instance';
    }

    return 'Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Session Manager</h2>
            <p className="text-sm text-gray-400">Manage app sessions and clear data</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Close"
        >
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

      {/* Message Banner */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mx-6 mt-4 p-3 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </motion.div>
      )}

      {/* Apps List */}
      <div className="flex-1 overflow-auto p-6">
        {apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Apps</h3>
            <p className="text-gray-500">Add some apps to manage their sessions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* App Header */}
                <button
                  onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {app.icon && <img src={app.icon} alt={app.name} className="w-8 h-8 rounded" />}
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                      <p className="text-sm text-gray-400">{getSessionType(app)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {app.instances.length} {app.instances.length === 1 ? 'instance' : 'instances'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedApp === app.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Instances List */}
                {selectedApp === app.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4 space-y-3">
                      {app.instances.map((instance, idx) => (
                        <div
                          key={instance.id}
                          className="bg-gray-900/50 rounded p-3 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">
                                {instance.name || `Instance ${idx + 1}`}
                              </span>
                              {instance.hibernated && (
                                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/50">
                                  Hibernated
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 font-mono">
                              {instance.partitionId}
                            </p>
                          </div>

                          <button
                            onClick={() => handleClearSession(app, instance.id)}
                            disabled={clearing}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/50"
                          >
                            {clearing ? 'Clearing...' : 'Clear Data'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-800">
        <div className="flex items-start gap-3 text-xs text-gray-500">
          <svg
            className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <strong>Warning:</strong> Clearing session data will log you out of apps and delete all
            cookies, cache, and local storage for that instance.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
