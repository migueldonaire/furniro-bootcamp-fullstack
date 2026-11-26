import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { AdminOrder, AdminOrderRow, OrderStatus, toAdminOrder } from "./admin-order";

export type PaginatedAdminOrders = {
  items: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

@Injectable()
export class AdminOrdersService {
  constructor(private readonly pool: Pool) {}

  async findAll(
    status?: OrderStatus,
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedAdminOrders> {
    const conditions: string[] = [];
    const filterValues: string[] = [];

    if (status !== undefined) {
      filterValues.push(status);
      conditions.push(`o.status = $${filterValues.length}`);
    }

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      filterValues.push(`%${trimmedSearch}%`);
      const param = `$${filterValues.length}`;

      conditions.push(
        `(o.id::text ILIKE ${param}
          OR (u.name || ' ' || u.last_name) ILIKE ${param}
          OR u.email ILIKE ${param}
          OR EXISTS (
            SELECT 1
            FROM order_lines ol_search
            WHERE ol_search.order_id = o.id
              AND ol_search.product_name ILIKE ${param}
          ))`,
      );
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const currentPage = Math.max(1, Number(page) || 1);
    const currentLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const offset = (currentPage - 1) * currentLimit;

    const countResult = await this.pool.query<{ total: number }>(
      `SELECT COUNT(DISTINCT o.id)::int AS total
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_lines ol ON ol.order_id = o.id
       ${where}`,
      filterValues,
    );

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.ceil(total / currentLimit);

    const limitParam = `$${filterValues.length + 1}`;
    const offsetParam = `$${filterValues.length + 2}`;

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
       ORDER BY o.order_date DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...filterValues, currentLimit, offset],
    );

    return {
      items: result.rows.map(toAdminOrder),
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
    };
  }
}
