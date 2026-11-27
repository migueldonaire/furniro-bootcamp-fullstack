import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminProductsService } from "./admin-products.service";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { ListAdminProductsQueryDto } from "./dto/list-admin-products-query.dto";

@ApiTags("Admin Products")
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(@Query() query: ListAdminProductsQueryDto) {
    return this.adminProductsService.findAll(
      query.page,
      query.limit,
      query.search,
      query.status,
      query.category,
      query.sort,
    );
  }
}
