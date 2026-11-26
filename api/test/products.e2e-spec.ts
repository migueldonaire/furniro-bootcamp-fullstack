import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Pool } from "pg";
import request from "supertest";
import { configureApp } from "../src/app.config";
import { AppModule } from "../src/app.module";
import type { ProductRow } from "../src/products/product";

// Necesita la base de datos en marcha (docker compose up -d) y el .env de la API
describe("Catálogo (e2e)", () => {
  let app: INestApplication;

  // Antes de todos los tests: arranca la API de verdad, con su configuración
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  // Después de todos: cierra la conexión a la base de datos y la API
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it("Escenario: Los desactivados no salen", async () => {
    // Dado: en seed.sql la "Lámpara Syltherine" está INACTIVE
    const server = app.getHttpServer() as Parameters<typeof request>[0];

    // Cuando: un visitante (sin token) abre la tienda y pide los productos
    const response = await request(server).get("/api/v1/products");

    // Entonces: la respuesta es correcta y trae productos...
    expect(response.status).toBe(200);
    const names = (response.body as ProductRow[]).map((product) => product.name);
    expect(names.length).toBeGreaterThan(0);

    // ...pero la lámpara desactivada no está entre ellos
    expect(names).not.toContain("Lámpara Syltherine");
  });
});
