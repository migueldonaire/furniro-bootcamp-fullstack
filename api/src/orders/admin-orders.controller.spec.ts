import { GUARDS_METADATA } from "@nestjs/common/constants";
import { AdminGuard } from "../auth/admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { AdminOrdersController } from "./admin-orders.controller";

describe("AdminOrdersController", () => {
  it("only lets a logged-in ADMIN see the orders (401 without token, 403 if not ADMIN)", () => {
    // Dado: el controlador de pedidos de administración
    // Cuando: leemos qué guards tiene puestos con @UseGuards
    const guards = Reflect.getMetadata(GUARDS_METADATA, AdminOrdersController) as unknown[];

    // Entonces: tiene AuthGuard (token → 401) y AdminGuard (rol → 403), en ese orden
    expect(guards).toEqual([AuthGuard, AdminGuard]);
  });
});
