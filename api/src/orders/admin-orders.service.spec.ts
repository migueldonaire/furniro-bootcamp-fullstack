import { NotFoundException } from "@nestjs/common";
import { Pool } from "pg";
import { AdminOrdersService } from "./admin-orders.service";

const lauraRow = {
  id: "f0000000-0000-4000-8000-000000000012",
  order_date: new Date("2026-11-17T20:00:00Z"),
  status: "SHIPPED",
  customer_name: "Laura Romero",
  customer_email: "laura@mail.com",
  total: "425.45",
  products: [],
};

const orderWithProductsRow = {
  id: "f0000000-0000-4000-8000-000000000002",
  order_date: new Date("2026-11-15T10:05:00Z"),
  status: "PENDING",
  customer_name: "Ana López",
  customer_email: "ana@mail.com",
  total: "269.36",
  products: [
    {
      id: "f1000000-0000-4000-8000-000000000003",
      name: "Lámpara Luna",
      quantity: 1,
      imageUrl: "https://example.com/lampara-luna-1.jpg",
    },
  ],
};

describe("AdminOrdersService", () => {
  const fakePool = { query: jest.fn() };
  const service = new AdminOrdersService(fakePool as unknown as Pool);

  function mockPaginatedQuery(rows: unknown[], total = rows.length) {
    fakePool.query.mockResolvedValueOnce({ rows: [{ total }] }).mockResolvedValueOnce({ rows });
  }

  beforeEach(() => {
    fakePool.query.mockReset();
  });

  it("without status it lists every order, converted to camelCase", async () => {
    mockPaginatedQuery([lauraRow]);

    const result = await service.findAll();

    expect(result).toEqual({
      items: [
        {
          id: "f0000000-0000-4000-8000-000000000012",
          orderDate: new Date("2026-11-17T20:00:00Z"),
          status: "SHIPPED",
          customerName: "Laura Romero",
          customerEmail: "laura@mail.com",
          total: 425.45,
          products: [],
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.not.stringContaining("WHERE o."),
      [20, 0],
    );
  });

  it("with status it filters by that status", async () => {
    mockPaginatedQuery([]);

    await service.findAll("PENDING");

    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("WHERE o.status = $1"),
      ["PENDING", 20, 0],
    );
  });

  it("with search it filters by id, customer, email or product name", async () => {
    mockPaginatedQuery([]);

    await service.findAll(undefined, "ana");

    expect(fakePool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("ILIKE $1"), [
      "%ana%",
    ]);
    expect(fakePool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("EXISTS"), [
      "%ana%",
      20,
      0,
    ]);
  });

  it("with from and to it filters by date, including the whole last day", async () => {
    // Dado: la base de datos no devuelve pedidos (solo nos interesa la consulta)
    mockPaginatedQuery([]);

    // Cuando: se piden los pedidos entre el 1 y el 15 de noviembre
    await service.findAll(undefined, undefined, 1, 10, "2026-11-01", "2026-11-15");

    // Entonces: la consulta filtra por fecha con las dos fechas como parámetros
    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("o.order_date >= $1 AND o.order_date < $2::date + 1"),
      ["2026-11-01", "2026-11-15", 10, 0],
    );
  });

  it("also lists orders without lines, so the list matches the total", async () => {
    // Dado: la base de datos no devuelve pedidos (solo nos interesa la consulta)
    mockPaginatedQuery([]);

    // Cuando: se pide la lista
    await service.findAll();

    // Entonces: usa LEFT JOIN, total 0 si no hay líneas y sin productos vacíos
    const sql = (fakePool.query.mock.calls as string[][])[1][0];
    expect(sql).toContain("LEFT JOIN order_lines");
    expect(sql).toContain("COALESCE(SUM(");
    expect(sql).toContain("FILTER (WHERE ol.id IS NOT NULL)");
  });

  it("applies page and limit and calculates totalPages", async () => {
    mockPaginatedQuery([], 12);

    const result = await service.findAll(undefined, undefined, 2, 5);

    expect(result).toEqual({
      items: [],
      total: 12,
      page: 2,
      limit: 5,
      totalPages: 3,
    });
    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("LIMIT $1 OFFSET $2"),
      [5, 5],
    );
  });

  it("returns an empty list when there are no orders", async () => {
    mockPaginatedQuery([]);

    const result = await service.findAll();

    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
  });

  it("orders the list from newest to oldest", async () => {
    mockPaginatedQuery([]);

    await service.findAll();

    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("ORDER BY o.order_date DESC"),
      [20, 0],
    );
  });

  it("includes customerEmail and products when they come from the database", async () => {
    mockPaginatedQuery([orderWithProductsRow]);

    const result = await service.findAll();

    expect(result.items[0]).toMatchObject({
      id: "f0000000-0000-4000-8000-000000000002",
      customerName: "Ana López",
      customerEmail: "ana@mail.com",
      total: 269.36,
      products: [
        {
          id: "f1000000-0000-4000-8000-000000000003",
          name: "Lámpara Luna",
          quantity: 1,
          imageUrl: "https://example.com/lampara-luna-1.jpg",
        },
      ],
    });
  });

  it("returns an empty products array if products is null", async () => {
    mockPaginatedQuery([{ ...orderWithProductsRow, products: null }]);

    const result = await service.findAll();

    expect(result.items[0].products).toEqual([]);
  });
  describe("findOne", () => {
    const id = "f0000000-0000-4000-8000-000000000001";

    const anaDetailRow = {
      id,
      order_date: new Date("2026-11-10T10:00:00Z"),
      status: "PENDING",
      shipping_cost: "8.00",
      currency: "EUR",
      customer_name: "Ana López",
      customer_email: "ana@mail.com",
      customer_phone: "611223344",
      full_name: "Ana López",
      address_phone: "611223344",
      street: "Calle Mayor 1",
      city: "Madrid",
      province: "Madrid",
      postal_code: "28001",
      country: "ES",
    };

    const chairLineRow = {
      id: "f2000000-0000-4000-8000-000000000001",
      product_name: "Silla Nora",
      sku: "FUR-SIL-001",
      quantity: 2,
      unit_price: "100.00",
      tax_rate: "21.00",
      image_url: "https://example.com/silla-nora.jpg",
    };

    it("returns the order with customer, address and lines in camelCase", async () => {
      fakePool.query
        .mockResolvedValueOnce({ rows: [anaDetailRow] })
        .mockResolvedValueOnce({ rows: [chairLineRow] });

      const result = await service.findOne(id);

      expect(result).toEqual({
        id,
        orderDate: new Date("2026-11-10T10:00:00Z"),
        status: "PENDING",
        shippingCost: 8,
        currency: "EUR",
        customer: { name: "Ana López", email: "ana@mail.com", phone: "611223344" },
        address: {
          fullName: "Ana López",
          phone: "611223344",
          street: "Calle Mayor 1",
          city: "Madrid",
          province: "Madrid",
          postalCode: "28001",
          country: "ES",
        },
        lines: [
          {
            id: "f2000000-0000-4000-8000-000000000001",
            productName: "Silla Nora",
            sku: "FUR-SIL-001",
            quantity: 2,
            unitPrice: 100,
            taxRate: 21,
            imageUrl: "https://example.com/silla-nora.jpg",
          },
        ],
        total: 250,
      });
    });

    it("uses the price saved in the line, not the current product price", async () => {
      // Dado: las mismas filas
      fakePool.query
        .mockResolvedValueOnce({ rows: [anaDetailRow] })
        .mockResolvedValueOnce({ rows: [chairLineRow] });

      const result = await service.findOne(id);

      expect(result.lines[0].unitPrice).toBe(100);
      expect(fakePool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("FROM order_lines"),
        [id],
      );
      expect(fakePool.query).toHaveBeenNthCalledWith(2, expect.not.stringContaining("base_price"), [
        id,
      ]);
    });

    it("throws NotFoundException when the order does not exist", async () => {
      fakePool.query.mockResolvedValueOnce({ rows: [] });
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(fakePool.query).toHaveBeenCalledTimes(1);
    });
  });
});
