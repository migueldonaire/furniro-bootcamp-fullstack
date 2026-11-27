import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

// Orders module: add here the controllers and services of your cards.
// Example: controllers: [OrdersController], providers: [OrdersService]
@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [],
})
export class OrdersModule {}
