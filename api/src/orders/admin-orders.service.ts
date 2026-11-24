import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { AdminOrder, AdminOrderRow, OrderStatus, toAdminOrder } from "./admin-order";

@Injectable()
export class AdminOrdersService {
  constructor(private readonly pool: Pool) {}

  // All the orders, newest first. With status, only the orders in that status
  async findAll(status?: OrderStatus): Promise<AdminOrder[]> {
    const where = status !== undefined ? "WHERE o.status = $1" : "";
    const values = status !== undefined ? [status] : [];

    const result = await this.pool.query<AdminOrderRow>(
      `SELECT o.id,
              o.order_date,
              o.status,
              u.name || ' ' || u.last_name AS customer_name,
              ROUND(SUM(ol.unit_price * ol.quantity * (1 + ol.tax_rate / 100)) + o.shipping_cost, 2) AS total
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_lines ol ON ol.order_id = o.id
       ${where}
       GROUP BY o.id, u.id
       ORDER BY o.order_date DESC`,
      values,
    );

    return result.rows.map(toAdminOrder);
  }
}
