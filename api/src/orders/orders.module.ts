import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminOrdersController } from "./admin-orders.controller";
import { AdminOrdersService } from "./admin-orders.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [AuthModule],
  controllers: [AdminOrdersController, OrdersController],
  providers: [OrdersService, AdminOrdersService],
  exports: [],
})
export class OrdersModule {}
