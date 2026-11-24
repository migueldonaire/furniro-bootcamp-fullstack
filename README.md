# Furniro

Tienda online de muebles del bootcamp Full Stack de Valencia.

| Carpeta | Qué es |
|---|---|
| [`api/`](api) | API en NestJS + PostgreSQL |
| [`shop/`](shop) | Tienda (React) |
| [`backoffice/`](backoffice) | Panel de administración (React) |
| [`database/`](database) | Tablas y datos de prueba (SQL) |
| [`docs/`](docs) | Cómo trabajamos, diagrama de clases y guía de CI/CD |

## Arrancar en local

Necesitas Node.js 24 y Docker Desktop.

```bash
docker compose up -d          # PostgreSQL con los datos de prueba

cd api
cp .env.example .env
npm install
npm run start:dev             # http://localhost:3000/docs

cd ../shop                    # en otra terminal
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173

cd ../backoffice              # en otra terminal
cp .env.example .env
npm install
npm run dev                   # http://localhost:5174
```

Los `.env.example` ya traen valores que funcionan en local: basta con copiarlos. Trabaja siempre contra tu base de datos de Docker, no contra staging: staging solo enseña lo que ya está fusionado en `main` y puede estar a medias. Para empezar de cero con los datos de prueba: `docker compose down -v && docker compose up -d`.

Usuarios de prueba (contraseña `Furniro123`): `luis@furniro.com` (administrador), `ana@mail.com` y `pedro@mail.com` (clientes).

## Cómo trabajamos

1. Coge tu tarjeta en Jira y muévela a "En curso".
2. Crea tu rama: `git switch -c feature/FUR-35` (el código de tu tarjeta de Jira).
3. Programa dentro de tu carpeta (mira tu carril en [Confluence](https://bootcamp-fullstack-valencia-2026.atlassian.net/wiki/spaces/DDS/pages/753665)).
4. Antes de subir: `npm run format`, `npm run lint` y `npm test` en la carpeta que hayas tocado.
5. Abre una PR pequeña (menos de 400 líneas). Rellena la plantilla.
6. Espera a que los checks salgan en verde y a la revisión. Corrige y vuelve a subir.
7. Cuando se fusione, tu cambio sale solo en staging.

Todas las normas, explicadas: [`docs/how-we-work.md`](docs/how-we-work.md). Cómo se escriben los tests: [`docs/testing.md`](docs/testing.md). Las normas para la IA están en [`CLAUDE.md`](CLAUDE.md).
