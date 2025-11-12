import { useState } from 'react';

interface AddAppModalProps {
  isOpen: boolean;
  workspaceId: string;
  onClose: () => void;
  onAddApp: (appData: {
    name: string;
    url: string;
    icon?: string;
    customCSS?: string;
    customJS?: string;
  }) => Promise<void>;
}

export function AddAppModal({ isOpen, workspaceId, onClose, onAddApp }: AddAppModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    // Reset state when modal is closed
    if (isSubmitting || error || name || url) {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('');
        setName('');
        setUrl('');
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

    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

      // Try to fetch favicon automatically
      const { getFaviconUrl } = await import('../../utils/favicon');
      const faviconUrl = getFaviconUrl(normalizedUrl);

      await onAddApp({
        name: name.trim(),
        url: normalizedUrl,
        icon: faviconUrl,
      });

      // Reset form and close
      setName('');
      setUrl('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add app');
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
          <h2 className="text-2xl font-bold text-white">Add App</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">App Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gmail, Slack, GitHub"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., gmail.com or https://app.slack.com"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a domain or full URL. HTTPS will be added automatically.
            </p>
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
              {isSubmitting ? 'Adding...' : 'Add App'}
            </button>
          </div>
        </form>

        {/* Quick Templates */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs font-medium text-gray-400 mb-3">Popular Apps</p>
          <div className="grid grid-cols-3 gap-2">
            {POPULAR_APPS.map((app) => (
              <button
                key={app.name}
                onClick={() => {
                  setName(app.name);
                  setUrl(app.url);
                }}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition"
                disabled={isSubmitting}
              >
                {app.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const POPULAR_APPS = [
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Slack', url: 'https://app.slack.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Notion', url: 'https://notion.so' },
  { name: 'Discord', url: 'https://discord.com/app' },
  { name: 'Trello', url: 'https://trello.com' },
];
