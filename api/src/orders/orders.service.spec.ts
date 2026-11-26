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
