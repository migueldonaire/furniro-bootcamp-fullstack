import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AdminGuard } from "./admin.guard";
import { UsersModule } from "../users/users.module";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'local-dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
controllers: [AuthController],
providers: [AuthService, AuthGuard, AdminGuard],
exports: [AuthService, AuthGuard, AdminGuard],
})
export class AuthModule {}
