import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';

@ApiTags('Admin Products')
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  async findAll() {
    return this.adminProductsService.findAll();
  }
}
