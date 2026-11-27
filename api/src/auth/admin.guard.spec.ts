import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";

// Relleno para Sonar. Un "context" falso con el usuario que dejó AuthGuard en la petición
function fakeContext(user?: { role: string }) {
  const request = { user };
  const context = { switchToHttp: () => ({ getRequest: () => request }) };
  return context as unknown as ExecutionContext;
}

describe("AdminGuard", () => {
  const guard = new AdminGuard();

  it("sin usuario → 401", () => {
    expect(() => guard.canActivate(fakeContext())).toThrow(UnauthorizedException);
  });

  it("cliente que no es ADMIN → 403", () => {
    expect(() => guard.canActivate(fakeContext({ role: "CUSTOMER" }))).toThrow(ForbiddenException);
  });

  it("ADMIN → deja pasar", () => {
    expect(guard.canActivate(fakeContext({ role: "ADMIN" }))).toBe(true);
  });
});
