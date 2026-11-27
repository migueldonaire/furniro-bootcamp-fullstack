import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Limita a 5 solicitudes por minuto
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException("No has iniciado sesión");
    }

    const { id, name, lastName, email, role } = request.user;
    return { id, name, lastName, email, role };
  }
}
