import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { type ProductStatus } from "../admin-products.service";

export class ListAdminProductsQueryDto {
  @IsOptional()
  @IsIn(["ACTIVE", "INACTIVE"])
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @IsIn(["newest", "oldest", "priceAsc", "priceDesc"])
  sort?: string;

  @Type(() => Number)
  @IsOptional()
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
