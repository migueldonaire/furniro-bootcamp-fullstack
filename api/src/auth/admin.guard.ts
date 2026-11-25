import { Injectable, ExecutionContext, ForbiddenException, CanActivate } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: { sub: string; email: string; role: string; status: string };
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new ForbiddenException("No autorizado");
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role: string;
        status: string;
      }>(token);
      request.user = payload;
    } catch {
      throw new ForbiddenException("Token inválido o expirado");
    }

    const user = request.user;
    if (!user || user.role !== "ADMIN") {
      throw new ForbiddenException("Solo administradores pueden acceder");
    }
    if (user.status !== "ACTIVE") {
      throw new ForbiddenException("Tu cuenta está desactivada o pendiente de activación");
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return undefined;
    return authHeader.split(" ")[1];
  }
}
