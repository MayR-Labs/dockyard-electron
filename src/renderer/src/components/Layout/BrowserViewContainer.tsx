/**
 * BrowserView Container Component
 * Manages the container where webview is rendered or shows dev mode placeholder
 * Single Responsibility: Webview positioning and lifecycle
 */

import { useRef, useEffect } from 'react';
import { App } from '../../../../shared/types/app';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface BrowserViewContainerProps {
  app: App;
  instanceId?: string;
  isAnyModalOpen?: boolean;
  isCreating?: boolean;
  webviewRef?: React.RefObject<HTMLWebViewElement>;
}

export function BrowserViewContainer({
  app,
  instanceId,
  isAnyModalOpen = false,
  isCreating = false,
  webviewRef: externalWebviewRef,
}: BrowserViewContainerProps) {
  const internalWebviewRef = useRef<HTMLWebViewElement | null>(null);
  const webviewRef = externalWebviewRef || internalWebviewRef;

  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef.current) return;

    const webview = webviewRef.current;

    // Apply zoom level if set
    if (app.display?.zoomLevel) {
      webview.setZoomFactor(app.display.zoomLevel);
    }

    // Handle webview events
    const handleDidFinishLoad = () => {
      // Apply custom CSS if provided
      if (app.customCSS) {
        webview.insertCSS(app.customCSS);
      }

      // Apply custom JS if provided
      if (app.customJS) {
        webview.executeJavaScript(app.customJS);
      }
    };

    const handleDidFailLoad = (event: any) => {
      console.error('Webview failed to load:', event);
    };

    webview.addEventListener('did-finish-load', handleDidFinishLoad);
    webview.addEventListener('did-fail-load', handleDidFailLoad);

    return () => {
      webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      webview.removeEventListener('did-fail-load', handleDidFailLoad);
    };
  }, [app.customCSS, app.customJS, app.display?.zoomLevel, instanceId]);

  // Update zoom level when it changes
  useEffect(() => {
    if (webviewRef.current && app.display?.zoomLevel) {
      webviewRef.current.setZoomFactor(app.display.zoomLevel);
    }
  }, [app.display?.zoomLevel]);

  // Hide webview when modal is open
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.style.visibility = isAnyModalOpen ? 'hidden' : 'visible';
    }
  }, [isAnyModalOpen]);

  // Show loading state while creating instance
  if (isCreating || !instanceId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto opacity-50 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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

  // Find the partition for this instance
  const instance = app.instances.find((inst) => inst.id === instanceId);
  const partition = instance?.partitionId || `persist:app-${app.id}-${instanceId}`;

  // Electron environment: render webview
  return (
    <div className="flex-1 bg-gray-900 relative" style={{ minHeight: 0 }}>
      <webview
        ref={webviewRef}
        src={app.url}
        partition={partition}
        className="w-full h-full"
        allowpopups="true"
        // @ts-ignore - webview is a custom element
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
