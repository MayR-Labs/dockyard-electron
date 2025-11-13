/**
 * Responsive Mode Component
 * Manages responsive testing with device presets
 * Single Responsibility: Responsive mode configuration UI
 */

import { useState } from 'react';
import { PhoneIcon, TabletIcon, DesktopIcon } from '../../Icons';
import { DEVICE_PRESETS, DevicePreset } from '../../../constants/devicePresets';

interface ResponsiveModeProps {
  onSizeChange: (width: number, height: number) => void;
}

export function ResponsiveMode({ onSizeChange }: ResponsiveModeProps) {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const handleDevicePreset = (preset: DevicePreset) => {
    onSizeChange(preset.width, preset.height);
  };

  const handleCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      onSizeChange(width, height);
    }
  };

  const handleReset = () => {
    onSizeChange(0, 0); // Reset to full size by passing 0
    setCustomWidth('');
    setCustomHeight('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phone':
        return <PhoneIcon className="w-4 h-4" />;
      case 'tablet':
        return <TabletIcon className="w-4 h-4" />;
      case 'desktop':
        return <DesktopIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-400 mb-4">
          Test your app with different screen sizes. Select a device preset or enter custom dimensions.
        </p>

        {/* Device Categories */}
        {['phone', 'tablet', 'desktop'].map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 capitalize flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}s
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {DEVICE_PRESETS.filter((p) => p.category === category).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleDevicePreset(preset)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition text-sm"
                >
                  <div className="text-white font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-400">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Size */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Custom Size</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                placeholder="e.g., 1024"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder="e.g., 768"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleCustomSize}
              disabled={!customWidth || !customHeight}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white text-sm font-medium mt-4"
        >
          Reset to Full Size
        </button>
      </div>
    </div>
  );
}
