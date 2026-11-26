import { Pool } from "pg";
import type { ProductRow } from "./product";
import { ProductsService } from "./products.service";

describe("Catálogo (API)", () => {
  const fakePool = { query: jest.fn<Promise<{ rows: ProductRow[] }>, [string]>() };
  const productsService = new ProductsService(fakePool as unknown as Pool);

  beforeEach(() => fakePool.query.mockReset()); // cada test empieza de cero

  it("Escenario: Ver productos sin iniciar sesión", async () => {
    // Dado: la base de datos devuelve 29 productos activos
    const rows: ProductRow[] = Array.from({ length: 29 }, (_, i) => ({
      id: `id-${i + 1}`,
      name: `Producto ${i + 1}`,
      description: "Descripción de prueba",
      base_price: "100.00",
      tax_rate: "21.00",
      url: `https://example.com/producto-${i + 1}.jpg`,
    }));
    fakePool.query.mockResolvedValue({ rows });

    // Cuando: se piden los productos (sin token: el endpoint es público)
    const products = await productsService.findAll();

    // Entonces: llegan los 29, con su nombre, su precio y su foto
    expect(products).toHaveLength(29);
    expect(products[0]).toEqual(rows[0]);

    // Y la consulta pide solo los activos y solo la foto principal
    const sql = fakePool.query.mock.calls[0][0]; // el SQL que se envió (ya es string)
    expect(sql).toContain("status = 'ACTIVE'");
    expect(sql).toContain("is_primary");
  });
});
