# features/

Una carpeta por bloque del MVP. Cada tarjeta trabaja **dentro de su carpeta**.

## Reglas para no pisarse

- La página ya existe (con un texto "Pendiente"). Cámbiala, pero no la renombres: el router ya la usa.
- No toques `app/api.ts`. Añade tus endpoints en un fichero de tu carpeta:

```ts
// features/catalog/catalogApi.ts
import { api } from "../../app/api";

const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = catalogApi;
```

- Los slices ya están registrados en `app/rootReducer.ts` (auth y cart).
- Precios: usa `formatEuro` y `priceWithTax` de `lib/money.ts`.
- Cada tarjeta lleva al menos un test (`*.test.tsx` al lado del componente).
