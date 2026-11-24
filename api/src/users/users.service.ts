import {Injectable} from '@nestjs/common';
import {Pool} from 'pg';

@Injectable()
export class UsersService {
    constructor(private readonly pool: Pool) {}

    async findByEmail(email: string) {
        const result = await this.pool.query(
            'SELECT id, name, last_name, email, password_hash, role, status FROM users WHERE lower(email) = lower($1)', [email]
        );

        return result.rows[0];
    }
}