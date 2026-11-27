import { Module } from "@nestjs/common";
import { AdminProductsController } from "./admin-products.controller";
import { AdminProductsService } from "./admin-products.service";
import { AuthModule } from "../auth/auth.module";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

// Products module: add here the controllers and services of your cards.
// Example: controllers: [ProductsController], providers: [ProductsService]
@Module({
  controllers: [AdminProductsController, ProductsController],
  providers: [AdminProductsService, ProductsService],
  exports: [],
  imports: [AuthModule],
})
export class ProductsModule {}
