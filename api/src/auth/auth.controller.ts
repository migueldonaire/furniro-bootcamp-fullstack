import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { LoginDto } from "./login.dto";
import type { User } from "../users/user";

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
  @ApiBearerAuth()
  me(@Req() request: Request): User {
    return request.user!;
  }
}
