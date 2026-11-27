import { Controller, Get, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("usual-address")
  @UseGuards(AuthGuard)
  getUsualAddress(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException("No has iniciado sesión");
    }

    return this.ordersService.findUsualAddress(request.user.id);
  }
}
