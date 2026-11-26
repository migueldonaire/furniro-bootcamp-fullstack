import { Pool } from "pg";
import { AdminProductsService } from "./admin-products.service";

let query: jest.Mock;

describe("AdminProductsService", () => {
  const rows = [
    {
      id: "1",
      name: "Producto 1",
      sku: "SKU1",
      basePrice: "100.00",
      stock: 10,
      status: "ACTIVE",
      categoryName: "Categoría 1",
      imageUrl: null,
    },
  ];
  let pool: Pool;
  let service: AdminProductsService;

  beforeEach(() => {
    query = jest.fn().mockResolvedValue({ rows });
    pool = { query } as unknown as Pool;
    service = new AdminProductsService(pool);
  });

  it("devuelve las filas ", async () => {
    expect(await service.findAll(1, 6)).toEqual(rows);
  });
  it("sin filtro pasa los parametros vacios", async () => {
    await service.findAll(1, 6);
    expect(query).toHaveBeenCalledWith(expect.any(String), [undefined, undefined, undefined, 0, 6]);
  });
  it("con filtro pasa los parametros correctamente", async () => {
    await service.findAll(1, 6, "FUR-SIL-001", "ACTIVE");
    expect(query).toHaveBeenCalledWith(expect.any(String), [
      "FUR-SIL-001",
      "ACTIVE",
      undefined,
      0,
      6,
    ]);
  });
  it("filters by category", async () => {
    await service.findAll(1, 6, undefined, undefined, "11111111-1111-1111-1111-111111111111");
    expect(query).toHaveBeenCalledWith(expect.any(String), [
      undefined,
      undefined,
      "11111111-1111-1111-1111-111111111111",
      0,
      6,
    ]);
  });
  it("sorts by priceAsc", async () => {
    await service.findAll(1, 6, undefined, undefined, undefined, "priceAsc");
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("p.base_price ASC"), [
      undefined,
      undefined,
      undefined,
      0,
      6,
    ]);
  });
  it("without sort param it sorts by created_at DESC by default", async () => {
    await service.findAll(1, 6);
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("p.created_at DESC"), [
      undefined,
      undefined,
      undefined,
      0,
      6,
    ]);
  });
  it("Escenario: ver la página 3 del listado", async () => {
    // Dado: el listado va de 6 en 6
    const page = 3;
    const limit = 6;

    // Cuando: Luis pide la página 3
    await service.findAll(page, limit);

    // Entonces: la consulta corta 6 productos y se salta los 12 de las páginas 1 y 2
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("LIMIT $5"), [
      undefined,
      undefined,
      undefined,
      12,
      6,
    ]);
  });
});
