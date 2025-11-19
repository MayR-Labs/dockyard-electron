/**
 * Performance Dashboard Component
 * Displays memory, CPU usage, and other metrics for running apps
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type ViewEntry = {
  appId: string;
  instanceId: string;
  partitionId: string;
  lastActive: number;
  isActive: boolean;
};

type ViewSource = 'webview' | 'browserView';

interface AppMetrics {
  appId: string;
  instanceId: string;
  appName: string;
  memoryUsage: {
    workingSetSize: number;
    privateBytes: number;
  };
  cpuUsage: number;
  lastActive: number;
  isActive: boolean;
}

interface PerformanceDashboardProps {
  onClose?: () => void;
}

export function PerformanceDashboard({ onClose }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<AppMetrics[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    let isCancelled = false;

    const getActiveViews = async (): Promise<{ source: ViewSource; views: ViewEntry[] }> => {
      if (typeof window === 'undefined' || !window.dockyard) {
        return { source: 'webview', views: [] };
      }

      try {
        const webviewViews = await window.dockyard.webview.getAll();
        if (webviewViews.length > 0) {
          return { source: 'webview', views: webviewViews };
        }
      } catch (error) {
        console.warn('WebView metrics unavailable:', error);
      }

      try {
        const browserViews = await window.dockyard.browserView.getAll();
        if (browserViews.length > 0) {
          return { source: 'browserView', views: browserViews };
        }
      } catch (error) {
        console.warn('BrowserView metrics unavailable:', error);
      }

      return { source: 'webview', views: [] };
    };

    const fetchMetrics = async () => {
      if (typeof window === 'undefined' || !window.dockyard) {
        return;
      }

      try {
        const [{ source, views }, apps] = await Promise.all([
          getActiveViews(),
          window.dockyard.apps.list(),
        ]);

        const metricsApi =
          source === 'webview' ? window.dockyard.webview : window.dockyard.browserView;

        const metricsPromises = views.map(async (view) => {
          const app = apps.find((a) => a.id === view.appId);
          const [memory, cpu] = await Promise.all([
            metricsApi.getMemory(view.appId, view.instanceId),
            metricsApi.getCPU(view.appId, view.instanceId),
          ]);

          return {
            appId: view.appId,
            instanceId: view.instanceId,
            appName: app?.name || 'Unknown',
            memoryUsage: memory,
            cpuUsage: cpu,
            lastActive: view.lastActive,
            isActive: view.isActive,
          };
        });

        const allMetrics = await Promise.all(metricsPromises);
        if (!isCancelled) {
          setMetrics(allMetrics);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to fetch metrics:', error);
          setMetrics([]);
        }
      }
    };

    fetchMetrics();
    const interval = window.setInterval(fetchMetrics, 3000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    const seconds = Math.max(0, Math.floor((currentTime - timestamp) / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const totalMemory = metrics.reduce((sum, m) => sum + m.memoryUsage.workingSetSize, 0);
  const avgCPU =
    metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Performance Monitor</h2>
            <p className="text-sm text-gray-400">Real-time app metrics and resource usage</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            {autoRefresh ? '● Auto-refresh' : 'Auto-refresh Off'}
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Close"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Apps</span>
            <span className="text-2xl">📱</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.length}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Memory</span>
            <span className="text-2xl">🧠</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatBytes(totalMemory)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Avg CPU</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-bold text-white">{avgCPU.toFixed(1)}%</div>
        </div>
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-auto p-6">
        {metrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Apps</h3>
            <p className="text-gray-500">Open some apps to see their performance metrics</p>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.map((metric) => (
              <motion.div
                key={`${metric.appId}-${metric.instanceId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{metric.appName}</h3>
                      {metric.isActive && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Instance: {metric.instanceId.slice(0, 8)}
                    </p>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    Last active: {formatTime(metric.lastActive)}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Memory Usage */}
                  <div className="bg-gray-900/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase font-medium">Memory</span>
                      <span className="text-xs text-indigo-400">
                        {formatBytes(metric.memoryUsage.workingSetSize)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (metric.memoryUsage.workingSetSize / (500 * 1024 * 1024)) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Private: {formatBytes(metric.memoryUsage.privateBytes)}
                    </div>
                  </div>

                  {/* CPU Usage */}
                  <div className="bg-gray-900/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase font-medium">CPU</span>
                      <span className="text-xs text-green-400">{metric.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, metric.cpuUsage)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {metric.cpuUsage > 50 ? '⚠️ High usage' : '✓ Normal'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>Updates every 3 seconds</span>
        <span>Press Esc to close</span>
      </div>
    </motion.div>
  );
}
