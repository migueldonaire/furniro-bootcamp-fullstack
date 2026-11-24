# assets/

Imágenes fijas de la web: las que salen del diseño y no cambian (logo, portada, iconos).

**Las fotos de los productos NO van aquí.** Llegan de la API (`product_images`) como una URL y se pintan con `<img src={image.url} />`.

## Qué hay

| Fichero | Dónde se usa en el diseño (`docs/screens`) |
|---|---|
| `images/logo.png` | Logo de la cabecera (`Header`) |
| `images/hero.jpg` | Foto de la portada (`Home.png`, "Discover Our New Collection"). La caja de texto va encima con CSS |
| `images/range-dining.jpg`, `range-living.jpg`, `range-bedroom.jpg` | "Browse The Range" de la portada |
| `images/page-banner.jpg` | Banda de arriba de Shop, Cart, Checkout... (el título "Shop" se escribe encima con CSS) |
| `icons/user.svg`, `search.svg`, `heart.svg`, `cart.svg` | Iconos de la cabecera |
| `icons/chevron-right.svg` | Flecha de la miga de pan (Home > Shop) |

El icono de la pestaña del navegador está en `public/favicon.png`.

## Cómo se usa una imagen

Se importa en el componente. Vite le pone la ruta buena al construir la web:

```tsx
import logo from "../../assets/images/logo.png";

<img src={logo} alt="Furniro" />
```

Para usarla de fondo desde un `.module.css`, la ruta es relativa al fichero CSS:

```css
.banner {
  background: url("../../assets/images/page-banner.jpg") center / cover;
}
```

## Si añades una imagen

- Nombre en inglés, en minúsculas y con guiones: `about-banner.jpg`.
- JPG para fotos, PNG o SVG para logos e iconos.
- Que pese poco (menos de 200 KB): reduce la foto antes de subirla.
- Si es una imagen que solo usa tu pantalla, déjala aquí igualmente para no duplicarla.

## Fuentes (`fonts/`)

La tipografía del diseño es **Poppins**. Va en ficheros propios, sin Google Fonts:

- `fonts/poppins-400.woff2`, `500`, `600` y `700`: un fichero por grosor (normal, medio, seminegrita y negrita).
- `fonts/fonts.css`: declara cada fichero con `@font-face`. Lo importa `src/index.css` en la primera línea.
- `fonts/OFL.txt`: la licencia de la fuente (libre, se puede usar y distribuir).

En el CSS basta con `font-weight: 600` (o 400, 500, 700). Otros grosores no existen y el navegador se los inventa.
