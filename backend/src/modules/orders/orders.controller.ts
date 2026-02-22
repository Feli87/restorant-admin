import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Order, OrderStatus } from './entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles('ADMIN', 'WAITER', 'CASHIER', 'CHEF')
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'WAITER', 'CASHIER', 'CHEF')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'WAITER', 'TABLE_USER')
  async create(@Body() data: any): Promise<Order> {
    return this.ordersService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN', 'WAITER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, data);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'WAITER', 'CASHIER', 'CHEF')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/items/:itemId/status')
  @Roles('ADMIN', 'CHEF', 'WAITER')
  async updateItemStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateItemStatus(id, itemId, status);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
}
