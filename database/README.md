# database/

| Fichero | Qué es |
|---|---|
| `schema.sql` | Las tablas (sale del diagrama de clases, `docs/class-diagram.md`) |
| `seed.sql` | Datos de prueba: 13 usuarios, 6 categorías, 32 productos, 41 imágenes y 12 pedidos |
| `images/` | Las fotos de los productos |
| `scripts/upload-images.mjs` | Sube las fotos a Supabase Storage |

En local no tienes que hacer nada: `docker compose up -d` (en la raíz) carga `schema.sql` y `seed.sql`.

## Las imágenes

- Salen del diseño de Furniro en Figma, reducidas a 1000 px y en JPG.
- Cada fichero se llama como el producto: `silla-nora-1.jpg` es la foto principal de la Silla Nora y `silla-nora-2.jpg`, la segunda.
- Todos los productos tienen al menos una foto. Algunas son recortes o volteos de fotos del diseño, porque el diseño no traía una foto propia para ese producto: `silla-nora-2`, `silla-leviosa-1`, `silla-respira-1`, `mesa-nube-1`, `mesa-pingky-1`, `lampara-syltherine-1`, `flexo-duna-1`, `banco-kioto-1` y `alfombra-sahara-1`.

En la base de datos solo se guarda la URL de cada imagen (tabla `product_images`). En `seed.sql` las URLs apuntan a este repositorio en GitHub:

```
https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-nora-1.jpg
```

Así funcionan desde el primer día, también en local. Solo hace falta que las imágenes estén en `main`.

## Subir las imágenes a Supabase Storage

En staging y producción las imágenes viven en Supabase Storage. Para cada proyecto de Supabase:

1. Carga `schema.sql` y `seed.sql` en el **SQL Editor**, como siempre.
2. Copia el fichero de variables y rellénalo:

```bash
cp database/.env.example database/.env
```

| Variable | Dónde está en Supabase |
|---|---|
| `SUPABASE_URL` | Project Settings → Data API → Project URL |
| `SUPABASE_SECRET_KEY` | Project Settings → API Keys → Secret key (o la antigua `service_role`) |
| `SUPABASE_BUCKET` | El nombre que quieras para el bucket. Por defecto, `products` |

3. Desde la raíz del repositorio:

```bash
node database/scripts/upload-images.mjs
```

El script crea el bucket (público) si no existe, sube las 41 fotos (si ya estaban, las reemplaza) y genera `database/update-image-urls.sql`.

4. Pega `database/update-image-urls.sql` en el **SQL Editor** de ese mismo proyecto. Cambia las URLs de GitHub por las de Supabase y te enseña cinco para comprobarlo.

La clave secreta da acceso total al proyecto: está en `database/.env`, que no se sube a GitHub. Nunca la pongas en el frontend.
