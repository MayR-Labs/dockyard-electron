import { useCallback, useEffect, useRef, useState } from 'react';
import { IPC_EVENTS } from '../../../shared/constants';
import type { App as AppType } from '../../../shared/types/app';
import type { AppShortcutSignal, AppShortcutSignalType } from '../types/shortcuts';
import { debugError, debugLog } from '../../../shared/utils/debug';

type UseAppRuntimeParams = {
  apps: AppType[];
  resumeApp: (appId: string, instanceId: string) => Promise<void>;
  hibernateApp: (appId: string, instanceId: string) => Promise<void>;
  loadApps: () => Promise<void>;
  updateApp: (id: string, data: Partial<AppType>) => Promise<void>;
};

type UseAppRuntimeResult = {
  awakeApps: Record<string, boolean>;
  activeInstances: Record<string, string>;
  shortcutSignal: AppShortcutSignal | null;
  handleWakeAppRequest: (appId: string, instanceId?: string) => Promise<void>;
  handleHibernateAppRequest: (appId: string, instanceId?: string) => Promise<void>;
  handleToggleMute: (appId: string, muted: boolean, instanceId?: string) => Promise<void>;
  registerActiveApp: (appId: string | null) => void;
};

export function useAppRuntime({
  apps,
  resumeApp,
  hibernateApp,
  loadApps,
  updateApp,
}: UseAppRuntimeParams): UseAppRuntimeResult {
  const [awakeApps, setAwakeApps] = useState<Record<string, boolean>>({});
  const [activeInstances, setActiveInstances] = useState<Record<string, string>>({});
  const [shortcutSignal, setShortcutSignal] = useState<AppShortcutSignal | null>(null);

  const activeAppIdRef = useRef<string | null>(null);
  const awakeAppsRef = useRef<Record<string, boolean>>({});

  const registerActiveApp = useCallback((appId: string | null) => {
    activeAppIdRef.current = appId;
  }, []);

  useEffect(() => {
    awakeAppsRef.current = awakeApps;
  }, [awakeApps]);

  const setAppAwakeState = useCallback((appId: string, awake: boolean) => {
    setAwakeApps((prev) => {
      if (awake) {
        if (prev[appId]) return prev;
        return { ...prev, [appId]: true };
      }

      if (!prev[appId]) return prev;
      const { [appId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const activeInstancesRef = useRef<Record<string, string>>({});
  useEffect(() => {
    activeInstancesRef.current = activeInstances;
  }, [activeInstances]);

  const getInstanceId = useCallback(
    (appId: string, explicitInstanceId?: string) => {
      if (explicitInstanceId) return explicitInstanceId;
      const app = apps.find((a) => a.id === appId);
      if (!app) return undefined;

      const preferred = activeInstancesRef.current[appId];
      if (preferred && app.instances.some((inst) => inst.id === preferred)) {
        return preferred;
      }

      return app.instances[0]?.id;
    },
    [apps]
  );

  const getInstanceIdRef = useRef(getInstanceId);
  useEffect(() => {
    getInstanceIdRef.current = getInstanceId;
  }, [getInstanceId]);

  const handleWakeAppRequest = useCallback(
    async (appId: string, instanceId?: string) => {
      const targetInstanceId = getInstanceId(appId, instanceId);
      if (!targetInstanceId) return;

      setAppAwakeState(appId, true);
      debugLog('Requesting wake for app instance', { appId, instanceId: targetInstanceId });
      try {
        await resumeApp(appId, targetInstanceId);
        debugLog('App instance wake succeeded', { appId, instanceId: targetInstanceId });
      } catch (error) {
        debugError('Failed to resume app instance', error);
        setAppAwakeState(appId, false);
      }
    },
    [getInstanceId, resumeApp, setAppAwakeState]
  );

  const handleHibernateAppRequest = useCallback(
    async (appId: string, instanceId?: string) => {
      const targetInstanceId = getInstanceId(appId, instanceId);
      if (!targetInstanceId) return;

      debugLog('Requesting hibernation for app instance', { appId, instanceId: targetInstanceId });
      try {
        await hibernateApp(appId, targetInstanceId);
      } catch (error) {
        debugError('Failed to hibernate app instance', error);
      } finally {
        setAppAwakeState(appId, false);
      }
    },
    [getInstanceId, hibernateApp, setAppAwakeState]
  );

  useEffect(() => {
    setAwakeApps((prev) => {
      const validIds = new Set(apps.map((app) => app.id));
      const next: Record<string, boolean> = {};
      for (const id of Object.keys(prev)) {
        if (validIds.has(id) && prev[id]) {
          next[id] = true;
        }
      }
      return next;
    });
  }, [apps]);

  useEffect(() => {
    setActiveInstances((prev) => {
      let changed = false;
      const next = { ...prev };

      const validAppIds = new Set(apps.map((app) => app.id));
      for (const appId of Object.keys(next)) {
        if (!validAppIds.has(appId)) {
          delete next[appId];
          changed = true;
        }
      }

      apps.forEach((app) => {
        if (app.instances.length === 0) {
          if (next[app.id]) {
            delete next[app.id];
            changed = true;
          }
          return;
        }

        const current = next[app.id];
        const hasCurrent = current && app.instances.some((inst) => inst.id === current);
        if (!hasCurrent) {
          next[app.id] = app.instances[0].id;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [apps]);

  const emitShortcutToActiveApp = useCallback((type: AppShortcutSignalType) => {
    const targetAppId = activeAppIdRef.current;
    if (!targetAppId) return;
    setShortcutSignal({ appId: targetAppId, type, timestamp: Date.now() });
  }, []);

  useEffect(() => {
    if (!window.dockyard?.on || !window.dockyard?.off) {
      return undefined;
    }

    const handleAppUpdated = () => {
      debugLog('IPC app update event received');
      loadApps().catch((error: unknown) => {
        debugError('Failed to refresh apps after update event', error);
      });
    };

    const handleAppHibernateRequest = (...args: unknown[]) => {
      const [payload] = args as [{ appId?: string; instanceId?: string }?];
      if (!payload?.appId) {
        return;
      }

      void handleHibernateAppRequest(payload.appId, payload.instanceId);
    };

    window.dockyard.on(IPC_EVENTS.APP_UPDATED, handleAppUpdated);
    window.dockyard.on(IPC_EVENTS.APP_HIBERNATE_REQUEST, handleAppHibernateRequest);

    return () => {
      window.dockyard?.off(IPC_EVENTS.APP_UPDATED, handleAppUpdated);
      window.dockyard?.off(IPC_EVENTS.APP_HIBERNATE_REQUEST, handleAppHibernateRequest);
    };
  }, [handleHibernateAppRequest, loadApps]);

  useEffect(() => {
    if (!window.dockyard?.on || !window.dockyard?.off || !window.dockyard?.webview) {
      return undefined;
    }

    const performReload = (ignoreCache: boolean) => {
      const currentAppId = activeAppIdRef.current;
      if (!currentAppId) return;
      if (!awakeAppsRef.current[currentAppId]) return;
      const instanceId = getInstanceIdRef.current(currentAppId);
      if (!instanceId) return;

      const action = ignoreCache
        ? window.dockyard.webview.forceReload
        : window.dockyard.webview.reload;

      action(currentAppId, instanceId).catch((error: unknown) => {
        debugError(ignoreCache ? 'Force reload failed' : 'Reload failed', error);
      });
    };

    const toggleAppDevtools = () => {
      const currentAppId = activeAppIdRef.current;
      if (!currentAppId) return;
      if (!awakeAppsRef.current[currentAppId]) return;
      const instanceId = getInstanceIdRef.current(currentAppId);
      if (!instanceId) return;

      window.dockyard.webview.toggleDevTools(currentAppId, instanceId).catch((error: unknown) => {
        debugError('Failed to toggle app devtools', error);
      });
    };

    const reloadListener = () => performReload(false);
    const forceReloadListener = () => performReload(true);
    const toggleDevtoolsListener = () => toggleAppDevtools();
    const shortcutFindListener = () => emitShortcutToActiveApp('find');
    const shortcutPrintListener = () => emitShortcutToActiveApp('print');

    window.dockyard.on(IPC_EVENTS.SHORTCUT_RELOAD, reloadListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_FORCE_RELOAD, forceReloadListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS, toggleDevtoolsListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_FIND, shortcutFindListener);
    window.dockyard.on(IPC_EVENTS.SHORTCUT_PRINT, shortcutPrintListener);
    debugLog('Registered runtime shortcut listeners');

    return () => {
      window.dockyard?.off(IPC_EVENTS.SHORTCUT_RELOAD, reloadListener);
      window.dockyard?.off(IPC_EVENTS.SHORTCUT_FORCE_RELOAD, forceReloadListener);
      window.dockyard?.off(IPC_EVENTS.SHORTCUT_TOGGLE_DEVTOOLS, toggleDevtoolsListener);
      window.dockyard?.off(IPC_EVENTS.SHORTCUT_FIND, shortcutFindListener);
      window.dockyard?.off(IPC_EVENTS.SHORTCUT_PRINT, shortcutPrintListener);
    };
  }, [emitShortcutToActiveApp]);

  const handleToggleMute = useCallback(
    async (appId: string, muted: boolean, instanceId?: string) => {
      await updateApp(appId, {
        audio: {
          muted,
        },
      });

      const targetInstanceId = instanceId ?? getInstanceIdRef.current(appId);
      if (!targetInstanceId) {
        return;
      }

      if (window.dockyard?.webview?.setAudioMuted) {
        window.dockyard.webview
          .setAudioMuted(appId, targetInstanceId, muted)
          .catch((error: unknown) => {
            debugError('Failed to toggle audio mute', error);
          });
      }
    },
    [updateApp]
  );

  return {
    awakeApps,
    activeInstances,
    shortcutSignal,
    handleWakeAppRequest,
    handleHibernateAppRequest,
    handleToggleMute,
    registerActiveApp,
  };
}
