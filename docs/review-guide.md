# Guía de revisión de Furniro

Cómo tiene que quedar una tarjeta para darla por terminada. Sale de lo que hemos visto en los apuntes de backend (NestJS + PostgreSQL) y de frontend (React + Redux Toolkit).

La usan el revisor de Claude en las PRs y Claude en vuestro terminal. Os sirve a vosotros como lista antes de abrir la PR.

> **Esto es una guía, no la única forma de hacerlo.** Si tu código funciona, está bien hecho y se entiende, vale aunque no sea igual que en los apuntes. Lo que sí tiene que estar siempre: lo de la tarjeta, la validación, la seguridad y un test por escenario.

---

## 1. La tarjeta manda

- La tarjeta es la de la **rama**: `feature/FUR-30` (o `feature/FUR-30-api`) es la FUR-30.
- Si un commit nombra una subtarea (`FUR-41`), es parte de la misma tarjeta, no otra.
- Cada **escenario** de la tarjeta (*Dado / Cuando / Entonces*) tiene que estar hecho y tener **al menos un test**.
- Las **reglas** de la tarjeta (campos obligatorios, mensajes exactos, códigos HTTP) se cumplen tal cual: si la tarjeta dice «La ciudad es obligatoria», el mensaje es ese.

---

## 2. API (NestJS + PostgreSQL)

Ejemplos en los apuntes: `03b_nestjs_postgresql.md`, `04_nestjs_autenticacion.md`, `05_nestjs_testing_swagger.md` y `07_nestjs_api_mundo_real.md`. En el repo: `api/src/app.controller.ts`.

### Lo que tiene que haber

| Qué | Cómo | Dónde está en los apuntes |
|---|---|---|
| Controlador + servicio | El controlador recibe la petición y llama al servicio. El SQL va en el servicio, con el `Pool` de `pg`. Nada de repositorios. | 03b |
| Registrado en su módulo | `controllers: [...]` y `providers: [...]` en `api/src/<module>/<module>.module.ts` | 03b |
| DTO con `class-validator` | Todo lo que llega en `@Body()` o `@Query()` es una clase DTO con decoradores: `@IsString()`, `@IsEmail()`, `@IsInt()`, `@Min()`, `@Max()`, `@MaxLength()`, `@IsOptional()`, `@IsIn([...])`... En la query, `@Type(() => Number)` para los números. | 03b, 07 (`create-book.dto.ts`, `list-books-query.dto.ts`) |
| Ids con pipe | En Furniro los ids son UUID: `@Param("id", ParseUUIDPipe)` (en los apuntes, `ParseIntPipe` con ids numéricos) | 03b |
| Fila → modelo | La consulta devuelve una `ProductRow` (como la tabla, con `snake_case`) y una función `toProduct(row)` la convierte en `Product` (`camelCase`). **El guion bajo solo existe en el `Row`.** | 07 (`book.ts`) |
| SQL con parámetros | `WHERE id = $1` y `[id]`. Nunca el valor pegado en el texto del SQL. | 03b |
| Errores HTTP correctos | `NotFoundException` (404), `BadRequestException` (400), `ConflictException` (409), `UnauthorizedException` (401), `ForbiddenException` (403). Mensajes en español. | 03b, 04 |
| Seguridad | Rutas privadas con el guard de sesión. Rutas de administración con el guard de rol `ADMIN` **en la API**. | 04 |
| Datos sensibles | Nunca se devuelve `password_hash`. El precio se lee de la base de datos, nunca del cliente. | 04 |
| Transacción | Si se escriben varias tablas a la vez (pedido + líneas + stock): `BEGIN` / `COMMIT` / `ROLLBACK` con `pool.connect()` y `client.release()` en `finally`. | 07 (`orders.service.ts`) |
| Precios | `basePrice` sin IVA. El IVA y los totales se calculan, no se guardan. | CLAUDE.md |

### Ejemplo corto

```ts
// products/product.ts
export interface ProductRow {
  id: string;
  name: string;
  base_price: string; // NUMERIC llega como texto desde pg
  created_at: Date;
}
export interface Product {
  id: string;
  name: string;
  basePrice: number;
  createdAt: Date;
}
export function toProduct(productRow: ProductRow): Product {
  return {
    id: productRow.id,
    name: productRow.name,
    basePrice: Number(productRow.base_price),
    createdAt: productRow.created_at,
  };
}
```

---

## 3. Tienda y backoffice (React + Redux Toolkit)

Ejemplos en los apuntes: `02_react_formularios_comunicacion.md`, `04_react_redux_toolkit_login.md` y `05_react_proyecto_profesional.md`. En el repo: `shop/src/features/README.md` y `backoffice/src/features/README.md`.

### Lo que tiene que haber

| Qué | Cómo | Dónde está en los apuntes |
|---|---|---|
| Trabajo dentro de su carpeta | `src/features/<feature>/`. La página ya existe: se cambia, no se renombra. | 05 |
| Peticiones con RTK Query | `api.injectEndpoints` en un fichero de la feature (`catalogApi.ts`). `query` para leer, `mutation` para cambiar, con `providesTags` / `invalidatesTags`. Nada de `fetch` suelto en los componentes. | 04, `features/README.md` |
| Tipos | El tipo de lo que devuelve la API (`Product`), con los mismos campos que el contrato de Confluence. | 04 |
| Carga y error | Se usa `isLoading` y `isError` (o `error`): la pantalla dice "Cargando..." y muestra un mensaje si falla. También el caso de lista vacía. | 03, 04 |
| Formularios validados | React Hook Form + Zod (`zodResolver(schema)`), con los mensajes de la tarjeta. Sin validación no está terminado. | 02 (apartado 9) |
| Estilos con CSS Modules | `ProductCard.module.css` e `import styles from "./ProductCard.module.css"`. Nada de `.css` globales para un componente. | 05 |
| Reducers sin mutar | Devuelven un objeto nuevo con *spread*. Nada de `state.x = ...`, `push` ni `splice`. | 04 |
| Sesión | En `localStorage` solo el token. El usuario se pide con `useGetMeQuery()`. | 04 |
| Precios | `formatEuro` y `priceWithTax` de `lib/money.ts`. | `features/README.md` |
| Textos | Lo que ve el usuario, en español. El código, en inglés. | CLAUDE.md |

---

## 4. Tests: un test por escenario

Los tests que más valen son los de los **escenarios** de la tarjeta. Cada escenario, como mínimo, un test. El nombre del test es el del escenario.

### En la API (Jest, `*.spec.ts` al lado del servicio)

Se prueba el servicio con un `Pool` falso. Ejemplo en `05_nestjs_testing_swagger.md` y en `api/src/app.controller.spec.ts`.

```ts
// products/products.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import { Pool } from "pg";
import { ProductsService } from "./products.service";

describe("Ver la ficha de un producto", () => {
  const fakePool = { query: jest.fn() }; // un Pool falso: no habla con PostgreSQL
  const productsService = new ProductsService(fakePool as unknown as Pool);

  beforeEach(() => fakePool.query.mockReset()); // cada test empieza de cero

  it("Escenario: producto que no existe → 404", async () => {
    // Dado: la base de datos no devuelve ninguna fila
    fakePool.query.mockResolvedValue({ rows: [] });

    // Cuando pide el producto 999 / Entonces recibe un 404
    await expect(productsService.findActiveProductById("999")).rejects.toThrow(NotFoundException);
  });
});
```

### En la web (Vitest + Testing Library, `*.test.tsx` al lado del componente)

Se pinta el componente con `renderWithProviders` (`src/test/renderWithProviders.tsx`) y se actúa como el usuario. Ejemplo en `05_react_proyecto_profesional.md` (apartado 4).

```tsx
// checkout/AddressForm.test.tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { AddressForm } from "./AddressForm";

describe("Dirección de entrega", () => {
  it("Escenario: falta un campo obligatorio", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddressForm />); // Dado: el formulario vacío

    await user.click(screen.getByRole("button", { name: "Continuar" })); // Cuando: envía sin la ciudad

    expect(await screen.findByText("La ciudad es obligatoria")).toBeInTheDocument(); // Entonces: ve el mensaje
  });
});
```

Si el componente usa un hook de RTK Query, se puede simular con `vi.mock("./productsApi", ...)` y `vi.mocked(useGetProductsQuery).mockReturnValue({ data, isLoading: false, isError: false } as never)`.

### Los tests "de relleno" para Sonar

Sonar pide un **50 % de cobertura** en el código nuevo. A veces falla por ficheros sin lógica (un `*.module.ts`, un DTO, un guard sencillo). Esos tests valen poco: **no son lo que hay que aprender**. Pídeselos a Claude en tu terminal ("Sonar me pide cobertura en `auth.module.ts`, dame el test") y cópialos. Lo importante son los tests de los escenarios.

---

## 5. Nombres que se entienden

Un nombre tiene que decir **qué es** o **qué hace** sin tener que leer el código. Mejor largo y claro que corto y vago.

| Vago | Mejor |
|---|---|
| `data`, `res`, `item`, `x` | `activeProducts`, `createdOrder`, `cartLine` |
| `user` (si hay varios) | `loggedInCustomer`, `customerToActivate` |
| `get()`, `find()`, `handle()` | `findActiveProductById()`, `listOrdersOfCustomer()`, `handleAddressFormSubmit()` |
| `Props`, `Data`, `Info` | `ProductCardProps`, `DeliveryAddressFormValues`, `AdminOrderSummary` |
| `ProductsService.get` | `ProductsService.findPublishedProductsByCategory` |
| `flag`, `ok`, `check` | `isOutOfStock`, `hasDeliveryAddress`, `canConfirmOrder` |

- Funciones y métodos: verbo + qué (`calculateCartTotalWithTax`).
- Booleanos: `is`, `has`, `can`.
- Todo en inglés y en `camelCase`; `snake_case` solo en los campos de un `Row`.

---

## 6. Lo que bloquea una PR y lo que no

**Bloquea:**

- Un fallo: algo que no funciona o un escenario de la tarjeta que no está hecho.
- Seguridad: endpoint de administración sin guard de `ADMIN`, contraseña o `password_hash` en la respuesta, usuario en `localStorage`, precio que llega del cliente, SQL con el valor pegado en el texto.
- Datos de entrada sin validar: un `@Body()` sin DTO con `class-validator`, un formulario sin validación.
- Una norma de `CLAUDE.md` que no se cumple: reducer que muta, código en español, ficheros fuera de la tarjeta.
- Ningún test de escenario.

**No bloquea (se sugiere):**

- Hacerlo de otra forma que también funciona y está bien hecha.
- Nombres mejorables.
- Faltan tests de algún escenario, si al menos hay uno (se dice cuáles faltan).
- Pequeños detalles de estilo o de orden.
