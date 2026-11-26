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
    expect(await service.findAll()).toEqual(rows);
  });
  it("sin filtro pasa los parametros vacios", async () => {
    await service.findAll();
    expect(query).toHaveBeenCalledWith(expect.any(String), [undefined, undefined, undefined]);
  });
  it("con filtro pasa los parametros correctamente", async () => {
    await service.findAll("FUR-SIL-001", "ACTIVE");
    expect(query).toHaveBeenCalledWith(expect.any(String), ["FUR-SIL-001", "ACTIVE", undefined]);
  });
});
