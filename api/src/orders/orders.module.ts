import { Module } from "@nestjs/common";
import { AdminOrdersController } from "./admin-orders.controller";
import { AdminOrdersService } from "./admin-orders.service";
import { OrdersService } from "./orders.service";

@Module({
  controllers: [AdminOrdersController],
  providers: [OrdersService, AdminOrdersService],
  exports: [],
})
export class OrdersModule {}
