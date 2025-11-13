/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * Vite environment type declarations
 * This file is automatically included by Vite
 */

import type { DockyardAPI } from '../../shared/types/preload';

declare global {
  interface Window {
    dockyard: DockyardAPI;
  }
}
