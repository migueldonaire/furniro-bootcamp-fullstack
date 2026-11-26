/// <reference types="jest" />

import { Pool } from "pg";
import { OrdersService } from "./orders.service";

function fakePool(rows: unknown[]) {
  const query = jest.fn().mockResolvedValue({ rows });
  const pool = { query } as unknown as Pool;
  return { pool, query };
}

describe("OrdersService.findUsualAddress", () => {
  it("returns the usual address of the user", async () => {
    const address = {
      fullName: "Ana López",
      phone: "611223344",
      street: "Calle Colón 12, 3º",
      city: "Valencia",
      province: "Valencia",
      postalCode: "46001",
      country: "ES",
    };
    const { pool, query } = fakePool([address]);
    const service = new OrdersService(pool);

    await expect(service.findUsualAddress("user-1")).resolves.toEqual(address);
    expect(query).toHaveBeenCalledWith(expect.any(String), ["user-1"]);
  });

  it("returns null if the user has no usual address", async () => {
    const { pool } = fakePool([]);
    const service = new OrdersService(pool);

    await expect(service.findUsualAddress("user-2")).resolves.toBeNull();
  });
});

describe("OrdersService.createOrder", () => {
  const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const productId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const orderId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

  function makeProduct() {
    return {
      id: productId,
      name: "Silla Nora",
      sku: "FUR-SIL-001",
      base_price: "100.00",
      tax_rate: "21.00",
      currency: "EUR",
      stock: 5,
      status: "ACTIVE" as const,
    };
  }

  function makeOrder(quantity = 2) {
    return {
      items: [{ productId, quantity }],
      address: {
        firstName: "Ana",
        lastName: "López",
        phone: "611223344",
        street: "Calle Colón 12",
        city: "Valencia",
        province: "Valencia",
        postalCode: "46001",
        country: "ES",
      },
    };
  }

  function fakeTransactionPool(
    product: Omit<ReturnType<typeof makeProduct>, "status"> & {
      status: "ACTIVE" | "INACTIVE";
    },
    updatedRows = 1,
  ) {
    const release = jest.fn();

    const query = jest.fn(async (sql: string) => {
      if (sql.includes("FROM products")) {
        return { rows: [product], rowCount: 1 };
      }

      if (sql.includes("INSERT INTO orders")) {
        return { rows: [{ id: orderId }], rowCount: 1 };
      }

      if (sql.includes("UPDATE products")) {
        return { rows: [], rowCount: updatedRows };
      }

      if (sql.includes("AS total")) {
        return { rows: [{ total: "250.00" }], rowCount: 1 };
      }

      return { rows: [], rowCount: 1 };
    });

    const pool = {
      connect: jest.fn().mockResolvedValue({ query, release }),
    } as unknown as Pool;

    return { pool, query, release };
  }

  it("creates a pending order, copies the current price and discounts stock", async () => {
    // Given
    const { pool, query, release } = fakeTransactionPool(makeProduct());
    const service = new OrdersService(pool);

    // When
    const result = await service.createOrder(userId, makeOrder());

    // Then
    expect(result).toEqual({ id: orderId, status: "PENDING", total: "250.00" });
    expect(query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO order_lines"), [
      orderId,
      productId,
      "Silla Nora",
      "FUR-SIL-001",
      2,
      "100.00",
      "21.00",
      "EUR",
    ]);
    expect(query).toHaveBeenCalledWith(expect.stringContaining("UPDATE products"), [2, productId]);
    expect(query).toHaveBeenCalledWith("COMMIT");
    expect(query).not.toHaveBeenCalledWith("ROLLBACK");
    expect(release).toHaveBeenCalled();
  });

  it("rolls back when there is not enough stock", async () => {
    // Given
    const { pool, query, release } = fakeTransactionPool(makeProduct());
    const service = new OrdersService(pool);

    // When and then
    await expect(service.createOrder(userId, makeOrder(6))).rejects.toThrow(
      "Solo quedan 5 unidades de Silla Nora",
    );
    expect(query).toHaveBeenCalledWith("ROLLBACK");
    expect(query).not.toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO orders"),
      expect.anything(),
    );
    expect(query).not.toHaveBeenCalledWith("COMMIT");
    expect(release).toHaveBeenCalled();
  });

  it("rolls back when the product is inactive", async () => {
    // Given
    const product = { ...makeProduct(), status: "INACTIVE" as const };
    const { pool, query } = fakeTransactionPool(product);
    const service = new OrdersService(pool);

    // When and then
    await expect(service.createOrder(userId, makeOrder(1))).rejects.toThrow(
      "Silla Nora ya no está disponible",
    );
    expect(query).toHaveBeenCalledWith("ROLLBACK");
    expect(query).not.toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO orders"),
      expect.anything(),
    );
  });

  it("ignores a price sent by the browser", async () => {
    // Given
    const { pool, query } = fakeTransactionPool(makeProduct());
    const service = new OrdersService(pool);
    const request = {
      ...makeOrder(1),
      items: [{ productId, quantity: 1, price: 1 }],
    };

    // When
    await service.createOrder(userId, request);

    // Then
    expect(query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO order_lines"), [
      orderId,
      productId,
      "Silla Nora",
      "FUR-SIL-001",
      1,
      "100.00",
      "21.00",
      "EUR",
    ]);
  });

  it("rolls back if the guarded stock update changes no row", async () => {
    // Given
    const { pool, query, release } = fakeTransactionPool(makeProduct(), 0);
    const service = new OrdersService(pool);

    // When and then
    await expect(service.createOrder(userId, makeOrder())).rejects.toThrow(
      "No se pudo reservar el stock de Silla Nora",
    );
    expect(query).toHaveBeenCalledWith("ROLLBACK");
    expect(query).not.toHaveBeenCalledWith("COMMIT");
    expect(release).toHaveBeenCalled();
  });
});
