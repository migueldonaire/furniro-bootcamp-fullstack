import { Pool } from "pg";
import type { ProductRow } from "./product";
import { ProductsService } from "./products.service";

describe("Catálogo (API)", () => {
  const fakePool = { query: jest.fn<Promise<{ rows: ProductRow[] }>, [string]>() };
  const productsService = new ProductsService(fakePool as unknown as Pool);

  beforeEach(() => fakePool.query.mockReset()); // cada test empieza de cero

  it("Escenario: Ver productos sin iniciar sesión", async () => {
    // Dado: la base de datos devuelve 29 productos activos de 100 € sin IVA
    const rows: ProductRow[] = Array.from({ length: 29 }, (_, i) => ({
      id: `id-${i + 1}`,
      name: `Producto ${i + 1}`,
      description: "Descripción de prueba",
      base_price: "100.00", // pg manda los NUMERIC como texto
      tax_rate: "21.00",
      url: `https://example.com/producto-${i + 1}.jpg`,
    }));
    fakePool.query.mockResolvedValue({ rows });

    // Cuando: se piden los productos (sin token: el endpoint es público)
    const products = await productsService.findAll();

    // Entonces: llegan los 29, en camelCase y con los precios como números (sin IVA)
    expect(products).toHaveLength(29);
    expect(products[0]).toEqual({
      id: "id-1",
      imgURL: "https://example.com/producto-1.jpg",
      title: "Producto 1",
      description: "Descripción de prueba",
      basePrice: 100, // número, no "100.00": la web hace las cuentas con él
      taxRate: 21,
    });

    // Y la consulta pide solo los activos y solo la foto principal
    const sql = fakePool.query.mock.calls[0][0]; // el SQL que se envió
    expect(sql).toContain("status = 'ACTIVE'");
    expect(sql).toContain("is_primary");
  });

  it("Escenario: Producto sin foto", async () => {
    // Dado: un producto sin imágenes (el LEFT JOIN devuelve url: null)
    const row: ProductRow = {
      id: "producto-sin-foto",
      name: "Mesa Sin Foto",
      description: "Producto de prueba sin imágenes",
      base_price: "50.00",
      tax_rate: "21.00",
      url: null,
    };
    fakePool.query.mockResolvedValue({ rows: [row] });

    // Cuando: se piden los productos
    const products = await productsService.findAll();

    // Entonces: el producto sale igual, pero sin foto (imgURL es null)
    expect(products).toHaveLength(1);
    expect(products[0].title).toBe("Mesa Sin Foto");
    expect(products[0].imgURL).toBeNull();
  });
});
