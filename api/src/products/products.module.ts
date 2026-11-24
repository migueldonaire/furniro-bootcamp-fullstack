<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { AdminProductsController } from './admin-products.controller';
import { AdminProductsService } from './admin-products.service';
=======
import { Module } from "@nestjs/common";
>>>>>>> da43fa8cfdc76b560d1d837277f1be73a26313c1

// Products module: add here the controllers and services of your cards.
// Example: controllers: [ProductsController], providers: [ProductsService]
@Module({
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
  exports: [],
})
export class ProductsModule {}
