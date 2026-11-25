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

  beforeEach(() => {
    fakePool.query.mockReset();
  });

  it("without status it lists every order, converted to camelCase", async () => {
    fakePool.query.mockResolvedValue({ rows: [lauraRow] });

    const orders = await service.findAll();

    expect(orders).toEqual([
      {
        id: "f0000000-0000-4000-8000-000000000012",
        orderDate: new Date("2026-11-17T20:00:00Z"),
        status: "SHIPPED",
        customerName: "Laura Romero",
        customerEmail: "laura@mail.com",
        total: 425.45,
        products: [],
      },
    ]);
    expect(fakePool.query).toHaveBeenCalledWith(expect.not.stringContaining("WHERE"), []);
  });

  it("with status it filters by that status", async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    await service.findAll("PENDING");

    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining("WHERE o.status = $1"), [
      "PENDING",
    ]);
  });

  it("returns an empty list when there are no orders", async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    const orders = await service.findAll();

    expect(orders).toEqual([]);
  });

  it("orders the list from newest to oldest", async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    await service.findAll();

    expect(fakePool.query).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY o.order_date DESC"),
      [],
    );
  });

  it("includes customerEmail and products when they come from the database", async () => {
    fakePool.query.mockResolvedValue({ rows: [orderWithProductsRow] });

    const orders = await service.findAll();

    expect(orders[0]).toMatchObject({
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
    fakePool.query.mockResolvedValue({
      rows: [{ ...orderWithProductsRow, products: null }],
    });

    const orders = await service.findAll();

    expect(orders[0].products).toEqual([]);
  });
});
