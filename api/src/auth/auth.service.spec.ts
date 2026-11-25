import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  const usersService = {
    findByEmail: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn().mockReturnValue("fake-token"),
  };

  const service = new AuthService(usersService as any, jwtService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve accessToken si credenciales son correctas y cuenta ACTIVE", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "ana@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "ACTIVE",
    });

    const result = await service.login("ana@mail.com", "Secreta123");
    expect(result).toEqual({ accessToken: "fake-token" });
  });

  it("lanza mismo error si email no existe", async () => {
    usersService.findByEmail.mockResolvedValue(undefined);
    await expect(service.login("noexiste@mail.com", "Secreta123")).rejects.toThrow(
      "Credenciales no válidas",
    );
  });

  it("lanza mismo error si contraseña incorrecta", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "ana@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    await expect(service.login("ana@mail.com", "otra")).rejects.toThrow("Credenciales no válidas");
  });

  it("lanza error si cuenta está PENDING", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "diego@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "PENDING",
    });
    await expect(service.login("diego@mail.com", "clave")).rejects.toThrow(
      "Confirma tu email antes de entrar",
    );
  });

  it("lanza error si cuenta está INACTIVE", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "pablo@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "INACTIVE",
    });
    await expect(service.login("pablo@mail.com", "clave")).rejects.toThrow(
      "Tu cuenta está desactivada",
    );
  });
});