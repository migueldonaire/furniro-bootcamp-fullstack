import { Module } from '@nestjs/common';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminOrdersService } from './admin-orders.service';
import { Module } from "@nestjs/common";

@Module({
  controllers: [AdminOrdersController],
  providers: [AdminOrdersService],
  exports: [],
})
export class OrdersModule {}
