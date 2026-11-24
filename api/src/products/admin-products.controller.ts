import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminProductsService, type ProductStatus } from "./admin-products.service";

@ApiTags("Admin Products")
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  async findAll(@Query("search") search?: string, @Query("status") status?: ProductStatus) {
    return this.adminProductsService.findAll(search, status);
  }
}
