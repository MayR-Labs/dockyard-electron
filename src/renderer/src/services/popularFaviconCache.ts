import type { PopularApp } from '../../../shared/types';
import { downloadFavicon } from '../utils/favicon';

const FAVICON_CACHE_KEY = 'dockyard:popular-favicons:v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PREFETCH_LIMIT = 60;
const PREFETCH_CONCURRENCY = 4;

type CacheEntry = {
  dataUrl: string;
  timestamp: number;
};

type CacheStore = Record<string, CacheEntry>;

let memoryCache: CacheStore | null = null;

const isBrowser = (): boolean => typeof window !== 'undefined';

const persistCache = (cache: CacheStore) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
};

const pruneExpiredEntries = (cache: CacheStore): void => {
  const now = Date.now();
  let mutated = false;

  Object.keys(cache).forEach((key) => {
    const entry = cache[key];
    if (!entry || now - entry.timestamp > CACHE_TTL_MS) {
      delete cache[key];
      mutated = true;
    }
  });

  if (mutated) {
    persistCache(cache);
  }
};

const getCache = (): CacheStore => {
  if (memoryCache) {
    return memoryCache;
  }

  if (!isBrowser()) {
    memoryCache = {};
    return memoryCache;
  }

  try {
    const raw = window.localStorage.getItem(FAVICON_CACHE_KEY);
    memoryCache = raw ? (JSON.parse(raw) as CacheStore) : {};
  } catch {
    memoryCache = {};
  }

  pruneExpiredEntries(memoryCache);
  return memoryCache;
};

const setCacheEntry = (appId: string, dataUrl: string): void => {
  const cache = getCache();
  cache[appId] = { dataUrl, timestamp: Date.now() };
  persistCache(cache);
};

const fetchFavicons = async (
  apps: PopularApp[],
  limit: number,
  concurrency: number
): Promise<Record<string, string>> => {
  const queue = apps.slice(0, limit);
  const results: Record<string, string> = {};
  let cursor = 0;

  const worker = async () => {
    while (true) {
      const index = cursor++;
      const target = queue[index];
      if (!target) {
        break;
      }

      const dataUrl = await downloadFavicon(target.url);
      if (dataUrl) {
        setCacheEntry(target.id, dataUrl);
        results[target.id] = dataUrl;
      }
    }
  };

  const workerCount = Math.min(concurrency, queue.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
};

interface HydrationOptions {
  limit?: number;
  concurrency?: number;
}

export const hydratePopularAppIcons = async (
  apps: PopularApp[],
  options: HydrationOptions = {}
): Promise<PopularApp[]> => {
  if (!apps.length || !isBrowser()) {
    return apps;
  }

  const cache = getCache();
  const hydrated = apps.map((app) => {
    const cached = cache[app.id];
    return cached ? { ...app, logo_url: cached.dataUrl } : app;
  });

  const missing = apps.filter((app) => !cache[app.id]);
  if (!missing.length) {
    return hydrated;
  }

  const limit = options.limit ?? PREFETCH_LIMIT;
  const concurrency = options.concurrency ?? PREFETCH_CONCURRENCY;
  const fetched = await fetchFavicons(missing, limit, concurrency);

  if (!Object.keys(fetched).length) {
    return hydrated;
  }

  return hydrated.map((app) => {
    const dataUrl = fetched[app.id];
    return dataUrl ? { ...app, logo_url: dataUrl } : app;
  });
};

export const clearPopularFaviconCache = (): void => {
  if (!isBrowser()) {
    return;
  }
  memoryCache = {};
  try {
    window.localStorage.removeItem(FAVICON_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
};
