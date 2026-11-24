# Tests en Furniro

Cada tarjeta lleva **al menos un test**. Mejor: un test por cada escenario *Dado / Cuando / Entonces* de la tarjeta.

Todo está ya instalado. No hace falta instalar nada.

| Carpeta | Herramientas |
|---|---|
| `api/` | **Jest** (tests) y **Supertest** (peticiones HTTP a la API) |
| `shop/` y `backoffice/` | **Vitest** (tests), **Testing Library** (pinta componentes y los busca como lo haría una persona) y **jsdom** (un navegador de mentira) |

## Comandos

Los mismos en las tres carpetas:

```bash
npm test            # pasa todos los tests una vez
npm run test:watch  # se queda mirando: repite los tests cada vez que guardas
npm run test:cov    # tests + cobertura (qué líneas ha ejecutado algún test)
```

Solo en la API:

```bash
npm run test:e2e    # la API entera contra PostgreSQL (antes: docker compose up -d y un .env)
```

El CI ejecuta `test:cov` en cada carpeta que cambia, y en la API también `test:e2e` con su propia base de datos.

## Dónde va cada test

El test va **al lado** del fichero que prueba:

| Qué pruebas | Nombre del fichero | Ejemplo que ya existe |
|---|---|---|
| Un servicio de la API | `products.service.spec.ts` | `api/src/app.controller.spec.ts` |
| Un endpoint de punta a punta | `api/test/<algo>.e2e-spec.ts` | `api/test/app.e2e-spec.ts` |
| Una función o un reducer | `cartSlice.test.ts` | `shop/src/features/auth/authSlice.test.ts` |
| Un componente o una página | `ProductPage.test.tsx` | `shop/src/components/layout/Header.test.tsx` |
| Una página que pide datos a la API | `ProductPage.test.tsx` | `shop/src/features/auth/ProtectedRoute.test.tsx` |

Los ejemplos de abajo usan ficheros que haréis vosotros (`ProductsService`, `ProductPage`...): son ilustrativos. Los de la tabla de arriba sí existen.

## 1. Servicio de la API con un `Pool` falso

Un test unitario no usa la base de datos de verdad. Le damos al servicio un `Pool` falso que responde lo que queramos:

```ts
const pool = { query: jest.fn() };                         // un Pool falso
const service = new ProductsService(pool as unknown as Pool);

it("findOne lanza un 404 si no hay filas", async () => {
  pool.query.mockResolvedValue({ rows: [] });               // la "BD" no devuelve nada
  await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
});
```

## 2. Endpoint de la API con Supertest (e2e)

Arranca la API entera y le hace peticiones HTTP, con los datos de `database/seed.sql`:

```ts
it("GET /api/v1/products/999999 responde 404", async () => {
  const response = await request(server).get("/api/v1/products/999999");
  expect(response.status).toBe(404);
});
```

Copia el `beforeAll` y el `afterAll` de `api/test/app.e2e-spec.ts`. Los e2e **no** deben cambiar datos del seed que usen otros tests.

## 3. Componente de la web

`renderWithProviders` pinta el componente con el store de Redux y el router, como en la app de verdad:

```tsx
renderWithProviders(<Header />);                            // pinta el componente
expect(screen.getByRole("link", { name: "Catálogo" })).toBeInTheDocument();

await userEvent.setup().click(screen.getByRole("button", { name: "Añadir" }));
expect(store.getState().cart.items).toHaveLength(1);       // el store ha cambiado
```

Tiene dos parámetros más: la URL donde empieza el test y cómo empieza el store:

```tsx
renderWithProviders(<MyOrdersPage />, "/my-orders", { auth: { token: "fake-token" } });
```

## 4. Página que pide datos a la API

En los tests no hay API. `mockFetch` hace de API: cada petición recibe la respuesta que le digas.

```tsx
mockFetch({ id: 1, name: "Silla Nora", basePrice: 100 });  // la "API" responde esto
renderWithProviders(<ProductPage />, "/products/1");

// findBy... ESPERA a que llegue la respuesta (getBy... no espera)
expect(await screen.findByText("Silla Nora")).toBeInTheDocument();
```

Para probar un error: `mockFetch({ message: "Not found" }, 404)`.

## Consejos

- Busca como lo haría una persona: `getByRole`, `getByText`, `getByLabelText`. Evita buscar por clases CSS.
- Un test que nunca ha fallado no demuestra nada: rompe el código a propósito y mira que el test se pone en rojo.
- Si un test falla, lee el mensaje entero: dice qué esperaba y qué ha recibido.

## Documentación

- Jest: <https://jestjs.io/docs/getting-started>
- Testing en NestJS: <https://docs.nestjs.com/fundamentals/testing>
- Vitest: <https://vitest.dev/guide/>
- Testing Library (qué consulta usar): <https://testing-library.com/docs/queries/about#priority>
