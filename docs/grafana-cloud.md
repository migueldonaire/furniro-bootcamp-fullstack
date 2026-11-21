# Monitorización de producción con Grafana Cloud

La API de **producción** expone sus métricas en `GET /metrics` (formato Prometheus, con `prom-client`). **Grafana Cloud** las lee cada minuto con su integración *Metrics Endpoint* y las enseña en el dashboard **Furniro API**. No hay que instalar nada: ni Prometheus ni Grafana.

Solo se monitoriza **producción**. Staging no lleva `METRICS_TOKEN`, así que allí `/metrics` responde 404.

```text
┌───────────────────────────┐   GET /metrics cada minuto   ┌───────────────┐
│ furniro-api-prod (Render) │ <─────────────────────────── │ Grafana Cloud │
│                           │   Authorization: Bearer …    │  (gratis)     │
└───────────────────────────┘                              └───────────────┘
```

## Cómo se comporta `/metrics`

| Dónde | `METRICS_TOKEN` | `GET /metrics` |
|---|---|---|
| Tu ordenador (`npm run start:dev`) | sin poner | abierto |
| Render staging | sin poner | 404 |
| Render producción | puesto | 401 sin token; métricas con `Authorization: Bearer <token>` |

Métricas principales (todas empiezan por `furniro_`):

- `furniro_http_request_duration_seconds` (histograma): duración de cada petición por `method`, `route` (el patrón, p. ej. `/api/v1/products/:id`) y `status_code`. Su `_count` cuenta las peticiones.
- `furniro_process_resident_memory_bytes`, `furniro_process_cpu_seconds_total`, `furniro_nodejs_eventloop_lag_p99_seconds`…: las métricas por defecto de Node.js.

---

## Pasos (una sola vez)

### 1. Desplegar la versión con `/metrics` en producción

1. Fusiona esta PR. Staging se despliega solo.
2. Lanza una release (**Actions → release → Run workflow**) con la versión nueva para que llegue a producción, y apruébala.

### 2. Crear el token

```bash
node -e "console.log(crypto.randomUUID())"
```

Guárdalo: lo usarás en Render y en Grafana Cloud. No lo subas al repositorio.

### 3. Poner el token en Render (solo producción)

1. Render → servicio **furniro-api-prod** → **Environment → Add Environment Variable**.
2. `METRICS_TOKEN` = el token. **Save, rebuild and deploy** (o *Save changes*: Render reinicia el servicio).
3. Comprueba (en Windows, `curl.exe`; cambia la URL por la de tu servicio):

   ```bash
   curl -i https://furniro-api-prod.onrender.com/metrics          # 401
   curl -H "Authorization: Bearer EL_TOKEN" https://furniro-api-prod.onrender.com/metrics | head
   ```

### 4. Crear la cuenta de Grafana Cloud

1. https://grafana.com → **Create free account** (vale con la cuenta de Google o GitHub).
2. Crea el *stack*: nombre `furniro` (quedará `https://furniro.grafana.net` o parecido) y región **Europe**.

### 5. Conectar la API (Metrics Endpoint)

1. En tu stack: menú **Connections → Add new connection** → busca **Metrics Endpoint**.
2. Crea un *scrape job*:
   - **Scrape job name**: `furniro-api-prod` (será la etiqueta `job`).
   - **Scrape job URL**: `https://furniro-api-prod.onrender.com/metrics`.
   - **Scrape interval**: `1m`.
   - **Type of authentication**: **Bearer**. Pega el token **sin** la palabra `Bearer`.
3. **Test connection**. Si da error, el servicio de Render estaba dormido: espera un minuto y repite.
4. **Save scrape job**.

### 6. Importar el dashboard

1. **Dashboards → New → Import**.
2. Sube [`monitoring/furniro-api-dashboard.json`](../monitoring/furniro-api-dashboard.json).
3. En **Data source** elige el Prometheus de tu stack (`grafanacloud-…-prom`) → **Import**.

Navega un poco por la tienda de producción y, en 2-3 minutos, verás datos.

### 7. (Opcional) Alerta "API caída" por correo

1. **Alerting → Contact points → + Create contact point**: nombre `Furniro team`, *Email*, tu correo. **Test**.
2. **Alerting → Alert rules → + New alert rule**:
   - Nombre `API down (prod)`.
   - Consulta (modo *Code*): `up{job="furniro-api-prod"}`. Condición **IS BELOW `1`**.
   - Carpeta `Furniro`, grupo nuevo `furniro` con intervalo `1m`, *pending period* `3m`.
   - **Configure no data and error handling → Alert state if no data: Alerting**.
   - Contact point `Furniro team`. **Save**.

Si `up{job="furniro-api-prod"}` no devuelve nada en tu stack, usa `furniro_process_start_time_seconds{job="furniro-api-prod"}` con la misma condición: sin datos también avisa.

---

## Ojo con Render Free

La API de Render Free se duerme tras 15 minutos sin visitas. Grafana Cloud la llama **cada minuto**, así que con el *scrape job* activo **no se duerme nunca** y gasta horas del plan (750 h al mes para todos los servicios gratis juntos; staging también las usa).

Por eso: **activa el *scrape job* cuando quieras mirar producción** (una clase, una demo) y **desactívalo** después (**Connections → Metrics Endpoint → Scrape jobs**, interruptor *Enabled*).

## Si algo falla

- **`/metrics` da 404 en producción**: falta `METRICS_TOKEN` en Render o la versión desplegada es anterior a esta PR (mira la versión en `/api/v1/health`).
- **401 con el token**: el token de Render y el de la cabecera no coinciden (espacios al copiar).
- **Test connection falla**: la URL tiene que ser `https://` y sin redirecciones. Prueba primero con `curl`.
- **El dashboard sale vacío**: elige bien el *Data source* al importar y pon el rango en *Last 30 minutes*. `rate(...[1m])` necesita al menos dos lecturas (2 minutos).
