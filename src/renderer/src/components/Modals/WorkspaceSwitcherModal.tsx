/**
 * Workspace Switcher Modal Component
 * Modal for switching between workspaces and creating new ones
 * Single Responsibility: Workspace selection UI
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Workspace } from '../../../../shared/types/workspace';
import { CloseIcon } from '../Icons';

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onClose: () => void;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
}

export function WorkspaceSwitcherModal({
  isOpen,
  workspaces,
  activeWorkspaceId,
  onClose,
  onSelectWorkspace,
  onCreateWorkspace,
}: WorkspaceSwitcherModalProps) {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">Switch Workspace</h2>
              <p className="text-sm text-gray-400">Select a workspace or create a new one</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Workspace Grid */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {workspaces.map((workspace, index) => (
                <motion.button
                  key={workspace.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSelectWorkspace(workspace.id);
                    onClose();
                  }}
                  className={`
                    p-4 rounded-lg text-left transition-all relative
                    ${
                      workspace.id === activeWorkspaceId
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono opacity-60">#{index + 1}</span>
                      <span className="font-medium text-base">{workspace.name}</span>
                    </div>
                    {workspace.id === activeWorkspaceId && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-xs opacity-70 flex items-center gap-2">
                    <span>{workspace.apps.length} apps</span>
                    <span>•</span>
                    <span className="capitalize">{workspace.sessionMode}</span>
                    <span>•</span>
                    <span className="capitalize">{workspace.layout.dockPosition} dock</span>
                  </div>
                </motion.button>
              ))}

              {/* Create New Workspace Card */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: workspaces.length * 0.05 }}
                onClick={() => {
                  onCreateWorkspace();
                  onClose();
                }}
                className="p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-indigo-500 hover:bg-gray-700/50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-400 min-h-[100px]"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm font-medium">Create New Workspace</span>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Use <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl/Cmd + 1-9</kbd> to
              quickly switch
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
