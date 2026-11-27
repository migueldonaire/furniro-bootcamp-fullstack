import { Injectable } from "@nestjs/common";
import { toProduct, type ProductRow } from "./product";
import { Pool } from "pg";

@Injectable()
export class ProductsService {
  constructor(private readonly pool: Pool) {}
  async findAll() {
    const result = await this.pool.query<ProductRow>(
      `SELECT p.id, p.name, p.description, p.base_price, p.tax_rate, i.url
      FROM products as p
      LEFT JOIN product_images as i
      ON p.id = i.product_id AND i.is_primary
      WHERE p.status = 'ACTIVE'`,
    );
    return result.rows.map(toProduct);
  }
}
