import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Pool } from 'pg';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly pool: Pool) {}

  // GET /api/v1/health: is the API alive? Which version? Is the database OK?
  // The deploy pipeline calls it to check that the new version is online.
  @Get('health')
  async health() {
    const result = await this.pool.query<{ database: string }>(
      'SELECT current_database() AS database',
    );
    return {
      status: 'ok',
      version: process.env.APP_VERSION ?? 'dev',
      database: result.rows[0].database,
    };
  }
}
