/**
 * Theme Settings Modal
 * Provides UI for customizing app theme and appearance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeMode, BackgroundStyle, ThemePreset } from '../../../../shared/types/settings';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ThemeMode;
  currentAccentColor: string;
  currentBackgroundStyle: BackgroundStyle;
  customPresets: ThemePreset[];
  onSave: (settings: {
    mode: ThemeMode;
    accentColor: string;
    backgroundStyle: BackgroundStyle;
    customPresets: ThemePreset[];
  }) => void;
}

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

const DEFAULT_PRESETS: ThemePreset[] = [
  {
    name: 'Default Dark',
    mode: 'dark',
    accentColor: '#6366f1',
    backgroundStyle: 'solid',
  },
  {
    name: 'Default Light',
    mode: 'light',
    accentColor: '#6366f1',
    backgroundStyle: 'solid',
  },
  {
    name: 'Glass Dark',
    mode: 'dark',
    accentColor: '#a855f7',
    backgroundStyle: 'glass',
  },
  {
    name: 'Minimal Dark',
    mode: 'dark',
    accentColor: '#22c55e',
    backgroundStyle: 'minimal',
  },
];

export function ThemeSettingsModal({
  isOpen,
  onClose,
  currentMode,
  currentAccentColor,
  currentBackgroundStyle,
  customPresets,
  onSave,
}: ThemeSettingsModalProps) {
  const [mode, setMode] = useState<ThemeMode>(currentMode);
  const [accentColor, setAccentColor] = useState(currentAccentColor);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(currentBackgroundStyle);
  const [presets] = useState<ThemePreset[]>([...DEFAULT_PRESETS, ...customPresets]);

  const handleSave = () => {
    onSave({
      mode,
      accentColor,
      backgroundStyle,
      customPresets,
    });
    onClose();
  };

  const applyPreset = (preset: ThemePreset) => {
    setMode(preset.mode);
    setAccentColor(preset.accentColor);
    setBackgroundStyle(preset.backgroundStyle);
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Theme Settings</h2>
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

          {/* Content */}
          <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            {/* Theme Mode */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">Theme Mode</label>
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

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">Accent Color</label>
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
                    title={color.name}
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
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20 rounded border-2 border-gray-700 bg-gray-800 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Background Style */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">Background Style</label>
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

            {/* Theme Presets */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">Theme Presets</label>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:border-indigo-500 hover:bg-gray-750 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{preset.name}</span>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {preset.mode} • {preset.backgroundStyle}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/50">
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
