/**
 * Hook for managing navigation state
 * Single Responsibility: Handle browser navigation and state polling
 */

import { useState, useEffect } from 'react';
import { App } from '../../../shared/types/app';
import { isElectron } from '../utils/environment';

interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  url: string;
}

export function useNavigationState(app: App, instanceId: string | undefined) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    isLoading: false,
    url: app.url,
  });

  // Poll navigation state in Electron environment
  useEffect(() => {
    if (!isElectron() || !instanceId) return;

    const interval = setInterval(async () => {
      if (window.dockyard?.browserView) {
        try {
          const state = await window.dockyard.browserView.getState(app.id, instanceId);
          setNavigationState(state);
        } catch (error) {
          console.error('Failed to get navigation state:', error);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [app.id, instanceId]);

  // Navigation action handlers
  const goBack = async () => {
    if (isElectron() && instanceId && window.dockyard?.browserView) {
      await window.dockyard.browserView.goBack(app.id, instanceId);
    }
  };

  const goForward = async () => {
    if (isElectron() && instanceId && window.dockyard?.browserView) {
      await window.dockyard.browserView.goForward(app.id, instanceId);
    }
  };

  const reload = async () => {
    if (isElectron() && instanceId && window.dockyard?.browserView) {
      await window.dockyard.browserView.reload(app.id, instanceId);
    }
  };

  const goHome = async () => {
    if (isElectron() && instanceId && window.dockyard?.browserView) {
      await window.dockyard.browserView.navigate(app.id, instanceId, app.url);
    }
  };

  const navigate = async (url: string) => {
    if (isElectron() && instanceId && window.dockyard?.browserView) {
      await window.dockyard.browserView.navigate(app.id, instanceId, url);
    }
  };

  return {
    navigationState,
    goBack,
    goForward,
    reload,
    goHome,
    navigate,
  };
}
