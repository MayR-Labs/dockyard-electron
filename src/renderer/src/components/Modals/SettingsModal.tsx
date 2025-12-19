import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeMode, BackgroundStyle, ThemePreset } from '../../../../shared/types/settings';
import { BackupSettings } from '../Settings/BackupSettings';

// Since ThemeSettingsModal was big, I'll reuse its logic or copy it here.
// To avoid duplication and make it clean, I will recreate the Theme settings part inside this unified modal
// but defined as a sub-component or just inline for now to save file moves.

// Actually, let's keep it simple. I will copy the logic from ThemeSettingsModal into here,
// and adapt it to be a tab.

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Theme Props
  currentMode: ThemeMode;
  currentAccentColor: string;
  currentBackgroundStyle: BackgroundStyle;
  customPresets: ThemePreset[];
  onSaveTheme: (settings: {
    mode: ThemeMode;
    accentColor: string;
    backgroundStyle: BackgroundStyle;
    customPresets: ThemePreset[];
  }) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentMode,
  currentAccentColor,
  currentBackgroundStyle,
  customPresets,
  onSaveTheme,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'data'>('appearance');

  // Theme State
  const [mode, setMode] = useState<ThemeMode>(currentMode);
  const [accentColor, setAccentColor] = useState(currentAccentColor);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(currentBackgroundStyle);

  // Notification State
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSaveTheme = () => {
    onSaveTheme({
      mode,
      accentColor,
      backgroundStyle,
      customPresets,
    });
    setNotification({ message: 'Theme settings saved', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const PRESET_COLORS = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  if (!isOpen) return null;

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
          className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden border border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800/30 border-r border-gray-700 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                Appearance
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'data'
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
                Data Management
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 relative">
              {notification && (
                <div
                  className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
                    notification.type === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {notification.message}
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8 max-w-2xl">
                  {/* Reuse basic structure from ThemeSettingsModal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Theme Mode</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                            mode === m
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Accent Color</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setAccentColor(color.value)}
                          className={`relative h-12 rounded-lg border-2 transition-all ${
                            accentColor === color.value
                              ? 'border-white scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {accentColor === color.value && (
                            <svg
                              className="absolute inset-0 m-auto w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Background Style</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(['solid', 'glass', 'minimal'] as BackgroundStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setBackgroundStyle(style)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                            backgroundStyle === style
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <button
                      onClick={handleSaveTheme}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Apply Theme Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="max-w-2xl animate-fadeIn">
                  <BackupSettings
                    onActionResult={(message, type) => {
                      setNotification({ message, type });
                      setTimeout(() => setNotification(null), 5000);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
