import { BrowserView } from 'electron';
import { AppManager } from './app-manager';

export class PerformanceMonitor {
  appManager;
  monitoringInterval= null;
  metricsHistory= [];
  maxHistorySize = 60; // Keep last 60 snapshots (5 minutes at 5s intervals)

  constructor(appManager) {
    this.appManager = appManager;
  }

  start() {
    if (this.monitoringInterval) {
      return;
    }

    // Collect metrics every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 5000);

    console.log('Performance monitor started');
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Performance monitor stopped');
  }

  async collectMetrics() {
    const appMetrics= [];
    let totalMemory = 0;

    // Note, we would iterate over all active app views
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

    const snapshot= {
      totalMemory,
      appMetrics,
      timestamp: Date.now(),
    };

    this.metricsHistory.unshift(snapshot);
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.pop();
    }
  }

  async collectAppMetrics(
    appId) {
      // Get process memory info using app.getAppMetrics()
      // For now, we'll use a simplified approach
      const memoryInfo = process.memoryUsage();
      
      return {
        appId,
        memoryUsage: memoryInfo.heapUsed / 1024 / 1024, // Convert bytes to MB
        cpuUsage, // CPU usage tracking would require more complex implementation
        isLoading: view.webContents.isLoading(),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Failed to collect metrics for app ${appId}:`, error);
      return null;
    }
  }

  getCurrentSnapshot() {
    return this.metricsHistory[0] || null;
  }

  getMetricsHistory()] {
    return [...this.metricsHistory];
  }

  getAppMetrics(appId)] {
    return this.metricsHistory
      .map(snapshot => snapshot.appMetrics.find(m => m.appId === appId))
      .filter((m) => m !== undefined);
  }

  getAverageMemoryUsage(appId) {
    const metrics = this.getAppMetrics(appId);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.memoryUsage, 0);
    return total / metrics.length;
  }

  getTotalAverageMemory() {
    if (this.metricsHistory.length === 0) return 0;
    
    const total = this.metricsHistory.reduce(
      (sum, snapshot) => sum + snapshot.totalMemory,
      0
    );
    return total / this.metricsHistory.length;
  }

  clearHistory() {
    this.metricsHistory = [];
  }

  getHighMemoryApps(thresholdMB = 500) { appId: string; memoryUsage= this.getCurrentSnapshot();
    if (!snapshot) return [];

    return snapshot.appMetrics
      .filter(m => m.memoryUsage > thresholdMB)
      .map(m => ({ appId: m.appId, memoryUsage: m.memoryUsage }))
      .sort((a, b) => b.memoryUsage - a.memoryUsage);
  }
}
