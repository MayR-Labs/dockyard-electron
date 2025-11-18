import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppSetupData } from '../../../shared/types';
import { fetchAppSetup, getCachedAppSetup } from '../services/appSetup';

type Status = 'loading' | 'success' | 'error';

interface LoadOptions {
  forceRefresh?: boolean;
  emitLoadingState?: boolean;
}

export const useAppSetup = () => {
  const initialData = getCachedAppSetup();
  const [data, setData] = useState<AppSetupData | null>(initialData);
  const dataRef = useRef<AppSetupData | null>(initialData);
  const [status, setStatus] = useState<Status>(initialData ? 'success' : 'loading');
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async ({ forceRefresh = false, emitLoadingState = true }: LoadOptions = {}) => {
      const hasCachedData = Boolean(dataRef.current);

      if (!hasCachedData && emitLoadingState) {
        setStatus('loading');
      }

      if (hasCachedData) {
        setRefreshing(true);
      }

      try {
        const result = await fetchAppSetup({ forceRefresh });
        dataRef.current = result;
        setData(result);
        setError(null);
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load app catalog');
        setStatus('error');
        throw err;
      } finally {
        if (hasCachedData) {
          setRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    load({ emitLoadingState: false }).catch(() => {
      /* handled via state */
    });
  }, [load]);

  const refresh = useCallback(() => load({ forceRefresh: true }), [load]);

  return {
    data,
    loading: status === 'loading' && !data,
    refreshing: refreshing || (status === 'loading' && !!data),
    error,
    refresh,
  };
};
