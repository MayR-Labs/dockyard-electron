import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export function RestoreModal({ isOpen, onClose, onRestoreSuccess }: RestoreModalProps) {
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectFile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await window.dockyard.backup.selectFile();
      if (result.success && result.filePath) {
        setSelectedFile(result.filePath);
      } else if (result.error) {
        // setError(result.error); // Optional: don't show error if cancelled
      }
    } catch (err) {
      setError('Failed to select file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setError('Please select a backup file first');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage('Restoring backup...');

    try {
      const result = await window.dockyard.backup.restore(selectedFile, password);
      if (result.success) {
        setStatusMessage('Restore successful! Restarting...');
        onRestoreSuccess();
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Restore failed');
        setStatusMessage(null);
      }
    } catch (err) {
      setError('An unexpected error occurred during restore');
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setPassword('');
    setSelectedFile(null);
    setError(null);
    setStatusMessage(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700 p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Restore from Backup</h2>
            <p className="text-gray-400 text-sm">
              Select a <code>.dockyard</code> file to restore your profiles and settings. This will
              overwrite existing data.
            </p>
          </div>

          <div className="space-y-4">
            {/* File Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Backup File</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 truncate">
                  {selectedFile ? selectedFile.split(/[/\\]/).pop() : 'No file selected'}
                </div>
                <button
                  onClick={handleSelectFile}
                  disabled={isLoading}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm border border-gray-600 transition-colors"
                >
                  Select File
                </button>
              </div>
              {selectedFile && (
                <div className="text-xs text-gray-500 mt-1 truncate">{selectedFile}</div>
              )}
            </div>

            {/* Password Input (Only show if file selected) */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <label className="block text-sm text-gray-400 mb-1">Backup Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter password..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleRestore();
                    }
                  }}
                />
              </motion.div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                {error}
              </div>
            )}

            {statusMessage && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm flex items-center gap-2">
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4 text-blue-200"
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
                {statusMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={isLoading || !selectedFile || !password}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Restoring...' : 'Restore Backup'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
