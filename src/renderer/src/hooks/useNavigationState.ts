/**
 * Hook for managing navigation state
 * Single Responsibility: Handle browser navigation and state polling
 * Updated to work with WebView via IPC
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

  // Poll navigation state from WebView via IPC
  useEffect(() => {
    if (!isElectron() || !instanceId) return;

    if (!window.dockyard?.webview) {
      console.error('Dockyard webview API not available for navigation state');
      return;
    }

    let interval: NodeJS.Timeout | null = null;

    // Update state periodically via IPC
    const updateState = async () => {
      try {
        const state = await window.dockyard.webview.getState(app.id, instanceId);
        setNavigationState(state);
      } catch (error) {
        console.error('Failed to get navigation state:', error);
      }
    };

    // Initial state update
    updateState();

    // Poll state periodically
    interval = setInterval(updateState, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [app.id, instanceId]);

  // Navigation action handlers using IPC
  const goBack = () => {
    if (!instanceId || !window.dockyard?.webview) return;

    window.dockyard.webview.goBack(app.id, instanceId).catch((error) => {
      console.error('Failed to go back:', error);
    });
  };

  const goForward = () => {
    if (!instanceId || !window.dockyard?.webview) return;

    window.dockyard.webview.goForward(app.id, instanceId).catch((error) => {
      console.error('Failed to go forward:', error);
    });
  };

  const reload = () => {
    if (!instanceId || !window.dockyard?.webview) return;

    window.dockyard.webview.reload(app.id, instanceId).catch((error) => {
      console.error('Failed to reload:', error);
    });
  };

  const goHome = () => {
    if (!instanceId || !window.dockyard?.webview) return;

    window.dockyard.webview.navigate(app.id, instanceId, app.url).catch((error) => {
      console.error('Failed to go home:', error);
    });
  };

  const navigate = (url: string) => {
    if (!instanceId || !window.dockyard?.webview) return;

    window.dockyard.webview.navigate(app.id, instanceId, url).catch((error) => {
      console.error('Failed to navigate:', error);
    });
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
