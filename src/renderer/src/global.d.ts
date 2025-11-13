/**
 * Global TypeScript declarations for the renderer process
 */

import type { DockyardAPI } from '../../shared/types/preload';

declare global {
  interface Window {
    dockyard?: DockyardAPI;
  }

  // Webview element type declaration for Electron
  interface HTMLWebViewElement extends HTMLElement {
    src: string;
    partition: string;
    allowpopups: string;
    setZoomFactor: (factor: number) => void;
    getZoomFactor: () => number;
    insertCSS: (css: string) => void;
    executeJavaScript: (code: string) => Promise<any>;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    goBack: () => void;
    goForward: () => void;
    reload: () => void;
    stop: () => void;
    loadURL: (url: string) => void;
    getURL: () => string;
    getTitle: () => string;
    isLoading: () => boolean;
    isWaitingForResponse: () => boolean;
    openDevTools: () => void;
    closeDevTools: () => void;
    inspectElement: (x: number, y: number) => void;
    clearHistory: () => void;
    showDefinitionForSelection: () => void;
    capturePage: (callback: (image: any) => void) => void;
  }

  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLWebViewElement> & {
          src?: string;
          partition?: string;
          allowpopups?: string;
          preload?: string;
          nodeintegration?: string;
          plugins?: string;
          disablewebsecurity?: string;
          webpreferences?: string;
        },
        HTMLWebViewElement
      >;
    }
  }
}

export {};
