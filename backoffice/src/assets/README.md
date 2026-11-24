# assets/

Imágenes fijas del panel: las que no cambian (logo, iconos).

**Las fotos de los productos NO van aquí.** Llegan de la API (`product_images`) como una URL y se pintan con `<img src={image.url} />`.

## Qué hay

| Fichero           | Para qué                                      |
| ----------------- | --------------------------------------------- |
| `images/logo.png` | Logo de la cabecera y de la pantalla de login |

El icono de la pestaña del navegador está en `public/favicon.png`.

## Cómo se usa una imagen

Se importa en el componente. Vite le pone la ruta buena al construir la web:

```tsx
import logo from "../../assets/images/logo.png";

<img src={logo} alt="Furniro" />;
```

## Si añades una imagen

- Nombre en inglés, en minúsculas y con guiones: `empty-orders.svg`.
- JPG para fotos, PNG o SVG para logos e iconos.
- Que pese poco (menos de 200 KB).
