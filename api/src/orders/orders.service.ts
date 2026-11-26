import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

export type UsualAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly pool: Pool) {}

  // The usual address of the user, ready to fill the checkout form.
  // null if the user has no usual address (0 or 1 per user).
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
}
