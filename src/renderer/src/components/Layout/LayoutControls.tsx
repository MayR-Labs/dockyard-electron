/**
 * Layout Controls Component
 * Toolbar for controlling the layout mode (single, split, grid)
 * Single Responsibility: Layout mode switching UI
 */

import { motion } from 'framer-motion';
import { LayoutMode } from '../../../../shared/types/workspace';

interface LayoutControlsProps {
  currentMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
  disabled?: boolean;
}

export function LayoutControls({ currentMode, onModeChange, disabled }: LayoutControlsProps) {
  const modes: { mode: LayoutMode; icon: JSX.Element; label: string }[] = [
    {
      mode: 'single',
      label: 'Single',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        </svg>
      ),
    },
    {
      mode: 'split-horizontal',
      label: 'Split Horizontal',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="8" height="18" rx="1" strokeWidth="2" />
          <rect x="13" y="3" width="8" height="18" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      mode: 'split-vertical',
      label: 'Split Vertical',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="8" rx="1" strokeWidth="2" />
          <rect x="3" y="13" width="18" height="8" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      mode: 'grid',
      label: 'Grid',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
      {modes.map((modeConfig) => (
        <motion.button
          key={modeConfig.mode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !disabled && onModeChange(modeConfig.mode)}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-md transition-all
            flex items-center gap-2
            ${
              currentMode === modeConfig.mode
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={modeConfig.label}
        >
          {modeConfig.icon}
          <span className="text-xs font-medium">{modeConfig.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
