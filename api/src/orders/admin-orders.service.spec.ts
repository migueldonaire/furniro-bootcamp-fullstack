// api/src/orders/admin-orders.service.spec.ts
import { Pool } from 'pg';
import { AdminOrdersService } from './admin-orders.service';

// A row as pg returns it: snake_case and the total as text
const lauraRow = {
  id: 'f0000000-0000-4000-8000-000000000012',
  order_date: new Date('2026-11-17T20:00:00Z'),
  status: 'SHIPPED',
  customer_name: 'Laura Romero',
  total: '425.45',
};

describe('AdminOrdersService', () => {
  const fakePool = { query: jest.fn() };
  const service = new AdminOrdersService(fakePool as unknown as Pool);

  beforeEach(() => {
    fakePool.query.mockReset();
  });

  it('without status it lists every order, converted to camelCase', async () => {
    fakePool.query.mockResolvedValue({ rows: [lauraRow] });

    const orders = await service.findAll();

    expect(orders).toEqual([
      {
        id: 'f0000000-0000-4000-8000-000000000012',
        orderDate: new Date('2026-11-17T20:00:00Z'),
        status: 'SHIPPED',
        customerName: 'Laura Romero',
        total: 425.45,
      },
    ]);
    expect(fakePool.query).toHaveBeenCalledWith(
      expect.not.stringContaining('WHERE'),
      [],
    );
  });

  it('with status it filters by that status', async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    await service.findAll('PENDING');

    expect(fakePool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE o.status = $1'),
      ['PENDING'],
    );
  });

  it('returns an empty list when there are no orders', async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    const orders = await service.findAll();

    expect(orders).toEqual([]);
  });
});
