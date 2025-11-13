/**
 * Global TypeScript declarations for the renderer process
 * This file augments the global Window interface with Dockyard API
 */

/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type { DockyardAPI } from '../../shared/types/preload';

declare global {
  /**
   * Window object augmentation with Dockyard API
   */
  interface Window {
    dockyard: DockyardAPI;
  }

  // Explicitly declare window and document as available globals
  const window: Window & typeof globalThis;
  const document: Document;
  const console: Console;
}

export {};
