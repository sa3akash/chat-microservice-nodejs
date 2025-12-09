import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

// Create registry
export const metricsRegistry = new Registry();

// ---------- REQUEST METRICS ----------

// Total HTTP requests
const httpRequestCounter = new Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Request duration histogram
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

// ---------- SYSTEM METRICS (NO SETINTERVAL) ----------

// CPU Usage
const cpuUsageGauge = new Gauge({
  name: 'system_cpu_usage_percent',
  help: 'Current CPU usage percentage',
});

// Memory Usage
const memoryUsageGauge = new Gauge({
  name: 'system_memory_usage_bytes',
  help: 'Process memory usage in bytes',
  labelNames: ['type'],
});

// Event Loop Lag
const eventLoopLagGauge = new Gauge({
  name: 'node_event_loop_lag_ms',
  help: 'Current event loop lag in milliseconds',
});

// Uptime
const uptimeGauge = new Gauge({
  name: 'node_process_uptime_seconds',
  help: 'Node process uptime (seconds)',
});

// Register metrics
metricsRegistry.registerMetric(httpRequestCounter);
metricsRegistry.registerMetric(httpRequestDuration);
metricsRegistry.registerMetric(cpuUsageGauge);
metricsRegistry.registerMetric(memoryUsageGauge);
metricsRegistry.registerMetric(eventLoopLagGauge);
metricsRegistry.registerMetric(uptimeGauge);

// ---------- EVENT LOOP LAG MEASUREMENT ----------
function measureEventLoopLag(): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now();
    setImmediate(() => resolve(performance.now() - start));
  });
}

// ---------- METRICS MIDDLEWARE ----------

export function metricsMiddleware(SERVICE_NAME: string): RequestHandler {
  // Fully typed RequestHandler
  return function (req: Request, res: Response, next: NextFunction): void {
    // Skip exempt paths
    const end = httpRequestDuration.startTimer();

    // When response finished → update request metrics
    res.on('finish', async () => {
      const labels = {
        method: req.method,
        route: req.route?.path || req.originalUrl || 'unknown',
        status: String(res.statusCode),
        service: SERVICE_NAME,
      };

      httpRequestCounter.inc(labels);
      end(labels);

      // Update system metrics (NO interval)
      const mem = process.memoryUsage();
      memoryUsageGauge.set({ type: 'rss' }, mem.rss);
      memoryUsageGauge.set({ type: 'heapUsed' }, mem.heapUsed);
      memoryUsageGauge.set({ type: 'heapTotal' }, mem.heapTotal);

      cpuUsageGauge.set((process.cpuUsage().system + process.cpuUsage().user) / 1000);

      eventLoopLagGauge.set(await measureEventLoopLag());

      uptimeGauge.set(process.uptime());
    });

    next();
  };
}

// ---------- METRICS ROUTE HANDLER ----------
export function metricsRoute(_req: Request, res: Response): void {
  res.setHeader('Content-Type', metricsRegistry.contentType);
  metricsRegistry.metrics().then((d) => res.send(d));
}
