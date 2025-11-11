import { useState } from 'react';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (workspaceData: {
    name: string;
    sessionMode: 'isolated' | 'shared';
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
  }) => Promise<void>;
}

export function CreateWorkspaceModal({ isOpen, onClose, onCreateWorkspace }: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [sessionMode, setSessionMode] = useState<'isolated' | 'shared'>('isolated');
  const [dockPosition, setDockPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('left');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    // Reset state when modal is closed
    if (isSubmitting || error || name) {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('');
        setName('');
        setSessionMode('isolated');
        setDockPosition('left');
      }, 0);
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    setError('');
    
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateWorkspace({
        name: name.trim(),
        sessionMode,
        dockPosition,
      });
      
      // Reset form and close
      setName('');
      setSessionMode('isolated');
      setDockPosition('left');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
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
          <h2 className="text-2xl font-bold text-white">Create Workspace</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work, Personal, Design"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition">
                <input
                  type="radio"
                  value="isolated"
                  checked={sessionMode === 'isolated'}
                  onChange={(e) => setSessionMode(e.target.value as 'isolated')}
                  className="mt-0.5"
                  disabled={isSubmitting}
                />
                <div>
                  <div className="text-sm font-medium text-white">Isolated (Recommended)</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Each app has its own cookies and session data
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition">
                <input
                  type="radio"
                  value="shared"
                  checked={sessionMode === 'shared'}
                  onChange={(e) => setSessionMode(e.target.value as 'shared')}
                  className="mt-0.5"
                  disabled={isSubmitting}
                />
                <div>
                  <div className="text-sm font-medium text-white">Shared</div>
                  <div className="text-xs text-gray-400 mt-1">
                    All apps in this workspace share cookies and session data
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dock Position
            </label>
            <select
              value={dockPosition}
              onChange={(e) => setDockPosition(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
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
              {isSubmitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
