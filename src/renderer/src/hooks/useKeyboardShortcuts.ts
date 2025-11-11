/**
 * Keyboard Shortcuts Hook
 * Manages keyboard shortcuts in a centralized, reusable way
 * Single Responsibility: Keyboard event handling
 */

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  modifier?: 'ctrl' | 'shift' | 'alt' | 'meta' | 'ctrlOrMeta';
  shiftKey?: boolean;
  action: () => void;
  description?: string;
}

/**
 * Custom hook for managing keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether shortcuts are currently enabled
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifierMatch = checkModifier(e, shortcut.modifier);
        const shiftMatch = shortcut.shiftKey === undefined || e.shiftKey === shortcut.shiftKey;
        const keyMatch = e.code === shortcut.key || e.key === shortcut.key;

        if (modifierMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Check if the required modifier key is pressed
 */
function checkModifier(
  e: KeyboardEvent,
  modifier?: 'ctrl' | 'shift' | 'alt' | 'meta' | 'ctrlOrMeta'
): boolean {
  if (!modifier) return true;

  switch (modifier) {
    case 'ctrl':
      return e.ctrlKey && !e.metaKey;
    case 'shift':
      return e.shiftKey;
    case 'alt':
      return e.altKey;
    case 'meta':
      return e.metaKey && !e.ctrlKey;
    case 'ctrlOrMeta':
      return e.ctrlKey || e.metaKey;
    default:
      return false;
  }
}

/**
 * Hook for workspace switching shortcuts (Cmd/Ctrl+1-9)
 */
export function useWorkspaceSwitchShortcuts(
  workspaces: any[],
  onSwitch: (id: string) => void
) {
  const shortcuts: KeyboardShortcut[] = workspaces
    .slice(0, 9)
    .map((workspace, index) => ({
      key: `Digit${index + 1}`,
      modifier: 'ctrlOrMeta',
      shiftKey: false,
      action: () => onSwitch(workspace.id),
      description: `Switch to workspace ${index + 1}`,
    }));

  useKeyboardShortcuts(shortcuts);
}
