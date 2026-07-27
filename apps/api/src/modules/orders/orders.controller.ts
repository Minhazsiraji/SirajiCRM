import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TenantId } from '../../common/tenant.decorator.js';
import { OrdersService, CreateOrderInput } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@TenantId() tenantId: string, @Query('state') state?: string) {
    return this.orders.list(tenantId, state);
  }

  @Post()
  create(@TenantId() tenantId: string, @Body() body: CreateOrderInput) {
    return this.orders.create(tenantId, body);
  }

  @Post(':id/confirm')
  confirm(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.orders.confirm(tenantId, id);
  }

  @Post(':id/book')
  book(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.orders.book(tenantId, id);
  }

  @Post(':id/sync')
  sync(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.orders.syncStatus(tenantId, id);
  }
}
