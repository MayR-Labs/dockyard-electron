/**
 * App Actions Component
 * Displays action buttons for app management
 * Single Responsibility: App action button group
 */

import { DuplicateIcon, SettingsIcon, MoonIcon } from '../../Icons';

interface AppActionsProps {
  onDuplicate: () => void;
  onSettings: () => void;
  onHibernate: () => void;
}

export function AppActions({ onDuplicate, onSettings, onHibernate }: AppActionsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions</h3>
      <div className="space-y-2">
        <button
          onClick={onDuplicate}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          <DuplicateIcon className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-white font-medium">Duplicate Instance</div>
            <div className="text-xs text-gray-400">Create a new instance of this app</div>
          </div>
        </button>

        <button
          onClick={onSettings}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-white font-medium">App Settings</div>
            <div className="text-xs text-gray-400">Configure app URL, icon, and custom CSS/JS</div>
          </div>
        </button>

        <button
          onClick={onHibernate}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          <MoonIcon className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-white font-medium">Hibernate</div>
            <div className="text-xs text-gray-400">Suspend app to save memory</div>
          </div>
        </button>
      </div>
    </div>
  );
}
