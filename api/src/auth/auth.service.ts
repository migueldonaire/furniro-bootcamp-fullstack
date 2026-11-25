import { Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { UsersService, User } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user: User | undefined = await this.usersService.findByEmail(email);
    const passwordOk = user ? await verify(user.password_hash, password) : false;
    if (!user || !passwordOk) {
      throw new UnauthorizedException("Credenciales no válidas");
    }
    if (user.status === "PENDING") {
      throw new ForbiddenException("Confirma tu email antes de entrar");
    }
    if (user.status === "INACTIVE") {
      throw new ForbiddenException(
        "Tu cuenta está desactivada. Escríbenos a furnirobootcampfullstack@gmail.com",
      );
    }
    const payload = { sub: user.id, email: user.email, role: user.role, status: user.status };
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    return { accessToken };
  }
}
