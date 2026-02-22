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
import { Order } from './entities/order.entity';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  UpdateOrderItemStatusDto,
} from './dto/create-order.dto';

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
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'WAITER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'WAITER', 'CASHIER', 'CHEF')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Patch(':id/items/:itemId/status')
  @Roles('ADMIN', 'CHEF', 'WAITER')
  async updateItemStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateOrderItemStatusDto,
  ) {
    return this.ordersService.updateItemStatus(id, itemId, dto.status);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
}
