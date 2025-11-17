/**
 * App Options Modal Component
 * Comprehensive options modal for app instance management
 * Single Responsibility: Modal container and tab management
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { CloseIcon } from '../Icons';
import { ZoomControls, AppActions, DeleteAppSection, ResponsiveMode, UserAgentSettings } from './AppOptions';

interface AppOptionsModalProps {
  isOpen: boolean;
  app: App | null;
  zoomLevel: number;
  onClose: () => void;
  onZoomChange: (level: number) => void;
  onSettings: () => void;
  onCustomize: () => void;
  onHibernate: () => void;
  onDelete: () => void;
  onResponsiveModeChange?: (width: number, height: number) => void;
  onUserAgentChange: (userAgent?: string | null) => void;
  isMuted: boolean;
  onToggleMute: (muted: boolean) => void;
}

export function AppOptionsModal({
  isOpen,
  app,
  zoomLevel,
  onClose,
  onZoomChange,
  onSettings,
  onCustomize,
  onHibernate,
  onDelete,
  onResponsiveModeChange,
  onUserAgentChange,
  isMuted,
  onToggleMute,
}: AppOptionsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'responsive'>('general');
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

  const handleActionWithClose = (
    action: () => void,
    options: { closeAfter?: boolean } = {}
  ) => {
    const { closeAfter = true } = options;
    action();
    if (closeAfter) {
      onClose();
    }
  };

  const handleResponsiveModeChange = (width: number, height: number) => {
    if (onResponsiveModeChange) {
      onResponsiveModeChange(width, height);
    }
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
              <CloseIcon className="w-5 h-5" />
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
                <ZoomControls zoomLevel={zoomLevel} onZoomChange={onZoomChange} />

                <AppActions
                  onSettings={() => handleActionWithClose(onSettings, { closeAfter: false })}
                  onCustomize={() => handleActionWithClose(onCustomize)}
                  onHibernate={() => handleActionWithClose(onHibernate)}
                  onToggleMute={() =>
                    handleActionWithClose(() => onToggleMute(!isMuted), {
                      closeAfter: false,
                    })
                  }
                  isMuted={isMuted}
                />

                <UserAgentSettings
                  userAgent={app.userAgent}
                  onChange={(value) => handleActionWithClose(() => onUserAgentChange(value), { closeAfter: false })}
                />

                <DeleteAppSection
                  appName={app.name}
                  onDelete={() => handleActionWithClose(onDelete)}
                />
              </div>
            )}

            {activeTab === 'responsive' && (
              <ResponsiveMode onSizeChange={handleResponsiveModeChange} />
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
