import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminProductsService, type ProductStatus } from "./admin-products.service";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";

@ApiTags("Admin Products")
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
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
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException("La página y el límite deben ser mayor que 0");
    }
    return this.adminProductsService.findAll(page, limit, search, status, category, sort);
  }
}
