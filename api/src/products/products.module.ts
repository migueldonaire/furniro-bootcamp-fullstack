import { Module } from "@nestjs/common";
import { AdminProductsController } from "./admin-products.controller";
import { AdminProductsService } from "./admin-products.service";
import { AuthModule } from "../auth/auth.module";

// Products module: add here the controllers and services of your cards.
// Example: controllers: [ProductsController], providers: [ProductsService]
@Module({
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
  exports: [],
  imports: [AuthModule],
})
export class ProductsModule {}
