import express from 'express';
import request from 'supertest';
import { metricsHandler, metricsMiddleware } from './metrics';

// A small Express app with one route, so we do not need the database
function buildApp() {
  const app = express();
  app.use(metricsMiddleware);
  app.get('/metrics', metricsHandler);
  app.get('/products/:id', (req, res) => {
    res.json({ id: req.params.id });
  });
  return app;
}

describe('metrics', () => {
  afterEach(() => {
    delete process.env.METRICS_TOKEN;
  });

  it('counts the requests by route pattern', async () => {
    const app = buildApp();
    await request(app).get('/products/7');

    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain(
      'furniro_http_request_duration_seconds_count{method="GET",route="/products/:id",status_code="200"} 1',
    );
    expect(response.text).toContain('furniro_process_cpu_seconds_total');
  });

  it('asks for the token when METRICS_TOKEN exists', async () => {
    process.env.METRICS_TOKEN = 'secret-test-token';
    const app = buildApp();

    expect((await request(app).get('/metrics')).status).toBe(401);
    const response = await request(app)
      .get('/metrics')
      .set('Authorization', 'Bearer secret-test-token');
    expect(response.status).toBe(200);
  });
});
