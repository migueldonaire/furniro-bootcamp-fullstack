import type { Request } from "express";
import { OrdersController } from "./orders.controller";
import type { OrdersService, UsualAddress } from "./orders.service";

describe("OrdersController.getUsualAddress", () => {
  it("returns the usual address of the authenticated user", async () => {
    const address: UsualAddress = {
      fullName: "Ana López",
      phone: "611223344",
      street: "C/ Colón 10",
      city: "Valencia",
      province: "Valencia",
      postalCode: "46004",
      country: "ES",
    };
    const findUsualAddress = jest.fn().mockResolvedValue(address);
    const ordersService = { findUsualAddress } as unknown as OrdersService;
    const controller = new OrdersController(ordersService);
    const request = { user: { id: "user-1" } } as Request;

    const result = await controller.getUsualAddress(request);

    expect(findUsualAddress).toHaveBeenCalledWith("user-1");
    expect(result).toEqual(address);
  });
});
