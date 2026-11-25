import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { AdminOrder, AdminOrderRow, OrderStatus, toAdminOrder } from "./admin-order";

@Injectable()
export class AdminOrdersService {
  constructor(private readonly pool: Pool) {}

  // Devuelve todos los pedidos (o solo los de un estado) incluyendo email y productos con su imagen principal
  async findAll(status?: OrderStatus): Promise<AdminOrder[]> {
    const where = status !== undefined ? "WHERE o.status = $1" : "";
    const values = status !== undefined ? [status] : [];

    const result = await this.pool.query<AdminOrderRow>(
      `SELECT o.id,
              o.order_date,
              o.status,
              u.name || ' ' || u.last_name AS customer_name,
              u.email AS customer_email,
              ROUND(SUM(ol.unit_price * ol.quantity * (1 + ol.tax_rate / 100)) + o.shipping_cost, 2) AS total,
              json_agg(
                json_build_object(
                  'id', ol.id,
                  'name', ol.product_name,
                  'quantity', ol.quantity,
                  'imageUrl', pi.url
                )
              ) AS products
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_lines ol ON ol.order_id = o.id
       LEFT JOIN product_images pi
         ON pi.product_id = ol.product_id AND pi.is_primary = true
       ${where}
       GROUP BY o.id, u.id
       ORDER BY o.order_date DESC`,
      values,
    );

    return result.rows.map(toAdminOrder);
  }
}
