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

  it("devuelve los productos y la paginación con el total", async () => {
    // Dado: la 1.ª consulta devuelve los productos y la 2.ª el total (pg da COUNT como texto)
    query.mockResolvedValueOnce({ rows }).mockResolvedValueOnce({ rows: [{ total: "13" }] });

    // Cuando: pide la página 1, de 6 en 6
    const response = await service.findAll(1, 6);

    // Entonces: llegan los productos y el total ya convertido a número
    expect(response).toEqual({ data: rows, pagination: { page: 1, limit: 6, total: 13 } });
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
    expect(query).toHaveBeenNthCalledWith(1, expect.stringContaining("p.base_price ASC"), [
      undefined,
      undefined,
      undefined,
      0,
      6,
    ]);
  });
  it("without sort param it sorts by created_at DESC by default", async () => {
    await service.findAll(1, 6);
    expect(query).toHaveBeenNthCalledWith(1, expect.stringContaining("p.created_at DESC"), [
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
    expect(query).toHaveBeenNthCalledWith(1, expect.stringContaining("LIMIT $5"), [
      undefined,
      undefined,
      undefined,
      12,
      6,
    ]);
  });
});
