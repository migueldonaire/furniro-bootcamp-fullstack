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

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type AdminProductResponse = {
  data: AdminProduct[];
  pagination: Pagination;
};

export type ProductStatus = "ACTIVE" | "INACTIVE";
@Injectable()
export class AdminProductsService {
  constructor(private readonly pool: Pool) {}

  async findAll(
    page: number = 1,
    limit: number = 6,
    search?: string,
    status?: ProductStatus,
    category?: string,
    sort?: string,
  ): Promise<AdminProductResponse> {
    const sortList: Record<string, string> = {
      newest: "p.created_at DESC",
      oldest: "p.created_at ASC",
      priceAsc: "p.base_price ASC",
      priceDesc: "p.base_price DESC",
    };

    const offset = (page - 1) * limit;

    const sortQuery = sortList[sort ?? "newest"];

    const result = await this.pool.query<AdminProduct>(
      `
            SELECT p.id, p.name, p.sku, p.base_price AS "basePrice", p.stock, p.status, c.name AS "categoryName", pi.url AS "imageUrl"
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary 
            WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR p.sku ILIKE '%' || $1 || '%')
            AND ($2::text IS NULL OR p.status = $2) 
            AND ($3::uuid IS NULL OR p.category_id = $3)
            ORDER BY ${sortQuery}, p.name
            LIMIT $5 
            OFFSET $4
        `,
      [search, status, category, offset, limit],
    );

    const countResult = await this.pool.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary 
      WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%' OR p.sku ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR p.status = $2) 
      AND ($3::uuid IS NULL OR p.category_id = $3)
      `,
      [search, status, category],
    );
    const total = Number(countResult.rows[0].total);
    return { data: result.rows, pagination: { page, limit, total } };
  }
}
