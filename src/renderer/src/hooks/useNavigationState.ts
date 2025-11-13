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
    let interval: NodeJS.Timeout | null = null;
    let isReady = false;

    // Update state periodically
    const updateState = () => {
      // Only update state if webview is ready
      if (!isReady) return;

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

    // Wait for dom-ready event before calling webview methods
    const handleDomReady = () => {
      isReady = true;
      // Initial state update after webview is ready
      updateState();
      // Start polling state as a backup
      interval = setInterval(updateState, 1000);
    };

    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigate);

    return () => {
      if (interval) clearInterval(interval);
      webview.removeEventListener('dom-ready', handleDomReady);
      webview.removeEventListener('did-start-loading', handleLoadStart);
      webview.removeEventListener('did-stop-loading', handleLoadStop);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate);
    };
  }, [app.id, app.url, instanceId, webviewRef]);

  // Navigation action handlers
  const goBack = () => {
    try {
      if (webviewRef?.current?.canGoBack?.()) {
        webviewRef.current.goBack();
      }
    } catch (error) {
      console.error('Failed to go back:', error);
    }
  };

  const goForward = () => {
    try {
      if (webviewRef?.current?.canGoForward?.()) {
        webviewRef.current.goForward();
      }
    } catch (error) {
      console.error('Failed to go forward:', error);
    }
  };

  const reload = () => {
    try {
      if (webviewRef?.current) {
        webviewRef.current.reload();
      }
    } catch (error) {
      console.error('Failed to reload:', error);
    }
  };

  const goHome = () => {
    try {
      if (webviewRef?.current) {
        webviewRef.current.loadURL(app.url);
      }
    } catch (error) {
      console.error('Failed to go home:', error);
    }
  };

  const navigate = (url: string) => {
    try {
      if (webviewRef?.current) {
        webviewRef.current.loadURL(url);
      }
    } catch (error) {
      console.error('Failed to navigate:', error);
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
