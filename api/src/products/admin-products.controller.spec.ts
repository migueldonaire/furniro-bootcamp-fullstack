import { GUARDS_METADATA } from "@nestjs/common/constants";
import { AdminGuard } from "../auth/admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { AdminProductsController } from "./admin-products.controller";
import { AdminProductsService } from "./admin-products.service";

describe("AdminProductsController", () => {
  let controller: AdminProductsController;
  let findAll: jest.Mock;

  beforeEach(() => {
    // Un servicio falso: no toca la base de datos, solo recuerda con qué le llaman
    findAll = jest.fn().mockResolvedValue({ data: [] });
    controller = new AdminProductsController({ findAll } as unknown as AdminProductsService);
  });

  it("pasa los filtros de la query al servicio", async () => {
    // Dado: una query ya validada por el DTO (página 2, buscando "silla" entre los activos)
    const query = { page: 2, limit: 6, search: "silla", status: "ACTIVE" as const };

    // Cuando: el controlador recibe la petición
    await controller.findAll(query);

    // Entonces: el servicio recibe cada filtro en su sitio (category y sort no vienen)
    expect(findAll).toHaveBeenCalledWith(2, 6, "silla", "ACTIVE", undefined, undefined);
  });

  it("Escenario: Una clienta no puede", () => {
    // Dado: el método findAll del controlador (GET /admin/products)
    const findAllMethod = Object.getOwnPropertyDescriptor(
      AdminProductsController.prototype,
      "findAll",
    )?.value as object;

    // Cuando: leemos qué guards tiene puestos con @UseGuards
    const guards = Reflect.getMetadata(GUARDS_METADATA, findAllMethod) as unknown[];

    // Entonces: AuthGuard (sin token → 401) y AdminGuard (CUSTOMER → 403), en ese orden
    expect(guards).toEqual([AuthGuard, AdminGuard]);
  });
});
