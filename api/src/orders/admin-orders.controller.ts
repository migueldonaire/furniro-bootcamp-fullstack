import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminOrdersService } from "./admin-orders.service";
import { ListAdminOrdersQueryDto } from "./dto/list-admin-orders-query.dto";

// TODO (FUR-27): add @UseGuards(AuthGuard, AdminGuard) and @ApiBearerAuth()
@ApiTags("admin-orders")
@Controller("admin/orders")
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  findAll(@Query() query: ListAdminOrdersQueryDto) {
    return this.adminOrdersService.findAll(query.status, query.search, query.page, query.limit);
  }
}
