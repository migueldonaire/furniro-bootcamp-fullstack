import { AuthService } from "./auth.service";
import { verify } from "argon2";

jest.mock("argon2", () => ({
  verify: jest.fn(),
}));

type UsersServiceMock = {
  findByEmail: jest.Mock;
};

type JwtServiceMock = {
  sign: jest.Mock;
};

const usersService = {
  findByEmail: jest.fn(),
};


const jwtService = {
  sign: jest.fn().mockReturnValue("fake-token"),
};

const service = new AuthService(
  usersService as unknown as ConstructorParameters<typeof AuthService>[0],
  jwtService as unknown as ConstructorParameters<typeof AuthService>[1],
);

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve accessToken si credenciales correctas y cuenta ACTIVE", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "ana@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    (verify as jest.Mock).mockResolvedValue(true);

    const result = await service.login("ana@mail.com", "Secreta123");
    expect(result).toEqual({ accessToken: "fake-token" });
  });

  it("mismo error si email no existe", async () => {
    usersService.findByEmail.mockResolvedValue(undefined);
    await expect(service.login("noexiste@mail.com", "Secreta123")).rejects.toThrow(
      "Credenciales no válidas",
    );
  });

  it("mismo error si contraseña incorrecta", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "ana@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    (verify as jest.Mock).mockResolvedValue(false);
    await expect(service.login("ana@mail.com", "otra")).rejects.toThrow("Credenciales no válidas");
  });

  it("error si cuenta PENDING", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "diego@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "PENDING",
    });
    (verify as jest.Mock).mockResolvedValue(true);
    await expect(service.login("diego@mail.com", "clave")).rejects.toThrow(
      "Confirma tu email antes de entrar",
    );
  });

  it("error si cuenta INACTIVE", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "u1",
      email: "pablo@mail.com",
      password_hash: "$argon2id$hash",
      role: "CUSTOMER",
      status: "INACTIVE",
    });
    (verify as jest.Mock).mockResolvedValue(true);
    await expect(service.login("pablo@mail.com", "clave")).rejects.toThrow(
      "Tu cuenta está desactivada",
    );
  });
});
