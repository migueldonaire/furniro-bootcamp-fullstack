import type { Request } from "express";
import type { User } from "../users/user";
import type { INestApplication } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("GET /api/v1/auth/me", () => {
  const profile = {
    id: "ana-id",
    name: "Ana",
    lastName: "López",
    email: "ana@mail.com",
    role: "CUSTOMER",
  };
  const getUserById = jest.fn();
  let app: INestApplication;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: "auth-me-test-secret" })],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: UsersService, useValue: { getUserById } },
      ],
    }).compile();

    jwt = moduleRef.get(JwtService);
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  beforeEach(() => {
    getUserById.mockReset();
    getUserById.mockResolvedValue({ ...profile, status: "ACTIVE" });
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns the authenticated user's profile without a password hash", async () => {
    const token = jwt.sign({ sub: profile.id });
    const server = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(server)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(getUserById).toHaveBeenCalledWith(profile.id);
  });

  it("returns 401 without a token", async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(getUserById).not.toHaveBeenCalled();
  });

  it("returns 401 with an invalid or expired token", async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const expiredToken = jwt.sign({ sub: profile.id }, { expiresIn: -1 });

    await request(server)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-test-token")
      .expect(401);

    await request(server)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    expect(getUserById).not.toHaveBeenCalled();
  });
});

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
