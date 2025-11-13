/**
 * App Options Modal Component
 * Comprehensive options modal for app instance management
 * Includes zoom, duplicate, settings, hibernate, delete, and responsive mode
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';

interface AppOptionsModalProps {
  isOpen: boolean;
  app: App | null;
  instanceId?: string;
  zoomLevel: number;
  onClose: () => void;
  onZoomChange: (level: number) => void;
  onDuplicate: () => void;
  onSettings: () => void;
  onHibernate: () => void;
  onDelete: () => void;
  onResponsiveModeChange?: (width: number, height: number) => void;
}

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  category: 'phone' | 'tablet' | 'desktop';
}

const DEVICE_PRESETS: DevicePreset[] = [
  // Phones
  { name: 'iPhone SE', width: 375, height: 667, category: 'phone' },
  { name: 'iPhone 12/13', width: 390, height: 844, category: 'phone' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'phone' },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'phone' },
  { name: 'Google Pixel 5', width: 393, height: 851, category: 'phone' },
  
  // Tablets
  { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet' },
  { name: 'iPad Air', width: 820, height: 1180, category: 'tablet' },
  { name: 'iPad Pro 11"', width: 834, height: 1194, category: 'tablet' },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet' },
  { name: 'Samsung Galaxy Tab', width: 800, height: 1280, category: 'tablet' },
  
  // Desktop
  { name: 'Laptop (1366x768)', width: 1366, height: 768, category: 'desktop' },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080, category: 'desktop' },
  { name: 'Desktop (2560x1440)', width: 2560, height: 1440, category: 'desktop' },
];

export function AppOptionsModal({
  isOpen,
  app,
  instanceId,
  zoomLevel,
  onClose,
  onZoomChange,
  onDuplicate,
  onSettings,
  onHibernate,
  onDelete,
  onResponsiveModeChange,
}: AppOptionsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'responsive'>('general');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !app) return null;

  const zoomPercentage = Math.round(zoomLevel * 100);

  const handleZoomIn = () => {
    const newLevel = Math.min(2.0, zoomLevel + 0.1);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(0.5, zoomLevel - 0.1);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleResetZoom = () => {
    onZoomChange(1.0);
  };

  const handleDevicePreset = (preset: DevicePreset) => {
    if (onResponsiveModeChange) {
      onResponsiveModeChange(preset.width, preset.height);
    }
  };

  const handleCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      if (onResponsiveModeChange) {
        onResponsiveModeChange(width, height);
      }
    }
  };

  const handleResetResponsive = () => {
    if (onResponsiveModeChange) {
      onResponsiveModeChange(0, 0); // Reset to full size by passing 0
    }
    setCustomWidth('');
    setCustomHeight('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              {app.icon && <img src={app.icon} alt={app.name} className="w-8 h-8 rounded" />}
              <div>
                <h2 className="text-xl font-semibold text-white">{app.name}</h2>
                <p className="text-sm text-gray-400">App Options</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'general'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('responsive')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'responsive'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Responsive Mode
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Zoom Controls Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Zoom Level</h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 0.5}
                      className="p-2 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom Out"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-white">{zoomPercentage}%</span>
                        <button
                          onClick={handleResetZoom}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        step="10"
                        value={zoomPercentage}
                        onChange={(e) => onZoomChange(parseInt(e.target.value) / 100)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>50%</span>
                        <span>100%</span>
                        <span>200%</span>
                      </div>
                    </div>

                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 2.0}
                      className="p-2 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom In"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </button>
                  </div>

                  {/* Zoom Presets */}
                  <div className="flex gap-2 mt-3">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((level) => (
                      <button
                        key={level}
                        onClick={() => onZoomChange(level)}
                        className={`px-3 py-1 text-xs rounded transition ${
                          Math.abs(zoomLevel - level) < 0.01
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {Math.round(level * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onDuplicate();
                        onClose();
                      }}
                      className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">Duplicate Instance</div>
                        <div className="text-xs text-gray-400">Create a new instance of this app</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onSettings();
                        onClose();
                      }}
                      className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">App Settings</div>
                        <div className="text-xs text-gray-400">Configure app URL, icon, and custom CSS/JS</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onHibernate();
                        onClose();
                      }}
                      className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">Hibernate</div>
                        <div className="text-xs text-gray-400">Suspend app to save memory</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${app.name}"?`)) {
                        onDelete();
                        onClose();
                      }
                    }}
                    className="w-full px-4 py-3 bg-red-900/20 hover:bg-red-900/30 text-left rounded-lg transition flex items-center gap-3 border border-red-900/50"
                  >
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <div>
                      <div className="text-red-400 font-medium">Delete App</div>
                      <div className="text-xs text-red-300/70">Permanently remove this app and all instances</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'responsive' && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    Test your app with different screen sizes. Select a device preset or enter custom dimensions.
                  </p>

                  {/* Device Categories */}
                  {['phone', 'tablet', 'desktop'].map((category) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3 capitalize flex items-center gap-2">
                        {category === 'phone' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        {category === 'tablet' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        {category === 'desktop' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
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
                    onClick={handleResetResponsive}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white text-sm font-medium mt-4"
                  >
                    Reset to Full Size
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-white font-medium"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
