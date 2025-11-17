/**
 * User Agent Settings Component
 * Allows selecting preset user agents or entering a custom value
 */

import { useMemo, useState, useEffect } from 'react';

interface UserAgentSettingsProps {
  userAgent?: string;
  onChange: (value?: string | null) => void;
}

interface UserAgentPreset {
  id: string;
  label: string;
  description: string;
  value?: string;
}

const USER_AGENT_PRESETS: UserAgentPreset[] = [
  {
    id: 'default',
    label: 'Dockyard Default',
    description: 'Use the system webview user agent',
    value: undefined,
  },
  {
    id: 'chrome-macos',
    label: 'Chrome · macOS',
    description: 'Chrome 118 on macOS 13',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.117 Safari/537.36',
  },
  {
    id: 'safari-ios',
    label: 'Safari · iOS',
    description: 'Safari 17 on iPhone iOS 17',
    value:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
  {
    id: 'firefox-windows',
    label: 'Firefox · Windows',
    description: 'Firefox 118 on Windows 11',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
  },
  {
    id: 'edge-windows',
    label: 'Edge · Windows',
    description: 'Edge 118 on Windows 11',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36 Edg/118.0.2088.61',
  },
  {
    id: 'safari-macos',
    label: 'Safari · macOS',
    description: 'Safari 17 on macOS 13',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  },
];

export function UserAgentSettings({ userAgent, onChange }: UserAgentSettingsProps) {
  const [customValue, setCustomValue] = useState('');

  const activePresetId = useMemo(() => {
    const preset = USER_AGENT_PRESETS.find((entry) => entry.value === userAgent);
    return preset ? preset.id : userAgent ? 'custom' : 'default';
  }, [userAgent]);

  useEffect(() => {
    const shouldReset = !userAgent || USER_AGENT_PRESETS.some((entry) => entry.value === userAgent);
    const nextValue = shouldReset ? '' : userAgent;
    queueMicrotask(() => setCustomValue(nextValue ?? ''));
  }, [userAgent]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">User Agent</h3>
        {userAgent && (
          <button
            onClick={() => onChange(undefined)}
            className="text-xs text-indigo-300 hover:text-indigo-200"
          >
            Reset to default
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {USER_AGENT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onChange(preset.value)}
            className={`text-left rounded-lg border px-3 py-2 transition hover:border-indigo-400 hover:text-white ${
              activePresetId === preset.id
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-gray-700 text-gray-300'
            }`}
          >
            <div className="text-sm font-medium">{preset.label}</div>
            <div className="text-xs text-gray-400">{preset.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2">Custom user agent</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Mozilla/5.0 (...)"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => onChange(customValue.trim() || undefined)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40"
            disabled={!customValue.trim()}
          >
            Apply
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Changing the user agent reloads the page with the new identity to help bypass UA-based
          gates.
        </p>
      </div>
    </div>
  );
}
