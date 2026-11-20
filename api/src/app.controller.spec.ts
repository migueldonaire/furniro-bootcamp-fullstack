import { Pool } from 'pg';
import { AppController } from './app.controller';

describe('AppController', () => {
  it('health returns ok, the version and the database name', async () => {
    // A fake Pool: no real database needed for a unit test
    const pool = {
      query: jest.fn().mockResolvedValue({ rows: [{ database: 'furniro' }] }),
    } as unknown as Pool;
    const controller = new AppController(pool);

    await expect(controller.health()).resolves.toEqual({
      status: 'ok',
      version: 'dev',
      database: 'furniro',
    });
  });
});
