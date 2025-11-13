/**
 * BrowserView Container Component
 * Manages the container where webview is rendered or shows dev mode placeholder
 * Single Responsibility: Webview positioning and lifecycle
 */

import { useRef, useEffect } from 'react';
import { App } from '../../../../shared/types/app';
import { LoadingIcon } from '../Icons';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface BrowserViewContainerProps {
  app: App;
  instanceId?: string;
  isCreating?: boolean;
  webviewRef?: React.RefObject<HTMLWebViewElement>;
}

export function BrowserViewContainer({
  app,
  instanceId,
  isCreating = false,
  webviewRef: externalWebviewRef,
}: BrowserViewContainerProps) {
  const internalWebviewRef = useRef<HTMLWebViewElement | null>(null);
  const webviewRef = externalWebviewRef || internalWebviewRef;

  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef.current) return;

    const webview = webviewRef.current;

    // Handle webview events
    const handleDomReady = () => {
      // Apply zoom level if set (only after webview is ready)
      if (app.display?.zoomLevel) {
        webview.setZoomFactor(app.display.zoomLevel);
      }
    };

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

    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('did-finish-load', handleDidFinishLoad);
    webview.addEventListener('did-fail-load', handleDidFailLoad);

    return () => {
      webview.removeEventListener('dom-ready', handleDomReady);
      webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      webview.removeEventListener('did-fail-load', handleDidFailLoad);
    };
  }, [app.customCSS, app.customJS, app.display?.zoomLevel, instanceId]);

  // Update zoom level when it changes
  useEffect(() => {
    if (!webviewRef.current || !app.display?.zoomLevel) return;

    const webview = webviewRef.current;

    // Wait for dom-ready before calling setZoomFactor
    const handleDomReady = () => {
      webview.setZoomFactor(app.display.zoomLevel);
      webview.removeEventListener('dom-ready', handleDomReady);
    };

    // Check if webview is already ready, otherwise wait for dom-ready
    try {
      // Try to set zoom factor - if webview is ready, this will work
      webview.setZoomFactor(app.display.zoomLevel);
    } catch (error) {
      // If it fails, webview is not ready yet, so wait for dom-ready
      webview.addEventListener('dom-ready', handleDomReady);
    }

    return () => {
      webview.removeEventListener('dom-ready', handleDomReady);
    };
  }, [app.display?.zoomLevel]);

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

  // Find the partition for this instance
  const instance = app.instances.find((inst) => inst.id === instanceId);
  const partition = instance?.partitionId || `persist:app-${app.id}-${instanceId}`;

  // Electron environment: render webview
  return (
    <div
      className="flex-1 bg-gray-900 relative flex items-center justify-center"
      style={{ minHeight: 0 }}
    >
      {app.display?.responsiveMode?.enabled ? (
        // Responsive mode: constrained viewport
        <div
          className="bg-gray-950 border border-gray-700 shadow-2xl overflow-hidden"
          style={{
            width: app.display.responsiveMode.width,
            height: app.display.responsiveMode.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
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
      ) : (
        // Full size mode
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
      )}
    </div>
  );
}
