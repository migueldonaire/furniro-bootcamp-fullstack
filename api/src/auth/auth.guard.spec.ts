import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthGuard } from "./auth.guard";

// Un "context" falso: imita context.switchToHttp().getRequest()
function fakeContext(authorization?: string) {
  const request = { headers: { authorization } };
  const context = { switchToHttp: () => ({ getRequest: () => request }) };
  return context as unknown as ExecutionContext;
}

describe("Iniciar sesión en la tienda: rutas protegidas", () => {
  const fakeJwtService = { verifyAsync: jest.fn() }; // no comprueba tokens de verdad
  const fakeUsersService = { getUserById: jest.fn() }; // no habla con la base de datos
  const guard = new AuthGuard(
    fakeJwtService as unknown as JwtService,
    fakeUsersService as unknown as UsersService,
  );

  beforeEach(() => jest.clearAllMocks()); // cada test empieza de cero

  it("Escenario: La sesión caduca", async () => {
    // Dado: Ana inició sesión hace 16 minutos (el token dura 15 y ya ha caducado)
    fakeJwtService.verifyAsync.mockRejectedValue(new Error("jwt expired"));

    // Cuando: intenta ver sus pedidos con ese token
    const result = guard.canActivate(fakeContext("Bearer token-caducado"));

    // Entonces: 401, y la web le pide que inicie sesión de nuevo
    await expect(result).rejects.toThrow(UnauthorizedException);
  });

  // Relleno para Sonar: el resto de caminos del guard
  it("sin token → 401", async () => {
    await expect(guard.canActivate(fakeContext())).rejects.toThrow(UnauthorizedException);
  });

  it("el usuario del token ya no existe → 401", async () => {
    fakeJwtService.verifyAsync.mockResolvedValue({ sub: "u1" });
    fakeUsersService.getUserById.mockResolvedValue(undefined);

    await expect(guard.canActivate(fakeContext("Bearer ok"))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("cuenta que no está ACTIVA → 403", async () => {
    fakeJwtService.verifyAsync.mockResolvedValue({ sub: "u1" });
    fakeUsersService.getUserById.mockResolvedValue({ id: "u1", status: "INACTIVE" });

    await expect(guard.canActivate(fakeContext("Bearer ok"))).rejects.toThrow(ForbiddenException);
  });

  it("token válido y cuenta ACTIVA → deja pasar", async () => {
    fakeJwtService.verifyAsync.mockResolvedValue({ sub: "u1" });
    fakeUsersService.getUserById.mockResolvedValue({ id: "u1", status: "ACTIVE" });

    await expect(guard.canActivate(fakeContext("Bearer ok"))).resolves.toBe(true);
  });
});
