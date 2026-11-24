import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { existsSync } from "node:fs";
import { configureApp } from "./app.config";
import { AppModule } from "./app.module";

// On your computer there is a .env file; on Render there is not
// (the variables are set in the Environment tab)
if (existsSync(".env")) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // On Render, requests arrive through a proxy: this lets Express see the real IP
  app.set("trust proxy", 1);

  configureApp(app); // helmet, CORS, /api prefix, versions, validation, errors

  // API docs at http://localhost:3000/docs
  const config = new DocumentBuilder()
    .setTitle("Furniro API")
    .setDescription("Catalog, cart checkout, orders and backoffice")
    .setVersion(process.env.APP_VERSION ?? "dev")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
