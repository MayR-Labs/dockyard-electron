/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * Vite environment type declarations
 * This file is automatically included by Vite
 */

import type { DockyardAPI } from '../../shared/types/preload';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    dockyard: DockyardAPI;
  }
}
