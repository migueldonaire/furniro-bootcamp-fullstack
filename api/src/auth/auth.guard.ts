import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../users/users.service";
import { User } from "../users/user";

declare module "express" {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException("No token");

    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const user = await this.usersService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedException("User not found");
    if (user.status !== "ACTIVE") {
      throw new ForbiddenException(
        "YOUR account is not active or is pending confirmation. Please confirm your email before logging in.",
      );
    }
    request.user = user;
    return true;
  }
  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return undefined;
    return authHeader.split(" ")[1];
  }
}
