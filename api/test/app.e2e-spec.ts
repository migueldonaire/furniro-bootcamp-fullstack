import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Pool } from "pg";
import request from "supertest";
import { configureApp } from "../src/app.config";
import { AppModule } from "../src/app.module";

// e2e = the whole API, with the real database (the seed of database/seed.sql).
// In local: docker compose up -d, a .env file and "npm run test:e2e".
// The CI starts its own PostgreSQL and runs these tests too.
describe("Furniro API (e2e)", () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app); // the same configuration as main.ts
    await app.init();
    server = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await app.get(Pool).end(); // close the connections to PostgreSQL
    await app.close();
  });

  it("GET /api/v1/health responds 200", async () => {
    const response = await request(server).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", database: "furniro" });
  });

  it("a route that does not exist responds 404", async () => {
    const response = await request(server).get("/api/v1/does-not-exist");
    expect(response.status).toBe(404);
  });
});
