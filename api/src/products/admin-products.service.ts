import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  basePrice: string;
  stock: number;
  status: ProductStatus;
  categoryName: string;
  imageUrl: string | null;
};

export type ProductStatus = "ACTIVE" | "INACTIVE";
@Injectable()
export class AdminProductsService {
  constructor(private readonly pool: Pool) {}

  async findAll(search?: string, status?: ProductStatus): Promise<AdminProduct[]> {
    const result = await this.pool.query<AdminProduct>(
      `
            SELECT p.id, p.name, p.sku, p.base_price AS "basePrice", p.stock, p.status, c.name AS "categoryName", pi.url AS "imageUrl"
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary 
            WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR p.sku ILIKE '%' || $1 || '%')
            AND ($2::text IS NULL OR p.status = $2) 
            ORDER BY p.name
        `,
      [search, status],
    );
    return result.rows;
  }
}
