# Furniro

Tienda online de muebles del bootcamp Full Stack. Monorepo con cuatro carpetas:

| Carpeta | Qué es | Comandos |
|---|---|---|
| `api/` | API NestJS 11 + PostgreSQL (`pg`, sin ORM) | `npm run start:dev`, `npm run lint`, `npm test` |
| `shop/` | Tienda en React + Vite + Redux Toolkit (RTK Query) | `npm run dev` (5173), `npm run lint`, `npm test` |
| `backoffice/` | Panel de administración, mismo stack | `npm run dev` (5174), `npm run lint`, `npm test` |
| `database/` | `schema.sql` y `seed.sql` (datos de prueba) | `docker compose up -d` en la raíz |

Documentación: `docs/how-we-work.md` (cómo trabajamos), `docs/class-diagram.md` (modelo), `docs/backlog.md` (tarjetas y dependencias), `docs/setup-guide.md` (CI/CD).

## Normas

- Todo el código en inglés: variables, funciones, tipos, rutas URL, campos, tablas y nombres de fichero. En español solo los textos que ve el usuario y los datos.
- API: controlador + servicio que va directo contra la base de datos con el `Pool` de `pg`. Nada de repositorios, adaptadores ni Clean Architecture.
- Cada tarjeta trabaja dentro de su módulo (`api/src/<module>/`) o de su carpeta (`shop/src/features/<feature>/`). No se tocan `app.module.ts`, `app/api.ts`, `app/router.tsx` ni `app/rootReducer.ts` salvo que la tarjeta lo pida.
- Endpoints de la web: `api.injectEndpoints` en un fichero de la feature.
- Las rutas de administración exigen rol `ADMIN` en la API, no solo en el frontend.
- Precios: `basePrice` sin IVA. El IVA y los totales se calculan, no se guardan.
- Ramas `feature/<funcionalidad>`. PRs pequeñas (máximo 400 líneas sin contar `package-lock.json`), una tarjeta por PR.
- Cada tarjeta lleva al menos un test.
- No se instalan librerías nuevas sin preguntar al profesor (evita conflictos en `package-lock.json`).
- Nunca se suben secretos: `.env` está en `.gitignore`; se sube `.env.example`.

## Revisión de PRs (para Claude)

- Escribe los comentarios en español, cortos y amables. Los alumnos son principiantes.
- Señala solo problemas reales: fallos, seguridad (endpoint sin guard, contraseña en la respuesta, precio que llega del cliente), normas de arriba que no se cumplen y tests que faltan.
- Para cada problema, da una pista de cómo arreglarlo en vez de escribir la solución entera.
