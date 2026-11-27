import { Injectable, NotFoundException } from "@nestjs/common";
import { Pool } from "pg";
import {
  AdminOrder,
  AdminOrderDetail,
  AdminOrderDetailRow,
  AdminOrderLineRow,
  AdminOrderRow,
  OrderStatus,
  toAdminOrder,
  toAdminOrderDetail,
} from "./admin-order";

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
    limit = 20,
    from?: string,
    to?: string,
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

    if (from) {
      filterValues.push(from);
      conditions.push(`o.order_date >= $${filterValues.length}`);
    }

    // "< to + 1 day" so the orders of the last day (in the afternoon too) are included
    if (to) {
      filterValues.push(to);
      conditions.push(`o.order_date < $${filterValues.length}::date + 1`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // page and limit are already validated by the DTO (page >= 1, limit 1-50)
    const offset = (page - 1) * limit;

    // The product search uses EXISTS, so there is no need to join order_lines here
    const countResult = await this.pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ${where}`,
      filterValues,
    );

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    const limitParam = `$${filterValues.length + 1}`;
    const offsetParam = `$${filterValues.length + 2}`;

    const result = await this.pool.query<AdminOrderRow>(
      `SELECT o.id,
              o.order_date,
              o.status,
              u.name || ' ' || u.last_name AS customer_name,
              u.email AS customer_email,
              ROUND(COALESCE(SUM(ol.unit_price * ol.quantity * (1 + ol.tax_rate / 100)), 0) + o.shipping_cost, 2) AS total,
              json_agg(
                json_build_object(
                  'id', ol.id,
                  'name', ol.product_name,
                  'quantity', ol.quantity,
                  'imageUrl', pi.url
                )
              ) FILTER (WHERE ol.id IS NOT NULL) AS products
       FROM orders o
       JOIN users u ON u.id = o.user_id
       -- LEFT JOIN: an order without lines still shows up (and matches the COUNT)
       LEFT JOIN order_lines ol ON ol.order_id = o.id
       LEFT JOIN product_images pi
         ON pi.product_id = ol.product_id AND pi.is_primary = true
       ${where}
       GROUP BY o.id, u.id
       ORDER BY o.order_date DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      [...filterValues, limit, offset],
    );

    return {
      items: result.rows.map(toAdminOrder),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<AdminOrderDetail> {
    // 1) El pedido, con su cliente y su dirección de entrega
    const orderResult = await this.pool.query<AdminOrderDetailRow>(
      `SELECT o.id,
              o.order_date,
              o.status,
              o.shipping_cost,
              o.currency,
              u.name || ' ' || u.last_name AS customer_name,
              u.email AS customer_email,
              u.phone AS customer_phone,
              a.full_name,
              a.phone AS address_phone,
              a.street,
              a.city,
              a.province,
              a.postal_code,
              a.country
         FROM orders o
         JOIN users u ON u.id = o.user_id
         JOIN order_addresses a ON a.order_id = o.id
        WHERE o.id = $1`,
      [id],
    );

    const row = orderResult.rows[0];
    if (!row) {
      throw new NotFoundException("Pedido no encontrado");
    }

    // 2) Las líneas: precio y SKU copiados al comprar. NO se lee products.base_price.
    //    LEFT JOIN: la foto principal, si la hay (como en el listado de FUR-50)
    const linesResult = await this.pool.query<AdminOrderLineRow>(
      `SELECT ol.id,
              ol.product_name,
              ol.sku,
              ol.quantity,
              ol.unit_price,
              ol.tax_rate,
              pi.url AS image_url
         FROM order_lines ol
         LEFT JOIN product_images pi
           ON pi.product_id = ol.product_id AND pi.is_primary = true
        WHERE ol.order_id = $1
        ORDER BY ol.product_name`,
      [id],
    );

    return toAdminOrderDetail(row, linesResult.rows);
  }
}
