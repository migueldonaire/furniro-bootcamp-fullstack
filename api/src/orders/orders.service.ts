import { ConflictException, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { CreateOrderDto } from "./create-order.dto";

const SHIPPING_COST = "8.00";

type OrderProductRow = {
  id: string;
  name: string;
  sku: string;
  base_price: string;
  tax_rate: string;
  currency: string;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
};

export type UsualAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type CreatedOrder = {
  id: string;
  status: "PENDING";
  total: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly pool: Pool) {}

  // The usual address of the user, ready to fill the checkout form.
  // Return null when the user has no usual address.
  async findUsualAddress(userId: string): Promise<UsualAddress | null> {
    const result = await this.pool.query<UsualAddress>(
      `SELECT u.name || ' ' || u.last_name AS "fullName",
              u.phone,
              a.street,
              a.city,
              COALESCE(a.province, '') AS province,
              a.postal_code AS "postalCode",
              a.country
         FROM users u
         JOIN user_addresses a ON a.user_id = u.id
        WHERE u.id = $1`,
      [userId],
    );

    return result.rows[0] ?? null;
  }

  async createOrder(userId: string, order: CreateOrderDto): Promise<CreatedOrder> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // Lock the products so their price, status and stock cannot change during checkout.
      const productsResult = await client.query<OrderProductRow>(
        `SELECT id, name, sku, base_price, tax_rate, currency, stock, status
           FROM products
          WHERE id = ANY($1::uuid[])
          ORDER BY id
          FOR UPDATE`,
        [order.items.map((item) => item.productId)],
      );

      const productsById = new Map<string, OrderProductRow>(
        productsResult.rows.map((product) => [product.id, product]),
      );

      for (const item of order.items) {
        const product = productsById.get(item.productId);

        if (!product || product.status !== "ACTIVE") {
          throw new ConflictException(`${product?.name ?? "El producto"} ya no está disponible`);
        }

        if (product.stock < item.quantity) {
          throw new ConflictException(`Solo quedan ${product.stock} unidades de ${product.name}`);
        }
      }

      const orderResult = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, status, shipping_cost, currency)
         VALUES ($1, 'PENDING', $2, 'EUR')
         RETURNING id`,
        [userId, SHIPPING_COST],
      );

      const orderId = orderResult.rows[0]?.id;

      if (!orderId) {
        throw new Error("The order ID was not returned");
      }

      const address = order.address;
      const fullName = `${address.firstName.trim()} ${address.lastName.trim()}`;

      await client.query(
        `INSERT INTO order_addresses (
           order_id, full_name, phone, street, city, province, postal_code, country
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          orderId,
          fullName,
          address.phone,
          address.street,
          address.city,
          address.province ?? null,
          address.postalCode,
          address.country,
        ],
      );

      for (const item of order.items) {
        const product = productsById.get(item.productId);

        if (!product) {
          throw new Error("A checked product is missing");
        }

        await client.query(
          `INSERT INTO order_lines (
             order_id, product_id, product_name, sku,
             quantity, unit_price, tax_rate, currency
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            orderId,
            product.id,
            product.name,
            product.sku,
            item.quantity,
            product.base_price,
            product.tax_rate,
            product.currency,
          ],
        );

        const stockResult = await client.query(
          `UPDATE products
              SET stock = stock - $1,
                  updated_at = now()
            WHERE id = $2
              AND status = 'ACTIVE'
              AND stock >= $1`,
          [item.quantity, product.id],
        );

        if (stockResult.rowCount !== 1) {
          throw new ConflictException(`No se pudo reservar el stock de ${product.name}`);
        }
      }

      const totalResult = await client.query<{ total: string }>(
        `SELECT (
           o.shipping_cost
           + SUM(
               ROUND(
                 l.quantity * l.unit_price * (1 + l.tax_rate / 100),
                 2
               )
             )
         )::text AS total
           FROM orders o
           JOIN order_lines l ON l.order_id = o.id
          WHERE o.id = $1
          GROUP BY o.id`,
        [orderId],
      );

      const total = totalResult.rows[0]?.total;

      if (!total) {
        throw new Error("The order total could not be calculated");
      }

      await client.query("COMMIT");

      return { id: orderId, status: "PENDING", total };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
