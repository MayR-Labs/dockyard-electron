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

import { createElement, forwardRef, useEffect, useRef, useState } from 'react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { DidFailLoadEvent, WebviewTag } from 'electron';
import { App } from '../../../../shared/types/app';
import { LoadingIcon, SpinnerIcon } from '../Icons';
import { isElectron } from '../../utils/environment';
import { BrowserDevPlaceholder } from '../DevMode/BrowserDevPlaceholder';

interface WebViewContainerProps {
  app: App;
  instanceId?: string;
  isCreating?: boolean;
  isLoading?: boolean;
}

type WebviewNewWindowEvent = Event & {
  url?: string;
  preventDefault: () => void;
};

type ElectronWebViewProps = DetailedHTMLProps<
  HTMLAttributes<WebviewTag> & {
    src?: string;
    partition?: string;
    useragent?: string;
    allowpopups?: string;
    webpreferences?: string;
    nodeintegration?: string;
    disablewebsecurity?: string;
    preload?: string;
  },
  WebviewTag
>;

const ElectronWebView = forwardRef<WebviewTag, ElectronWebViewProps>((props, ref) =>
  createElement('webview', {
    ...props,
    ref,
  })
);

ElectronWebView.displayName = 'ElectronWebView';

export function WebViewContainer({
  app,
  instanceId,
  isCreating = false,
  isLoading,
}: WebViewContainerProps) {
  const webviewRef = useRef<WebviewTag | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const responsiveContainerRef = useRef<HTMLDivElement | null>(null);
  const [responsiveScale, setResponsiveScale] = useState(1);
  const lastUserAgent = useRef<string | undefined>(app.userAgent);
  const lastAudioMuted = useRef<boolean | undefined>(app.audio?.muted);

  // Get the instance details
  const instance = app.instances.find((i) => i.id === instanceId);
  const partitionId = instance?.partitionId || '';
  const responsiveMode = app.display?.responsiveMode;
  const responsiveEnabled = Boolean(
    responsiveMode?.enabled && responsiveMode.width && responsiveMode.height
  );
  const responsiveWidth = responsiveMode?.width ?? 0;
  const responsiveHeight = responsiveMode?.height ?? 0;

  useEffect(() => {
    if (!isElectron() || !instanceId || !webviewRef.current) return;

    const webview = webviewRef.current;

    // Event handlers
    const handleDidFinishLoad = () => {
      console.log('WebView finished loading:', app.name);
      setInternalLoading(false);
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
      setInternalLoading(true);
    };

    const handleDidFailLoad = (event: DidFailLoadEvent) => {
      console.error('WebView failed to load:', event);
      setInternalLoading(false);
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

    const handleNewWindow = (event: WebviewNewWindowEvent) => {
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
  }, [
    app.id,
    app.name,
    app.customCSS,
    app.customJS,
    app.display?.zoomLevel,
    instanceId,
    partitionId,
  ]);

  // Update zoom when it changes
  useEffect(() => {
    if (!isElectron() || !isReady || !webviewRef.current || !app.display?.zoomLevel) return;

    const webview = webviewRef.current;
    webview.setZoomFactor(app.display.zoomLevel);
  }, [app.display?.zoomLevel, isReady]);

  // Responsive scaling: keep framed webview visible even when viewport smaller
  useEffect(() => {
    if (!responsiveEnabled) {
      const frameId = window.requestAnimationFrame(() => setResponsiveScale(1));
      return () => window.cancelAnimationFrame(frameId);
    }

    const container = responsiveContainerRef.current;
    if (!container) {
      return undefined;
    }

    const padding = 48; // account for container padding when measuring space
    let frameId: number | null = null;

    const scheduleScaleUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        if (!responsiveEnabled || !responsiveWidth || !responsiveHeight) {
          setResponsiveScale(1);
          frameId = null;
          return;
        }

        const availableWidth = Math.max(container.clientWidth - padding, 100);
        const availableHeight = Math.max(container.clientHeight - padding, 100);
        const widthScale = availableWidth / responsiveWidth;
        const heightScale = availableHeight / responsiveHeight;
        const nextScale = Math.min(1, widthScale, heightScale);
        const resolvedScale = Number.isFinite(nextScale) ? Math.max(0.3, nextScale) : 1;
        setResponsiveScale(resolvedScale);
        frameId = null;
      });
    };

    scheduleScaleUpdate();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleScaleUpdate) : null;
    if (resizeObserver) {
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', scheduleScaleUpdate);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', scheduleScaleUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [responsiveEnabled, responsiveWidth, responsiveHeight]);

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

  // Sync explicit user agent overrides once the webview is ready
  useEffect(() => {
    if (!isElectron() || !instanceId || !isReady || !window.dockyard?.webview) return;
    if (lastUserAgent.current === app.userAgent) return;

    window.dockyard.webview
      .setUserAgent(app.id, instanceId, app.userAgent ?? null)
      .then(() =>
        window.dockyard?.webview
          .reload(app.id, instanceId)
          .catch((error: Error) => console.error('Failed to reload after user agent change', error))
      )
      .catch((error: Error) => console.error('Failed to set user agent', error))
      .finally(() => {
        lastUserAgent.current = app.userAgent;
      });
  }, [app.id, app.userAgent, instanceId, isReady]);

    useEffect(() => {
      if (!isElectron() || !instanceId || !isReady || !window.dockyard?.webview) return;
      const nextMuted = app.audio?.muted ?? false;
      if (lastAudioMuted.current === nextMuted) return;

      window.dockyard.webview
        .setAudioMuted(app.id, instanceId, nextMuted)
        .catch((error: Error) => console.error('Failed to set audio mute state', error))
        .finally(() => {
          lastAudioMuted.current = nextMuted;
        });
    }, [app.audio?.muted, app.id, instanceId, isReady]);

  const showLoadingIndicator = typeof isLoading === 'boolean' ? isLoading : internalLoading;

  const loadingChip = showLoadingIndicator ? (
    <div className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1 text-[11px] font-medium text-gray-200">
      <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-indigo-300" />
      Loading…
    </div>
  ) : null;

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

  const webviewStyles = responsiveEnabled
    ? {
        width: `${responsiveWidth}px`,
        height: `${responsiveHeight}px`,
        display: 'flex',
        border: 'none',
        borderRadius: '18px',
        overflow: 'hidden',
      }
    : {
        width: '100%',
        height: '100%',
        display: 'flex',
        border: 'none',
      };

  const webviewElement = (
    <ElectronWebView
      ref={webviewRef}
      src={app.url}
      partition={partitionId}
      useragent={app.userAgent || undefined}
      webpreferences="contextIsolation=yes, nodeIntegration=no, sandbox=yes"
      style={webviewStyles}
    />
  );

  if (responsiveEnabled) {
    return (
      <div
        ref={responsiveContainerRef}
        className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-auto px-6 py-8"
        style={{ minHeight: 0 }}
      >
        <div
          className="relative rounded-3xl border border-gray-800 bg-black shadow-2xl"
          style={{
            width: `${responsiveWidth}px`,
            height: `${responsiveHeight}px`,
            transform: `scale(${responsiveScale})`,
            transformOrigin: 'top left',
          }}
        >
          <div className="absolute top-3 right-4 text-xs font-semibold text-gray-100 bg-gray-900/70 px-3 py-1 rounded-full z-10">
            {responsiveWidth} × {responsiveHeight}
          </div>
          {loadingChip}
          {webviewElement}
        </div>
      </div>
    );
  }

  // Electron environment: render webview
  return (
    <div className="flex-1 bg-gray-900 relative" style={{ minHeight: 0 }}>
      {loadingChip}
      {webviewElement}
    </div>
  );
}
