/**
 * App Customization Modal
 * Allows editing custom CSS and JavaScript for apps
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { debugError } from '../../../../shared/utils/debug';

interface AppCustomizationModalProps {
  isOpen: boolean;
  app: App | null;
  onClose: () => void;
  onSave: (appId: string, data: { customCSS?: string; customJS?: string }) => void;
}

export function AppCustomizationModal({
  isOpen,
  app,
  onClose,
  onSave,
}: AppCustomizationModalProps) {
  const [customCSS, setCustomCSS] = useState(app?.customCSS || '');
  const [customJS, setCustomJS] = useState(app?.customJS || '');
  const [activeTab, setActiveTab] = useState<'css' | 'js'>('css');

  const handleSave = () => {
    if (!app) return;
    onSave(app.id, { customCSS, customJS });
    onClose();
  };

  const handleApply = async () => {
    if (!app || !app.instances.length) return;

    try {
      const instanceId = app.instances[0].id;

      if (activeTab === 'css' && customCSS) {
        await window.dockyard.webview.injectCSS(app.id, instanceId, customCSS);
      } else if (activeTab === 'js' && customJS) {
        await window.dockyard.webview.injectJS(app.id, instanceId, customJS);
      }
    } catch (error) {
      debugError('Failed to inject code:', error);
      alert('Failed to inject code. See console for details.');
    }
  };

  if (!isOpen || !app) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">Customize {app.name}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Inject custom CSS and JavaScript to modify app appearance and behavior
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('css')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === 'css'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              Custom CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === 'js'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              Custom JavaScript
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
            {activeTab === 'css' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-200">CSS Code</label>
                  <button
                    onClick={handleApply}
                    className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                  >
                    Test CSS
                  </button>
                </div>
                <textarea
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  placeholder="/* Enter your custom CSS here */
body {
  background-color: #1a1a1a;
}

.custom-class {
  color: #6366f1;
}"
                  className="w-full h-64 px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <p className="text-xs text-gray-500">
                  💡 Tip: CSS changes are applied immediately when you save or test
                </p>
              </div>
            )}

            {activeTab === 'js' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-200">JavaScript Code</label>
                  <button
                    onClick={handleApply}
                    className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                  >
                    Test JavaScript
                  </button>
                </div>
                <textarea
                  value={customJS}
                  onChange={(e) => setCustomJS(e.target.value)}
                  placeholder="// Enter your custom JavaScript here
console.log('Custom script loaded');

// Example: Hide an element
document.querySelector('.annoying-banner')?.remove();"
                  className="w-full h-64 px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
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
                    <div className="text-xs text-yellow-200">
                      <strong className="font-semibold">Security Warning:</strong> Only inject
                      JavaScript from trusted sources. Malicious code can compromise your data and
                      privacy.
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  💡 Tip: JavaScript runs after the page loads. Use{' '}
                  <code className="bg-gray-800 px-1 rounded">console.log()</code> for debugging
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800/50">
            <button
              onClick={() => {
                setCustomCSS('');
                setCustomJS('');
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
