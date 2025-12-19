import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackupSettingsProps {
  onActionResult: (message: string, type: 'success' | 'error') => void;
}

export function BackupSettings({ onActionResult }: BackupSettingsProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'create' | 'restore' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFile = async () => {
    setIsLoading(true);
    try {
      const result = await window.dockyard.backup.selectFile();
      if (result.success && result.filePath) {
        setSelectedFile(result.filePath);
      } else if (result.error) {
        // onActionResult(result.error, 'error'); // Optional
      }
    } catch (err) {
      onActionResult('Failed to select file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (actionType === 'create') {
      if (!password) {
        onActionResult('Password is required', 'error');
        return;
      }
      if (password !== confirmPassword) {
        onActionResult('Passwords do not match', 'error');
        return;
      }
    } else if (actionType === 'restore') {
      if (!selectedFile) {
        onActionResult('Please select a backup file', 'error');
        return;
      }
      if (!password) {
        onActionResult('Password is required', 'error');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (actionType === 'create') {
        const result = await window.dockyard.backup.create(password);
        if (result.success) {
          onActionResult(`Backup created successfully at ${result.filePath}`, 'success');
          resetState();
        } else {
          onActionResult(result.error || 'Backup failed', 'error');
        }
      } else if (actionType === 'restore') {
        if (!selectedFile) return;
        const result = await window.dockyard.backup.restore(selectedFile, password);
        if (result.success) {
          onActionResult('Backup restored successfully. App is restarting...', 'success');
          resetState();
        } else {
          onActionResult(result.error || 'Restore failed', 'error');
        }
      }
    } catch (error) {
      onActionResult('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setActionType(null);
    setPassword('');
    setConfirmPassword('');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-2">Backup & Restore</h3>
        <p className="text-gray-400 text-sm mb-6">
          Securely backup your profiles, workspaces, and settings to a password-protected file.
        </p>

        {!actionType ? (
          <div className="flex gap-4">
            <button
              onClick={() => setActionType('create')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Create Backup
            </button>
            <button
              onClick={() => setActionType('restore')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Restore form Backup
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-600"
          >
            <h4 className="text-white font-medium mb-4">
              {actionType === 'create' ? 'Create Encrypted Backup' : 'Restore from Backup'}
            </h4>

            <div className="space-y-4">
              {actionType === 'restore' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Backup File</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 truncate">
                      {selectedFile ? selectedFile.split(/[/\\]/).pop() : 'No file selected'}
                    </div>
                    <button
                      onClick={handleSelectFile}
                      disabled={isLoading}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm border border-gray-600 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                </div>
              )}

              {(actionType === 'create' || (actionType === 'restore' && selectedFile)) && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {actionType === 'create' ? 'Set Encryption Password' : 'Enter Backup Password'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter password..."
                  />
                </div>
              )}

              {actionType === 'create' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Confirm password..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={resetState}
                  className="px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isLoading || (actionType === 'restore' && (!selectedFile || !password))}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {actionType === 'create' ? 'Export Backup' : 'Import & Restore'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
