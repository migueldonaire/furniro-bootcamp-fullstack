import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

export type User = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string) {
    const result = await this.pool.query<User>(
      "SELECT id, name, last_name, email, password_hash, role, status FROM users WHERE lower(email) = lower($1)",
      [email],
    );

    const row = result.rows[0];
    return row;
  }
}
