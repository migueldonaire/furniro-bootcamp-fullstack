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
      limit: 10,
      totalPages: 1,
    });
    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.not.stringContaining("WHERE"),
      [10, 0],
    );
  });

  it("with status it filters by that status", async () => {
    mockPaginatedQuery([]);

    await service.findAll("PENDING");

    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("WHERE o.status = $1"),
      ["PENDING", 10, 0],
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
      10,
      0,
    ]);
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
      limit: 10,
      totalPages: 0,
    });
  });

  it("orders the list from newest to oldest", async () => {
    mockPaginatedQuery([]);

    await service.findAll();

    expect(fakePool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("ORDER BY o.order_date DESC"),
      [10, 0],
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
});
