import { Module } from "@nestjs/common";
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

// Products module: add here the controllers and services of your cards.
// Example: controllers: [ProductsController], providers: [ProductsService]
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [],
})
export class ProductsModule {}
