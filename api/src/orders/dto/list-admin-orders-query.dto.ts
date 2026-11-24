import { IsIn, IsOptional } from 'class-validator';
import type { OrderStatus } from '../admin-order';

export class ListAdminOrdersQueryDto {
  @IsOptional()
  @IsIn(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status?: OrderStatus;
}
