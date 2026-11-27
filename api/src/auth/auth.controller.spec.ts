import type { Request } from "express";
import type { User } from "../users/user";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("Saber quién ha iniciado sesión", () => {
  // /me no usa el AuthService, así que le pasamos uno vacío
  const controller = new AuthController({} as unknown as AuthService);

  it("Escenario: Pedir mis datos con un token válido", () => {
    // Dado: Ana ha iniciado sesión y el AuthGuard ya ha dejado su usuario en request.user
    const ana: User = {
      id: "u1",
      name: "Ana",
      lastName: "García",
      email: "ana@mail.com",
      role: "CUSTOMER",
      status: "ACTIVE",
    };
    const request = { user: ana } as unknown as Request;

    // Cuando: la web llama a GET /auth/me con su token
    const result = controller.me(request);

    // Entonces: la API responde con id, name, lastName, email y role de Ana...
    expect(result).toEqual(
      expect.objectContaining({
        id: "u1",
        name: "Ana",
        lastName: "García",
        email: "ana@mail.com",
      }),
    );
    // ...y la respuesta NO incluye la contraseña
    expect(result).not.toHaveProperty("passwordHash");
  });
});
