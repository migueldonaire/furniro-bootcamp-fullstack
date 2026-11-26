import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  CanActivate,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }

    if (user.role !== "ADMIN") {
      throw new ForbiddenException("Admin access only");
    }
    return true;
  }
}
