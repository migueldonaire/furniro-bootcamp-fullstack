import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { User } from "./user";

type UserRow = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
};

export type UserWithPassword = User & { passwordHash: string };

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserWithPassword | undefined> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, name, last_name, email, password_hash, role, status FROM users WHERE lower(email) = lower($1)",
      [email],
    );
    const row = result.rows[0];
    return row ? { ...toUser(row), passwordHash: row.password_hash } : undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, name, last_name, email, password_hash, role, status FROM users WHERE id = $1",
      [id],
    );
    const row = result.rows[0];
    return row ? toUser(row) : undefined;
  }
}
