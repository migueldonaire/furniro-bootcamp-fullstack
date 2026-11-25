import { Injectable, ExecutionContext, ForbiddenException, CanActivate } from "@nestjs/common";
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {sub: string, email: string, role: string};
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    if (!token) {
      throw new ForbiddenException("No autorizado");
    }

    const user = request.user as { role?: string } | undefined;
    if (!user || user.role !== "ADMIN") {
      throw new ForbiddenException("Solo administradores pueden acceder");
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return undefined;
    return authHeader.split(" ")[1];
  }
}
