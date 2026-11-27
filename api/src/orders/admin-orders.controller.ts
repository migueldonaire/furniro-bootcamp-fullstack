import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { AdminOrdersService } from "./admin-orders.service";
import { ListAdminOrdersQueryDto } from "./dto/list-admin-orders-query.dto";

// Only a logged-in ADMIN: AuthGuard checks the token (401), AdminGuard checks the role (403)
@UseGuards(AuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiTags("admin-orders")
@Controller("admin/orders")
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  findAll(@Query() query: ListAdminOrdersQueryDto) {
    return this.adminOrdersService.findAll(
      query.status,
      query.search,
      query.page,
      query.limit,
      query.from,
      query.to,
    );
  }
}
