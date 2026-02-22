import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { InventoryItem } from './entities/inventory-item.entity';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('ADMIN', 'CHEF')
  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryService.findAll();
  }

  @Get('alerts')
  @Roles('ADMIN', 'CHEF')
  async getLowStockAlerts(): Promise<InventoryItem[]> {
    return this.inventoryService.getLowStockAlerts();
  }

  @Get(':id')
  @Roles('ADMIN', 'CHEF')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<InventoryItem> {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.inventoryService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.inventoryService.remove(id);
  }
}
