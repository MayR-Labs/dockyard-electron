/**
 * Quick Start Guide Component
 * Shows when a workspace is created but has no apps
 * Provides sample apps and guidance
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuickStartGuideProps {
  onAddSampleApps: () => void;
  onAddCustomApp: () => void;
}

const SAMPLE_APPS = [
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    icon: '📧',
    color: 'from-red-500 to-pink-500',
    description: 'Email & Communication'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: '🐙',
    color: 'from-gray-700 to-gray-900',
    description: 'Code & Collaboration'
  },
  {
    name: 'Notion',
    url: 'https://notion.so',
    icon: '📝',
    color: 'from-slate-600 to-slate-800',
    description: 'Notes & Documentation'
  },
  {
    name: 'Slack',
    url: 'https://slack.com',
    icon: '💬',
    color: 'from-purple-600 to-pink-600',
    description: 'Team Chat'
  },
];

export function QuickStartGuide({ onAddSampleApps, onAddCustomApp }: QuickStartGuideProps) {
  const [hoveredApp, setHoveredApp] = useState<number | null>(null);

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Workspace is Ready!
          </h2>
          <p className="text-xl text-gray-300">
            Add your favorite web apps to get started
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Sample Apps */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddSampleApps}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1"
          >
            <div className="bg-gray-900 rounded-xl p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✨</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Quick Start with Popular Apps
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Get started instantly with Gmail, Slack, GitHub, and more
                  </p>
                  <div className="flex gap-2">
                    {SAMPLE_APPS.slice(0, 4).map((app, idx) => (
                      <span key={idx} className="text-2xl">{app.icon}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>

          {/* Add Custom App */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddCustomApp}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-1"
          >
            <div className="bg-gray-900 rounded-xl p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌐</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Add Custom Web App
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Add any website or web app by entering its URL
                  </p>
                  <div className="text-sm text-teal-400 font-medium">
                    Click to get started →
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        </div>

        {/* Sample Apps Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⭐</span>
            Popular Apps
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SAMPLE_APPS.map((app, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredApp(idx)}
                onHoverEnd={() => setHoveredApp(null)}
                className="relative group cursor-pointer"
              >
                <div className={`
                  bg-gradient-to-br ${app.color} rounded-xl p-4 h-full
                  transform transition-all duration-300
                  ${hoveredApp === idx ? 'shadow-2xl shadow-purple-500/20' : 'shadow-lg'}
                `}>
                  <div className="text-4xl mb-2">{app.icon}</div>
                  <div className="text-sm font-bold text-white">{app.name}</div>
                  <div className="text-xs text-white/70">{app.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>💡 <span className="text-gray-400">Tip:</span> You can add multiple instances of the same app for different accounts</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
