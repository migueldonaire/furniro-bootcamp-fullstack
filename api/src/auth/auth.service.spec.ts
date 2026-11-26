/// <reference types="jest" />
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { UsersService, UserWithPassword } from "../users/users.service";
import { AuthService } from "./auth.service";

jest.mock("argon2", () => ({ verify: jest.fn() }));

describe("Iniciar sesión en la tienda", () => {
  const fakeUsersService = { findByEmail: jest.fn() };
  const fakeJwtService = { sign: jest.fn().mockReturnValue("fake-token") };
  const authService = new AuthService(
    fakeUsersService as unknown as UsersService,
    fakeJwtService as unknown as JwtService,
  );

  function fakeUser(overrides: Partial<UserWithPassword> = {}): UserWithPassword {
    return {
      id: "u1",
      name: "Ana",
      lastName: "García",
      email: "ana@mail.com",
      passwordHash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "ACTIVE",
      ...overrides,
    };
  }

  beforeEach(() => jest.clearAllMocks());

  it("Escenario: Login correcto", async () => {
    fakeUsersService.findByEmail.mockResolvedValue(fakeUser());
    jest.mocked(verify).mockResolvedValue(true);

    const result = await authService.login("ana@mail.com", "Secreta123");

    expect(result).toEqual({ accessToken: "fake-token" });
    expect(fakeJwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ sub: "u1" }),
    );
  });

  it("Escenario: Contraseña incorrecta o email que no existe", async () => {
    // Dado: Ana existe, pero la contraseña "otra" no coincide
    fakeUsersService.findByEmail.mockResolvedValue(fakeUser());
    jest.mocked(verify).mockResolvedValue(false);

    await expect(authService.login("ana@mail.com", "otra")).rejects.toThrow(
      "Credenciales no válidas",
    );

    fakeUsersService.findByEmail.mockResolvedValue(undefined);
    await expect(authService.login("nadie@mail.com", "Secreta123")).rejects.toThrow(
      "Credenciales no válidas",
    );
  });

  it("Escenario: Cuenta sin activar", async () => {
    fakeUsersService.findByEmail.mockResolvedValue(
      fakeUser({ name: "Diego", email: "diego@mail.com", status: "PENDING" }),
    );
    jest.mocked(verify).mockResolvedValue(true);

    await expect(authService.login("diego@mail.com", "Secreta123")).rejects.toThrow(
      "Confirma tu email antes de entrar",
    );
  });

  it("Escenario: Cuenta desactivada", async () => {
    fakeUsersService.findByEmail.mockResolvedValue(
      fakeUser({ name: "Pablo", email: "pablo@mail.com", status: "INACTIVE" }),
    );
    jest.mocked(verify).mockResolvedValue(true);

    await expect(authService.login("pablo@mail.com", "Secreta123")).rejects.toThrow(
      "Tu cuenta está desactivada. Escríbenos a furnirobootcampfullstack@gmail.com",
    );
  });
});
