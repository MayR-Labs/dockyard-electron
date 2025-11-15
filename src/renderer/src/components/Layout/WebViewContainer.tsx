/**
 * WebView Container Component
 * Manages webview elements with proper session partitioning
 * Single Responsibility: WebView lifecycle and integration
 * 
 * ARCHITECTURE NOTE:
 * Unlike BrowserView which renders at OS level, webview tags render in the DOM
 * and respect z-index, making overlay management simpler.
 * 
 * The partition attribute enables persistent sessions with the format:
 * persist:{profileSlug}-{workspaceSlug}-{appSlug}-{instanceId}
 */

import { useRef, useEffect, useState } from 'react';
import { App } from '../../../../shared/types/app';
import { LoadingIcon } from '../Icons';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface WebViewContainerProps {
  app: App;
  instanceId?: string;
  isCreating?: boolean;
}

// Extend the JSX types to include webview
declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          partition?: string;
          allowpopups?: string;
          webpreferences?: string;
          nodeintegration?: string;
          disablewebsecurity?: string;
          preload?: string;
        },
        HTMLElement
      >;
    }
  }
}

export function WebViewContainer({
  app,
  instanceId,
  isCreating = false,
}: WebViewContainerProps) {
  const webviewRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the instance details
  const instance = app.instances.find((i) => i.id === instanceId);
  const partitionId = instance?.partitionId || '';

  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef.current) return;

    const webview = webviewRef.current;

    // Event handlers
    const handleDidFinishLoad = () => {
      console.log('WebView finished loading:', app.name);
      setIsLoading(false);
      setIsReady(true);

      // Apply custom CSS if provided
      if (app.customCSS) {
        webview.insertCSS(app.customCSS).catch((error: Error) => {
          console.error('Failed to inject CSS:', error);
        });
      }

      // Apply custom JS if provided
      if (app.customJS) {
        webview.executeJavaScript(app.customJS).catch((error: Error) => {
          console.error('Failed to inject JS:', error);
        });
      }
    };

    const handleDidStartLoading = () => {
      setIsLoading(true);
    };

    const handleDidFailLoad = (event: any) => {
      console.error('WebView failed to load:', event);
      setIsLoading(false);
    };

    const handleDomReady = () => {
      console.log('WebView DOM ready:', app.name);
      
      // Apply zoom level if set
      if (app.display?.zoomLevel) {
        webview.setZoomFactor(app.display.zoomLevel);
      }

      // Register with main process
      if (window.dockyard?.webview) {
        const webContentsId = webview.getWebContentsId();
        window.dockyard.webview
          .register(webContentsId, app.id, instanceId, partitionId)
          .catch((error: Error) => {
            console.error('Failed to register webview:', error);
          });
      }
    };

    const handleNewWindow = (event: any) => {
      // Open links in default browser
      const url = event.url;
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        event.preventDefault();
        // You can use shell.openExternal here if needed
        console.log('New window request:', url);
      }
    };

    // Add event listeners
    webview.addEventListener('did-finish-load', handleDidFinishLoad);
    webview.addEventListener('did-start-loading', handleDidStartLoading);
    webview.addEventListener('did-fail-load', handleDidFailLoad);
    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('new-window', handleNewWindow);

    // Cleanup
    return () => {
      webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      webview.removeEventListener('did-start-loading', handleDidStartLoading);
      webview.removeEventListener('did-fail-load', handleDidFailLoad);
      webview.removeEventListener('dom-ready', handleDomReady);
      webview.removeEventListener('new-window', handleNewWindow);

      // Unregister from main process
      if (window.dockyard?.webview) {
        window.dockyard.webview.unregister(app.id, instanceId).catch((error: Error) => {
          console.error('Failed to unregister webview:', error);
        });
      }
    };
  }, [app.id, app.name, app.customCSS, app.customJS, app.display?.zoomLevel, instanceId, partitionId]);

  // Update zoom when it changes
  useEffect(() => {
    if (!isElectron() || !isReady || !webviewRef.current || !app.display?.zoomLevel) return;

    const webview = webviewRef.current;
    webview.setZoomFactor(app.display.zoomLevel);
  }, [app.display?.zoomLevel, isReady]);

  // Update active status when focused
  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef.current) return;

    const webview = webviewRef.current;

    const handleFocus = () => {
      if (window.dockyard?.webview) {
        window.dockyard.webview.updateActive(app.id, instanceId).catch((error: Error) => {
          console.error('Failed to update active status:', error);
        });
      }
    };

    webview.addEventListener('focus', handleFocus);

    return () => {
      webview.removeEventListener('focus', handleFocus);
    };
  }, [app.id, instanceId]);

  // Show loading state while creating instance
  if (isCreating || !instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="mb-4 flex justify-center">
            <LoadingIcon className="w-16 h-16 opacity-50 animate-spin" />
          </div>
          <p className="text-lg font-medium">Loading app...</p>
          <p className="text-sm mt-2">Creating instance for {app.name}</p>
          <p className="text-xs mt-4 text-gray-500">If this persists, try reloading the app</p>
        </div>
      </div>
    );
  }

  // Show browser dev mode placeholder when not in Electron
  if (!isElectron()) {
    return <BrowserDevPlaceholder appName={app.name} appUrl={app.url} appIcon={app.icon} />;
  }

  // Electron environment: render webview
  return (
    <div className="flex-1 bg-gray-900 relative" style={{ minHeight: 0 }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center text-gray-400">
            <div className="mb-4 flex justify-center">
              <LoadingIcon className="w-12 h-12 opacity-50 animate-spin" />
            </div>
            <p className="text-sm">Loading {app.name}...</p>
          </div>
        </div>
      )}
      
      {/* WebView element */}
      <webview
        ref={webviewRef}
        src={app.url}
        partition={partitionId}
        allowpopups="true"
        webpreferences="contextIsolation=yes, nodeIntegration=no, sandbox=yes"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          border: 'none',
        }}
      />
    </div>
  );
}
