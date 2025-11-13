/**
 * Global TypeScript declarations for the renderer process
 */

import type { DockyardAPI } from '../../shared/types/preload';

declare global {
  interface Window {
    dockyard?: DockyardAPI;
  }
}

export {};
