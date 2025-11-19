/**
 * App Tile Component
 * Displays a single app with navigation controls and toolbar
 * Single Responsibility: Render individual app view
 */

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { FindInPageOptions } from 'electron';
import { App } from '../../../../shared/types/app';
import { AppShortcutSignal } from '../../types/shortcuts';
import { debugError } from '../../../../shared/utils/debug';
import {
  MenuDotsIcon,
  SearchIcon,
  CloseIcon,
  PrintIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  VolumeOnIcon,
  VolumeOffIcon,
} from '../Icons';
import { NavigationControls } from '../AppControls/NavigationControls';
import { URLBar } from '../AppControls/URLBar';
import { WebViewContainer } from '../Layout/WebViewContainer';
import { useAppInstance } from '../../hooks/useAppInstance';
import { useNavigationState } from '../../hooks/useNavigationState';
import { isElectron } from '../../utils/environment';

interface AppTileProps {
  app: App;
  isActive: boolean;
  isAwake: boolean;
  onSelect: () => void;
  onWakeApp?: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  onOpenOptions?: () => void;
  activeInstanceId?: string;
  shortcutSignal?: AppShortcutSignal | null;
  onToggleMute?: (appId: string, muted: boolean, instanceId?: string) => void;
}

export function AppTile({
  app,
  isActive,
  isAwake,
  onSelect,
  onWakeApp,
  onUpdateApp,
  onOpenOptions,
  activeInstanceId,
  shortcutSignal,
  onToggleMute,
}: AppTileProps) {
  // Use custom hooks for instance and navigation management
  const { instanceId, isCreating } = useAppInstance(app, activeInstanceId, onUpdateApp);
  const effectiveInstanceId = isAwake ? instanceId : undefined;
  const { navigationState, goBack, goForward, reload, goHome, navigate } = useNavigationState(
    app,
    effectiveInstanceId
  );
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const findInputRef = useRef<HTMLInputElement>(null);
  const processedShortcutRef = useRef<number>(0);
  const isMuted = app.audio?.muted ?? false;

  const handleWakeApp = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (!isAwake && onWakeApp) {
      onWakeApp();
    }
  };

  const handledGoBack = () => {
    if (!isAwake) return;
    goBack();
  };

  const handledGoForward = () => {
    if (!isAwake) return;
    goForward();
  };

  const handledReload = () => {
    if (!isAwake) return;
    reload();
  };

  const handledHome = () => {
    if (!isAwake) return;
    goHome();
  };

  const handledNavigate = (url: string) => {
    if (!isAwake) return;
    navigate(url);
  };

  const handleToggleMute = () => {
    if (!onToggleMute) return;
    onToggleMute(app.id, !isMuted, instanceId);
  };

  const stopFind = useCallback(
    (action: 'clearSelection' | 'keepSelection' | 'activateSelection' = 'clearSelection') => {
      if (!isElectron() || !isAwake || !instanceId || !window.dockyard?.webview) return;
      window.dockyard?.webview
        .stopFindInPage(app.id, instanceId, action)
        .catch((error: unknown) => debugError('Failed to stop find in page', error));
    },
    [app.id, instanceId, isAwake]
  );

  const runFind = useCallback(
    (query: string, options?: FindInPageOptions) => {
      if (!isElectron() || !isAwake || !instanceId || !query || !window.dockyard?.webview) return;
      window.dockyard?.webview
        .findInPage(app.id, instanceId, query, options)
        .catch((error: unknown) => debugError('Failed to run find in page', error));
    },
    [app.id, instanceId, isAwake]
  );

  const handlePrint = useCallback(() => {
    if (!isElectron() || !isAwake || !instanceId || !window.dockyard?.webview) return;
    window.dockyard?.webview
      .print(app.id, instanceId)
      .catch((error: unknown) => debugError('Failed to print page', error));
  }, [app.id, instanceId, isAwake]);

  const openFind = useCallback(() => {
    if (!isAwake) return;
    setIsFindOpen(true);
    requestAnimationFrame(() => {
      findInputRef.current?.focus();
      if (findQuery) {
        runFind(findQuery, { forward: true, findNext: false, matchCase });
      }
    });
  }, [isAwake, findQuery, matchCase, runFind]);

  const closeFind = useCallback(
    (clearQuery: boolean = false) => {
      setIsFindOpen(false);
      if (clearQuery) {
        setFindQuery('');
      }
      stopFind('clearSelection');
    },
    [stopFind]
  );

  const handleFindInputChange = (value: string) => {
    setFindQuery(value);
    if (!value) {
      stopFind('clearSelection');
      return;
    }
    runFind(value, { forward: true, findNext: false, matchCase });
  };

  const handleFindNavigate = (direction: 'forward' | 'backward') => {
    if (!findQuery) return;
    runFind(findQuery, {
      forward: direction === 'forward',
      findNext: true,
      matchCase,
    });
  };

  useEffect(() => {
    if (!shortcutSignal || shortcutSignal.appId !== app.id) return;
    if (processedShortcutRef.current === shortcutSignal.timestamp) return;
    processedShortcutRef.current = shortcutSignal.timestamp;

    const currentShortcut = shortcutSignal;
    queueMicrotask(() => {
      if (currentShortcut.type === 'find') {
        openFind();
      } else if (currentShortcut.type === 'print') {
        handlePrint();
      }
    });
  }, [shortcutSignal, app.id, openFind, handlePrint]);

  useEffect(() => {
    if (!isFindOpen) return;
    if (!isActive || !isAwake) {
      stopFind('clearSelection');
    }
  }, [isActive, isAwake, isFindOpen, stopFind]);

  useEffect(() => {
    if (!isFindOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeFind();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFindOpen, closeFind]);

  useEffect(() => {
    if (isElectron() || !isActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (!isModifier || event.altKey) return;
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        openFind();
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, openFind, handlePrint]);

  // Keep the component mounted but hide it when not active
  // This preserves the webview state instead of destroying it
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col bg-gray-900"
      style={{ pointerEvents: isActive ? 'auto' : 'none', zIndex: isActive ? 2 : 1 }}
      onClick={onSelect}
      aria-hidden={!isActive}
    >
      {/* Micro-toolbar */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Navigation Controls */}
          <NavigationControls
            canGoBack={isAwake && navigationState.canGoBack}
            canGoForward={isAwake && navigationState.canGoForward}
            isLoading={isAwake && navigationState.isLoading}
            onBack={handledGoBack}
            onForward={handledGoForward}
            onReload={handledReload}
            onHome={handledHome}
          />

          {/* URL Bar */}
          <URLBar
            url={isAwake ? navigationState.url || app.url : app.url}
            isLoading={isAwake && navigationState.isLoading}
            onNavigate={handledNavigate}
          />

          {/* App Info */}
          <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-3">
            {app.icon && <img src={app.icon} alt={app.name} className="w-5 h-5 rounded" />}

            <span className="text-sm font-medium text-gray-300">{app.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMute();
            }}
            className={`p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-700 ${
              isMuted ? 'text-amber-300' : ''
            }`}
            title={isMuted ? 'Unmute app' : 'Mute app'}
          >
            {isMuted ? <VolumeOffIcon className="w-4 h-4" /> : <VolumeOnIcon className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openFind();
            }}
            disabled={!isAwake}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-40"
            title="Find in page (Cmd/Ctrl+F)"
          >
            <SearchIcon className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrint();
            }}
            disabled={!isAwake}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-40"
            title="Print (Cmd/Ctrl+P)"
          >
            <PrintIcon className="w-4 h-4" />
          </button>

          {/* Options Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenOptions) {
                onOpenOptions();
              }
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Options"
          >
            <MenuDotsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App content area - WebView Container or Hibernated Screen */}
      {isAwake ? (
        <WebViewContainer
          app={app}
          instanceId={instanceId}
          isCreating={isCreating}
          isLoading={navigationState.isLoading}
        />
      ) : (
        <HibernatedPlaceholder
          appName={app.name}
          appIcon={app.icon}
          isActive={isActive}
          onWakeApp={handleWakeApp}
        />
      )}

      {isFindOpen && isAwake && isActive && (
        <div
          className="absolute top-12 right-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/95 px-3 py-2 shadow-2xl w-[380px] max-w-full backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            ref={findInputRef}
            value={findQuery}
            onChange={(e) => handleFindInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleFindNavigate(e.shiftKey ? 'backward' : 'forward');
              }
            }}
            placeholder="Find in page"
            className="flex-1 bg-gray-800 rounded-lg px-2 py-1 text-sm text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <label className="flex items-center gap-1 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => {
                setMatchCase(e.target.checked);
                if (findQuery) {
                  runFind(findQuery, {
                    forward: true,
                    findNext: false,
                    matchCase: e.target.checked,
                  });
                }
              }}
              className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500"
            />
            Match case
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFindNavigate('backward')}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
              title="Previous match"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFindNavigate('forward')}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
              title="Next match"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => closeFind(true)}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
            title="Close find"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

interface HibernatedPlaceholderProps {
  appName: string;
  appIcon?: string;
  isActive: boolean;
  onWakeApp?: (e?: MouseEvent) => void;
}

function HibernatedPlaceholder({
  appName,
  appIcon,
  isActive,
  onWakeApp,
}: HibernatedPlaceholderProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950 relative overflow-hidden">
      <div className="text-center px-8 py-10">
        <div className="mb-6 flex flex-col items-center gap-3">
          {appIcon ? (
            <img src={appIcon} alt={appName} className="w-12 h-12 rounded-xl opacity-80" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">
              💤
            </div>
          )}
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-400 font-semibold">
              Hibernated
            </p>
            <h3 className="text-2xl font-semibold text-white mt-1">{appName}</h3>
          </div>
        </div>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          This app is snoozing to save resources. Wake it up when you&apos;re ready to jump back in.
        </p>
        <button
          onClick={onWakeApp}
          disabled={!isActive}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Wake App
        </button>
        {!isActive && <p className="text-xs text-gray-600 mt-3">Select this app to wake it.</p>}
      </div>
    </div>
  );
}
