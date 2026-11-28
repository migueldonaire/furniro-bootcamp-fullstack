---
name: reset-environment
description: Vuelve a cargar la base de datos y las fotos de productos de un entorno de Furniro (local, staging o producción) a partir de database/. Solo para el profesor.
disable-model-invocation: true
---

# Resetear un entorno de Furniro

Uso: `/reset-environment <local|staging|production> [completo|solo-lo-nuevo]`

Todo sale de la carpeta `database/` de `main`:

- `schema.sql`: borra las tablas y las crea de cero.
- `seed.sql`: todos los datos de prueba. Los bloques del final que empiezan por `-- More test data` solo añaden filas, así que se pueden ejecutar solos sobre una base de datos que ya tenga lo anterior.
- `images/`: **todas** las fotos de productos (`<producto>-<n>.jpg`). Es la copia buena: el bucket de Supabase se rellena desde aquí.

| Entorno | Proyecto de Supabase | URL de las fotos |
|---|---|---|
| staging | `furniro-staging` (`zkcsxazavcsgsxejipfw`) | `https://zkcsxazavcsgsxejipfw.supabase.co/storage/v1/object/public/products/` |
| production | `furniro-prod` (`xfioympsjjfvlspeewbg`) | `https://xfioympsjjfvlspeewbg.supabase.co/storage/v1/object/public/products/` |

## Antes de empezar

1. Repite al profesor el entorno y el modo, y qué se va a borrar. **Producción y el modo completo borran datos: no sigas sin un "sí" explícito** que nombre el entorno.
2. Lee `database/README.md` por si algo ha cambiado.

## Local

`docker compose down -v && docker compose up -d` en la raíz. Docker carga `schema.sql` y `seed.sql` solo. No hay fotos que subir: en local las URLs apuntan a GitHub.

## Staging o producción (con Claude in Chrome)

Se hace desde el navegador del profesor, que ya tiene la sesión de Supabase abierta. No pidas contraseñas ni claves.

### 1. Fotos al Storage

1. Abre `https://supabase.com/dashboard/project/<ref>/storage/buckets/products`. Si el bucket no existe, créalo **público** y con el nombre `products`.
2. Con `javascript_tool`, en esa pestaña: lee los nombres de las fotos de las URLs de `seed.sql`, descárgalas de `https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/<fichero>`, crea un `File` por cada una y mételas en el `input[type=file]` de la página con un `DataTransfer` y un evento `change`. Supabase las sube como si las hubieras arrastrado.
3. Comprueba que cada URL pública responde con `image/jpeg`.

### 2. Datos

1. Abre `https://supabase.com/dashboard/project/<ref>/sql/new`.
2. Con `javascript_tool`, descarga `schema.sql` y `seed.sql` de `raw.githubusercontent.com/.../main/database/` y cambia en el texto `https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/` por la URL de las fotos del entorno.
   - **Completo:** `schema.sql` + `seed.sql`.
   - **Solo lo nuevo:** solo los bloques `-- More test data` que aún no estén (compruébalo antes con un `SELECT` por sus ids).
3. Envuélvelo en `BEGIN; ... COMMIT;`, ponlo en el editor con `monaco.editor.getModels()[0].setValue(sql)` y pulsa **Run**. Si falla, no se guarda nada: lee el error y arréglalo.
4. En modo completo, después de `schema.sql`, activa RLS en todas las tablas, igual que estaba (la API entra con el usuario de la base de datos y no le afecta).

### 3. Comprobar

- `SELECT count(*)` de `products`, `product_images`, `orders` y `order_lines`: tiene que dar lo mismo que en un Postgres local con el mismo `seed.sql`.
- Abre la tienda del entorno (Netlify) y mira que las fotos cargan. La API de Render puede tardar un minuto en despertar.
- Cierra las pestañas que hayas abierto y deja la consulta del SQL Editor sin guardar.

Cuenta al profesor qué has cargado, en qué entorno y con qué totales.
