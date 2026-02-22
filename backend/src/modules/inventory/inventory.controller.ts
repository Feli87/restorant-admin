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
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto/inventory.dto';

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
  async create(@Body() dto: CreateInventoryItemDto): Promise<InventoryItem> {
    return this.inventoryService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.inventoryService.remove(id);
  }
}
