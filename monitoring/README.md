# Monitoring (Prometheus, Grafana and Loki)

Optional. The normal `docker compose up -d` still starts only PostgreSQL.

## Metrics and alerts

```bash
docker compose --profile monitoring up -d   # PostgreSQL + Prometheus + Grafana + Mailpit
cd api && npm run start:dev                 # the API, on your computer
```

| What | Where |
|---|---|
| Metrics of the API | http://localhost:3000/metrics |
| Prometheus | http://localhost:9090 (Status > Target health: `furniro-api` must be UP) |
| Grafana | http://localhost:3001 (`admin` / `admin`), dashboard Furniro > Furniro API |
| Mailpit (alert emails) | http://localhost:8025 |

## Logs

Alloy reads the logs of the Docker containers, so here the API also runs in Docker.
Stop `npm run start:dev` first (both use port 3000).

```bash
docker compose --profile monitoring --profile logs up -d --build
```

In Grafana: Explore > Loki > `{container="furniro-api"}`.

## Production (Grafana Cloud)

`/metrics` is hidden (404) in production unless `METRICS_TOKEN` is set.
With it, it asks for `Authorization: Bearer <METRICS_TOKEN>`.
Grafana Cloud can read it with the "Metrics Endpoint" integration (Bearer auth),
and the dashboard can be imported from `grafana/dashboards/furniro-api.json`.
