/**
 * App Actions Component
 * Displays action buttons for app management
 * Single Responsibility: App action button group
 */

import { SettingsIcon, MoonIcon, DocumentIcon, VolumeOnIcon, VolumeOffIcon } from '../../Icons';

interface AppActionsProps {
  onSettings: () => void;
  onCustomize: () => void;
  onHibernate: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export function AppActions({ onSettings, onCustomize, onHibernate, onToggleMute, isMuted }: AppActionsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions</h3>
      <div className="space-y-2">
        <button
          onClick={onSettings}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-white font-medium">App Settings</div>
            <div className="text-xs text-gray-400">Configure app name, URL and icon</div>
          </div>
        </button>

        <button
          onClick={onCustomize}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          <DocumentIcon className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-white font-medium">Customise App</div>
            <div className="text-xs text-gray-400">Manage injected CSS/JS for this app</div>
          </div>
        </button>

        <button
          onClick={onToggleMute}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-left rounded-lg transition flex items-center gap-3"
        >
          {isMuted ? (
            <VolumeOffIcon className="w-5 h-5 text-amber-300" />
          ) : (
            <VolumeOnIcon className="w-5 h-5 text-emerald-300" />
          )}
          <div>
            <div className="text-white font-medium">{isMuted ? 'Unmute audio' : 'Mute audio'}</div>
            <div className="text-xs text-gray-400">
              {isMuted ? 'Allow this app to play sound' : 'Silence audio output for this app'}
            </div>
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
