import { BrowserView } from 'electron';
import { AppManager } from './app-manager';

export interface AppPerformanceMetrics {
  appId: string;
  memoryUsage: number; // in MB
  cpuUsage: number; // percentage
  isLoading: boolean;
  timestamp: number;
}

export interface PerformanceSnapshot {
  totalMemory: number; // in MB
  appMetrics: AppPerformanceMetrics[];
  timestamp: number;
}

export class PerformanceMonitor {
  private appManager: AppManager;
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private metricsHistory: PerformanceSnapshot[] = [];
  private maxHistorySize = 60; // Keep last 60 snapshots (5 minutes at 5s intervals)

  constructor(appManager: AppManager) {
    this.appManager = appManager;
  }

  start(): void {
    if (this.monitoringInterval) {
      return;
    }

    // Collect metrics every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 5000);

    console.log('Performance monitor started');
  }

  stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Performance monitor stopped');
  }

  private async collectMetrics(): Promise<void> {
    const appMetrics: AppPerformanceMetrics[] = [];
    let totalMemory = 0;

    // Note: In a real implementation, we would iterate over all active app views
    // For now, this is a simplified version
    const currentAppId = this.appManager.getCurrentAppId();
    
    if (currentAppId) {
      const view = this.appManager.getView(currentAppId);
      if (view) {
        const metrics = await this.collectAppMetrics(currentAppId, view);
        if (metrics) {
          appMetrics.push(metrics);
          totalMemory += metrics.memoryUsage;
        }
      }
    }

    const snapshot: PerformanceSnapshot = {
      totalMemory,
      appMetrics,
      timestamp: Date.now(),
    };

    this.metricsHistory.unshift(snapshot);
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.pop();
    }
  }

  private async collectAppMetrics(
    appId: string,
    view: BrowserView
  ): Promise<AppPerformanceMetrics | null> {
    try {
      // Get process memory info using app.getAppMetrics()
      // For now, we'll use a simplified approach
      const memoryInfo = process.memoryUsage();
      
      return {
        appId,
        memoryUsage: memoryInfo.heapUsed / 1024 / 1024, // Convert bytes to MB
        cpuUsage: 0, // CPU usage tracking would require more complex implementation
        isLoading: view.webContents.isLoading(),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Failed to collect metrics for app ${appId}:`, error);
      return null;
    }
  }

  getCurrentSnapshot(): PerformanceSnapshot | null {
    return this.metricsHistory[0] || null;
  }

  getMetricsHistory(): PerformanceSnapshot[] {
    return [...this.metricsHistory];
  }

  getAppMetrics(appId: string): AppPerformanceMetrics[] {
    return this.metricsHistory
      .map(snapshot => snapshot.appMetrics.find(m => m.appId === appId))
      .filter((m): m is AppPerformanceMetrics => m !== undefined);
  }

  getAverageMemoryUsage(appId: string): number {
    const metrics = this.getAppMetrics(appId);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.memoryUsage, 0);
    return total / metrics.length;
  }

  getTotalAverageMemory(): number {
    if (this.metricsHistory.length === 0) return 0;
    
    const total = this.metricsHistory.reduce(
      (sum, snapshot) => sum + snapshot.totalMemory,
      0
    );
    return total / this.metricsHistory.length;
  }

  clearHistory(): void {
    this.metricsHistory = [];
  }

  getHighMemoryApps(thresholdMB = 500): Array<{ appId: string; memoryUsage: number }> {
    const snapshot = this.getCurrentSnapshot();
    if (!snapshot) return [];

    return snapshot.appMetrics
      .filter(m => m.memoryUsage > thresholdMB)
      .map(m => ({ appId: m.appId, memoryUsage: m.memoryUsage }))
      .sort((a, b) => b.memoryUsage - a.memoryUsage);
  }
}
