import { Module } from '@nestjs/common';
import { AdminProductsController } from './admin-products.controller';
import { AdminProductsService } from './admin-products.service';

// Products module: add here the controllers and services of your cards.
// Example: controllers: [ProductsController], providers: [ProductsService]
@Module({
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
  exports: [],
})
export class ProductsModule {}
