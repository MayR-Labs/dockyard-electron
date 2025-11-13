/**
 * Hook for managing navigation state
 * Single Responsibility: Handle browser navigation and state polling
 * Updated to work with webview elements
 */

import { useState, useEffect, RefObject } from 'react';
import { App } from '../../../shared/types/app';
import { isElectron } from '../utils/environment';

interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  url: string;
}

export function useNavigationState(
  app: App,
  instanceId: string | undefined,
  webviewRef?: RefObject<HTMLWebViewElement>
) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    isLoading: false,
    url: app.url,
  });

  // Poll navigation state for webview
  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef?.current) return;

    const webview = webviewRef.current;

    // Update state periodically
    const updateState = () => {
      try {
        setNavigationState({
          canGoBack: webview.canGoBack?.() || false,
          canGoForward: webview.canGoForward?.() || false,
          isLoading: webview.isLoading?.() || false,
          url: webview.getURL?.() || app.url,
        });
      } catch (error) {
        console.error('Failed to get navigation state:', error);
      }
    };

    // Event listeners for webview events
    const handleLoadStart = () => {
      setNavigationState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleLoadStop = () => {
      updateState();
      setNavigationState((prev) => ({ ...prev, isLoading: false }));
    };

    const handleDidNavigate = () => {
      updateState();
    };

    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigate);

    // Initial state
    updateState();

    // Poll state as a backup
    const interval = setInterval(updateState, 1000);

    return () => {
      clearInterval(interval);
      webview.removeEventListener('did-start-loading', handleLoadStart);
      webview.removeEventListener('did-stop-loading', handleLoadStop);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate);
    };
  }, [app.id, app.url, instanceId, webviewRef]);

  // Navigation action handlers
  const goBack = () => {
    if (webviewRef?.current?.canGoBack?.()) {
      webviewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webviewRef?.current?.canGoForward?.()) {
      webviewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webviewRef?.current) {
      webviewRef.current.reload();
    }
  };

  const goHome = () => {
    if (webviewRef?.current) {
      webviewRef.current.loadURL(app.url);
    }
  };

  const navigate = (url: string) => {
    if (webviewRef?.current) {
      webviewRef.current.loadURL(url);
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
