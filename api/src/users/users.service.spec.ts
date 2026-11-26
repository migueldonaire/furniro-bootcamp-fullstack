import { Pool } from "pg";
import { UsersService } from "./users.service";

describe("Iniciar sesión en la tienda: buscar al usuario", () => {
  const fakePool = { query: jest.fn() }; // un Pool falso: no habla con PostgreSQL
  const usersService = new UsersService(fakePool as unknown as Pool);

  // Una fila como la que devuelve PostgreSQL (columnas de schema.sql)
  const anaRow = {
    id: "u1",
    name: "Ana",
    last_name: "García",
    email: "ana@mail.com",
    password_hash: "$argon2id$hash",
    role: "CUSTOMER",
    status: "ACTIVE",
  };

  beforeEach(() => fakePool.query.mockReset()); // cada test empieza de cero

  it("Escenario: Email en mayúsculas", async () => {
    // Dado: en la base de datos Ana está guardada en minúsculas
    fakePool.query.mockResolvedValue({ rows: [anaRow] });

    // Cuando: se busca con el email en mayúsculas
    const user = await usersService.findByEmail("Ana@Mail.COM");

    // Entonces: la consulta ignora las mayúsculas y encuentra a Ana
    expect(fakePool.query).toHaveBeenCalledWith(
      expect.stringContaining("lower(email) = lower($1)"),
      ["Ana@Mail.COM"],
    );
    expect(user?.email).toBe("ana@mail.com");
  });

  // Relleno para Sonar: GET /auth/me usa getUserById
  it("getUserById devuelve el usuario sin la contraseña", async () => {
    fakePool.query.mockResolvedValue({ rows: [anaRow] });

    const user = await usersService.getUserById("u1");

    expect(user?.name).toBe("Ana");
    expect(user).not.toHaveProperty("passwordHash");
    expect(user).not.toHaveProperty("password_hash");
  });

  it("getUserById devuelve undefined si el usuario no existe", async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    expect(await usersService.getUserById("999")).toBeUndefined();
  });
});
