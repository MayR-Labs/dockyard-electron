/**
 * Browser Dev Mode Placeholder
 * Shows a placeholder when running in browser (not Electron)
 * for components that require Electron BrowserView
 */

import { motion } from 'framer-motion';

interface BrowserDevPlaceholderProps {
  appName: string;
  appUrl: string;
  appIcon?: string;
}

export function BrowserDevPlaceholder({ appName, appUrl, appIcon }: BrowserDevPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8"
    >
      <div className="max-w-2xl text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {appIcon ? (
            <img src={appIcon} alt={appName} className="w-20 h-20 rounded-xl shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌐</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{appName}</h2>
          <p className="text-gray-400 text-sm font-mono">{appUrl}</p>
        </div>

        {/* Browser Dev Mode Notice */}
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-6 text-left">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5"
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
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Browser Development Mode
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                You&apos;re running Dockyard in a regular browser. BrowserView components require
                Electron to function properly.
              </p>
              <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-400 space-y-2">
                <p>
                  <span className="text-gray-300 font-medium">To see the full app:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Stop the dev server (Ctrl+C)</li>
                  <li>
                    Run: <code className="text-indigo-400">npm run dev</code>
                  </li>
                  <li>The Electron app will launch automatically</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in New Tab
          </a>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reload App
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>This is a development-only placeholder.</p>
          <p>Full app features are available when running in Electron.</p>
        </div>
      </div>
    </motion.div>
  );
}
