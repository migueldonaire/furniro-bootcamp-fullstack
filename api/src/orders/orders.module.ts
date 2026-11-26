import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";

// Orders module: add here the controllers and services of your cards.
// Example: controllers: [OrdersController], providers: [OrdersService]
@Module({
  controllers: [],
  providers: [OrdersService],
  exports: [],
})
export class OrdersModule {}
