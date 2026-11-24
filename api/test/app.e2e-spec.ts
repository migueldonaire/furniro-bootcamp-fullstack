import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Pool } from "pg";
import request from "supertest";
import { configureApp } from "../src/app.config";
import { AppModule } from "../src/app.module";

// Needs the database running (docker compose up -d) and a .env file
describe("Furniro API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it("GET /api/v1/health responds 200", async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", database: "furniro" });
  });
});
