import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminProductsService, type ProductStatus } from "./admin-products.service";

@ApiTags("Admin Products")
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  async findAll(
    @Query("search") search?: string,
    @Query("status") status?: ProductStatus,
    @Query("category") category?: string,
    @Query("sort") sort?: string,
  ) {
    if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
      throw new BadRequestException("Estado no válido. Debe ser 'ACTIVE' o 'INACTIVE'.");
    }
    if (sort && !["newest", "oldest", "priceDesc", "priceAsc"].includes(sort)) {
      throw new BadRequestException(
        "Parámetro de ordenación inválido. Debe ser 'newest', 'oldest', 'priceDesc' o 'priceAsc'",
      );
    }
    return this.adminProductsService.findAll(search, status, category, sort);
  }
}
