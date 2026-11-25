import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {sub: string, email: string, role: string};
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException("No hay token");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }
  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return undefined;
    return authHeader.split(" ")[1];
  }
}
