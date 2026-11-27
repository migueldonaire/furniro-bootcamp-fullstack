import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { OrdersController } from "./orders.controller";
import { AdminOrdersController } from "./admin-orders.controller";
import { AdminOrdersService } from "./admin-orders.service";
import { OrdersService } from "./orders.service";

@Module({
  imports: [AuthModule],
<<<<<<< HEAD
  controllers: [OrdersController],
  providers: [OrdersService],
=======
  controllers: [AdminOrdersController,OrdersController],
  providers: [OrdersService, AdminOrdersService],
>>>>>>> origin
  exports: [],
})
export class OrdersModule {}
