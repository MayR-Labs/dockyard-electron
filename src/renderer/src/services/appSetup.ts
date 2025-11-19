import type { AppSetupData, AppSetupApiResponse } from '../../../shared/types';
import { getApiBaseUrl } from '../utils/environment';
import { clearPopularFaviconCache, hydratePopularAppIcons } from './popularFaviconCache';
import { debugLog } from '../../../shared/utils/debug';

const CACHE_KEY = 'dockyard:app-setup';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type CachedPayload = {
  timestamp: number;
  data: AppSetupData;
};

const isCacheValid = (timestamp: number): boolean => Date.now() - timestamp < CACHE_TTL_MS;

const readCache = (): CachedPayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedPayload;
    if (!parsed?.data || !parsed.timestamp) {
      return null;
    }

    if (!isCacheValid(parsed.timestamp)) {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (data: AppSetupData): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload: CachedPayload = { data, timestamp: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Swallow storage errors silently (quota, privacy mode, etc.)
  }
};

export const getCachedAppSetup = (): AppSetupData | null => {
  const cached = readCache();
  return cached?.data ?? null;
};

interface FetchOptions {
  forceRefresh?: boolean;
}

export const fetchAppSetup = async (options: FetchOptions = {}): Promise<AppSetupData> => {
  if (!options.forceRefresh) {
    const cached = getCachedAppSetup();
    if (cached) {
      debugLog('Using cached app setup data');
      return cached;
    }
  }

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/app/setup`, {
    headers: { Accept: 'application/json' },
  });

  debugLog('App setup fetch response', { status: response.status, ok: response.ok });

  if (!response.ok) {
    throw new Error('Failed to fetch app catalog');
  }

  let payload: AppSetupApiResponse;
  try {
    payload = (await response.json()) as AppSetupApiResponse;
  } catch {
    throw new Error('Received malformed app catalog response');
  }

  if (payload.status !== 'success' || !payload.data) {
    throw new Error(payload.message || 'Unable to load app catalog');
  }

  const hydratedApps = await hydratePopularAppIcons(payload.data.apps);
  const decoratedPayload: AppSetupData = {
    ...payload.data,
    apps: hydratedApps,
  };

  writeCache(decoratedPayload);
  return decoratedPayload;
};

export const invalidateAppSetupCache = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(CACHE_KEY);
  clearPopularFaviconCache();
};
