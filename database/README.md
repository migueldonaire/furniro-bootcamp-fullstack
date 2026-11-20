# database/

| Fichero | Qué es |
|---|---|
| `schema.sql` | Las tablas (sale del diagrama de clases, `docs/class-diagram.md`) |
| `seed.sql` | Datos de prueba: 13 usuarios, 6 categorías, 32 productos, 41 imágenes y 12 pedidos |
| `images/` | Las fotos de los productos |

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

## En Supabase (staging y producción)

Cada entorno es un proyecto de Supabase con dos cosas:

- **Base de datos:** `schema.sql` y `seed.sql` cargados en el SQL Editor.
- **Storage:** un bucket público `products` con las fotos de `images/`.

Al subir las fotos, las URLs de la base de datos se cambian para que apunten al bucket:

```sql
UPDATE product_images SET url = replace(url,
  'https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/',
  'https://<ref-del-proyecto>.supabase.co/storage/v1/object/public/products/');
```

| Entorno | Proyecto de Supabase | Fotos |
|---|---|---|
| Staging | `furniro-staging` | `https://zkcsxazavcsgsxejipfw.supabase.co/storage/v1/object/public/products/` |
| Producción | `furniro-prod` | Pendiente |
