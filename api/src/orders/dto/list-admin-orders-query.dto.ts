import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import type { OrderStatus } from "../admin-order";

export class ListAdminOrdersQueryDto {
  @IsOptional()
  @IsIn(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
