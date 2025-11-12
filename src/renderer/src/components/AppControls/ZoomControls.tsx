/**
 * Zoom Controls Component
 * Controls for adjusting app zoom level
 * Single Responsibility: Zoom level management UI
 */

import { motion } from 'framer-motion';

interface ZoomControlsProps {
  zoomLevel: number; // 0.5 to 2.0
  onZoomChange: (level: number) => void;
}

export function ZoomControls({ zoomLevel, onZoomChange }: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoomLevel * 100);

  const handleZoomIn = () => {
    const newLevel = Math.min(2.0, zoomLevel + 0.1);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(0.5, zoomLevel - 0.1);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleReset = () => {
    onZoomChange(1.0);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-2 py-1 border border-gray-800">
      {/* Zoom Out */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleZoomOut}
        disabled={zoomLevel <= 0.5}
        className="p-1 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom Out"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
          />
        </svg>
      </motion.button>

      {/* Zoom Percentage */}
      <button
        onClick={handleReset}
        className="px-2 py-0.5 text-xs font-medium text-gray-400 hover:text-white transition min-w-12 text-center"
        title="Reset to 100%"
      >
        {zoomPercentage}%
      </button>

      {/* Zoom In */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleZoomIn}
        disabled={zoomLevel >= 2.0}
        className="p-1 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom In"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
          />
        </svg>
      </motion.button>

      {/* Presets Dropdown (Optional) */}
      <div className="relative group">
        <button className="p-1 hover:bg-gray-800 rounded transition">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-32 z-50">
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((level) => (
            <button
              key={level}
              onClick={() => onZoomChange(level)}
              className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-700 transition ${
                Math.abs(zoomLevel - level) < 0.01 ? 'text-indigo-400' : 'text-gray-300'
              }`}
            >
              {Math.round(level * 100)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
