# assets/

Imágenes fijas del panel: las que no cambian (logo, iconos).

**Las fotos de los productos NO van aquí.** Llegan de la API (`product_images`) como una URL y se pintan con `<img src={image.url} />`.

## Qué hay

| Fichero | Para qué |
|---|---|
| `images/logo.png` | Logo de la cabecera y de la pantalla de login |

El icono de la pestaña del navegador está en `public/favicon.png`.

## Cómo se usa una imagen

Se importa en el componente. Vite le pone la ruta buena al construir la web:

```tsx
import logo from "../../assets/images/logo.png";

<img src={logo} alt="Furniro" />
```

## Si añades una imagen

- Nombre en inglés, en minúsculas y con guiones: `empty-orders.svg`.
- JPG para fotos, PNG o SVG para logos e iconos.
- Que pese poco (menos de 200 KB).

## Fuentes (`fonts/`)

La tipografía del diseño es **Poppins**. Va en ficheros propios, sin Google Fonts:

- `fonts/poppins-400.woff2`, `500`, `600` y `700`: un fichero por grosor (normal, medio, seminegrita y negrita).
- `fonts/fonts.css`: declara cada fichero con `@font-face`. Lo importa `src/index.css` en la primera línea.
- `fonts/OFL.txt`: la licencia de la fuente (libre, se puede usar y distribuir).

En el CSS basta con `font-weight: 600` (o 400, 500, 700). Otros grosores no existen y el navegador se los inventa.
