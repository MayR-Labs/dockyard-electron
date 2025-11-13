/**
 * Delete App Section Component
 * Handles dangerous app deletion action
 * Single Responsibility: App deletion UI
 */

import { TrashIcon } from '../../Icons';

interface DeleteAppSectionProps {
  appName: string;
  onDelete: () => void;
}

export function DeleteAppSection({ appName, onDelete }: DeleteAppSectionProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${appName}"?`)) {
      onDelete();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
      <button
        onClick={handleDelete}
        className="w-full px-4 py-3 bg-red-900/20 hover:bg-red-900/30 text-left rounded-lg transition flex items-center gap-3 border border-red-900/50"
      >
        <TrashIcon className="w-5 h-5 text-red-400" />
        <div>
          <div className="text-red-400 font-medium">Delete App</div>
          <div className="text-xs text-red-300/70">Permanently remove this app and all instances</div>
        </div>
      </button>
    </div>
  );
}
