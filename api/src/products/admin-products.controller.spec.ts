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
    // Cuando: pide la página 1, de 24 en 24, buscando "silla" entre los activos
    await controller.findAll(1, 6, "silla", "ACTIVE");
    // Entonces: el servicio recibe los filtros y, al final, la página y el límite
    expect(findAll).toHaveBeenCalledWith(1, 6, "silla", "ACTIVE", undefined, undefined);
  });
  it("estado no valido lanza 400", async () => {
    // Cuando: pide un estado que no existe / Entonces: 400 y no se llama al servicio
    await expect(controller.findAll(1, 6, undefined, "HOLA" as ProductStatus)).rejects.toThrow(
      BadRequestException,
    );
    expect(findAll).not.toHaveBeenCalled();
  });
  it("unvalid sort param throws 400", async () => {
    // Cuando: pide un orden que no existe (ahora sí llega a sort, en la 6.ª posición)
    await expect(controller.findAll(1, 6, undefined, undefined, undefined, "hola")).rejects.toThrow(
      BadRequestException,
    );
    expect(findAll).not.toHaveBeenCalled();
  });
});
