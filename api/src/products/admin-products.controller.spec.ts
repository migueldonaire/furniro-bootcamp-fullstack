import { BadRequestException } from "@nestjs/common";
import { AdminProductsController } from "./admin-products.controller";
import { AdminProductsService, type ProductStatus } from "./admin-products.service";

describe("AdminProductsController", () => {
  let controller: AdminProductsController;
  let service: AdminProductsService;
  let findAll: jest.Mock;

  beforeEach(() => {
    findAll = jest.fn().mockResolvedValue([]);
    service = { findAll } as unknown as AdminProductsService;
    controller = new AdminProductsController(service);
  });

  it("un estado válido llama al servicio", async () => {
    await controller.findAll("silla", "ACTIVE");
    expect(findAll).toHaveBeenCalledWith("silla", "ACTIVE");
  });
  it("estado no valido lanza 400", async () => {
    await expect(controller.findAll(undefined, "HOLA" as ProductStatus)).rejects.toThrow(
      BadRequestException,
    );
    expect(findAll).not.toHaveBeenCalled();
  });
});
