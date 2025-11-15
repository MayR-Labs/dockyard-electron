/**
 * App Tile Component
 * Displays a single app with navigation controls and toolbar
 * Single Responsibility: Render individual app view
 */

import { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { MenuDotsIcon } from '../Icons';
import { NavigationControls } from '../AppControls/NavigationControls';
import { URLBar } from '../AppControls/URLBar';
import { WebViewContainer } from '../Layout/WebViewContainer';
import { useAppInstance } from '../../hooks/useAppInstance';
import { useNavigationState } from '../../hooks/useNavigationState';

interface AppTileProps {
  app: App;
  isActive: boolean;
  isAwake: boolean;
  onSelect: () => void;
  onWakeApp?: () => void;
  onUpdateApp?: (id: string, data: Partial<App>) => void;
  onOpenOptions?: () => void;
}

export function AppTile({
  app,
  isActive,
  isAwake,
  onSelect,
  onWakeApp,
  onUpdateApp,
  onOpenOptions,
}: AppTileProps) {
  // Use custom hooks for instance and navigation management
  const { instanceId, isCreating } = useAppInstance(app, onUpdateApp);
  const effectiveInstanceId = isAwake ? instanceId : undefined;
  const { navigationState, goBack, goForward, reload, goHome, navigate } = useNavigationState(
    app,
    effectiveInstanceId
  );

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
        <WebViewContainer app={app} instanceId={instanceId} isCreating={isCreating} />
      ) : (
        <HibernatedPlaceholder
          appName={app.name}
          appIcon={app.icon}
          isActive={isActive}
          onWakeApp={handleWakeApp}
        />
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

function HibernatedPlaceholder({ appName, appIcon, isActive, onWakeApp }: HibernatedPlaceholderProps) {
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
            <p className="text-sm uppercase tracking-wide text-indigo-400 font-semibold">Hibernated</p>
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
        {!isActive && (
          <p className="text-xs text-gray-600 mt-3">Select this app to wake it.</p>
        )}
      </div>
    </div>
  );
}
