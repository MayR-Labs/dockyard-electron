/**
 * Zoom Controls Component
 * Manages zoom level adjustment UI
 * Single Responsibility: Zoom level control interface
 */

import { ZoomInIcon, ZoomOutIcon } from '../../Icons';
import { ZOOM_PRESETS, ZOOM_LIMITS } from '../../../constants/devicePresets';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export function ZoomControls({ zoomLevel, onZoomChange }: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoomLevel * 100);

  const handleZoomIn = () => {
    const newLevel = Math.min(ZOOM_LIMITS.MAX, zoomLevel + ZOOM_LIMITS.STEP);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(ZOOM_LIMITS.MIN, zoomLevel - ZOOM_LIMITS.STEP);
    onZoomChange(Math.round(newLevel * 10) / 10);
  };

  const handleResetZoom = () => {
    onZoomChange(ZOOM_LIMITS.DEFAULT);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Zoom Level</h3>
      <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= ZOOM_LIMITS.MIN}
          className="p-2 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOutIcon className="w-5 h-5 text-gray-400" />
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
            min={ZOOM_LIMITS.MIN * 100}
            max={ZOOM_LIMITS.MAX * 100}
            step={ZOOM_LIMITS.STEP * 100}
            value={zoomPercentage}
            onChange={(e) => onZoomChange(parseInt(e.target.value) / 100)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{ZOOM_LIMITS.MIN * 100}%</span>
            <span>{ZOOM_LIMITS.DEFAULT * 100}%</span>
            <span>{ZOOM_LIMITS.MAX * 100}%</span>
          </div>
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= ZOOM_LIMITS.MAX}
          className="p-2 hover:bg-gray-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomInIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Zoom Presets */}
      <div className="flex gap-2 mt-3">
        {ZOOM_PRESETS.map((level) => (
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
  );
}
