import { NextFunction, Request, Response } from 'express';
import { collectDefaultMetrics, Histogram, register } from 'prom-client';

// Metrics for Prometheus / Grafana. See docs/monitoring.md

// CPU, memory, event loop... of the Node.js process (they start with "furniro_")
collectDefaultMetrics({ prefix: 'furniro_' });

// How long each request takes, by method, route and status code.
// A histogram also counts the requests: furniro_http_request_duration_seconds_count
const httpRequestDuration = new Histogram({
  name: 'furniro_http_request_duration_seconds',
  help: 'Duration of the HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3],
});

// Middleware: measures every request (except /metrics itself)
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path === '/metrics') return next();
  const stopTimer = httpRequestDuration.startTimer();

  res.on('finish', () => {
    // The route pattern (/api/v1/products/:id), not the real URL (/api/v1/products/7):
    // that way there is one line per route, not one per product
    const route = (req.route as { path?: string } | undefined)?.path;
    stopTimer({
      method: req.method,
      route: route ?? 'unknown',
      status_code: String(res.statusCode),
    });
  });

  next();
}

// GET /metrics: the text that Prometheus reads.
// With METRICS_TOKEN, it asks for "Authorization: Bearer <token>".
// Without METRICS_TOKEN, it is open on your computer and hidden (404) in production.
export async function metricsHandler(req: Request, res: Response) {
  const token = process.env.METRICS_TOKEN;
  if (!token && process.env.NODE_ENV === 'production') {
    res.status(404).end();
    return;
  }
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.status(401).end();
    return;
  }
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}
