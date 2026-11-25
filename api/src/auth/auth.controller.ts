import { Controller, Post, Body } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
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
}
