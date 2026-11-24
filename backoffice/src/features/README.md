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

- Los slices ya están registrados en `app/rootReducer.ts` (auth).
- **Reducers sin mutar**: devuelven siempre un objeto nuevo con _spread_, nunca `state.x = ...` ni `push`:

```ts
// features/cart/cartSlice.ts (ejemplo de T5)
itemAdded: (state, action: PayloadAction<CartItem>) => ({
  ...state,
  items: [...state.items, action.payload],
}),
```

- **Nada confidencial en `localStorage`**: solo se guarda el token (`app/store.ts`). El usuario se pide a la API con `useGetMeQuery()` (`features/auth/authApi.ts`).
- Precios: usa `formatEuro` y `priceWithTax` de `lib/money.ts`.
- Cada tarjeta lleva al menos un test (`*.test.tsx` al lado del componente).
