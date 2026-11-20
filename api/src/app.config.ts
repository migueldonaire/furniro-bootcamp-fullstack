import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { requestLogger } from './common/request-logger';

// The app configuration, in one place.
// main.ts and the e2e tests both use it, so they behave the same.
export function configureApp(app: INestApplication) {
  app.use(helmet()); // security headers
  app.use(requestLogger); // one console line per request

  // CORS: which websites can call the API from the browser.
  // CORS_ORIGIN can hold several URLs separated by commas (shop and backoffice).
  const origins = (
    process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:5174'
  ).split(',');
  app.enableCors({ origin: origins });

  app.setGlobalPrefix('api'); // every route starts with /api
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' }); // /api/v1/...

  // Validates the DTOs on every route
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // 400 if unknown fields arrive
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter()); // every error with the same shape
}
