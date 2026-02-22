import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Sale } from './entities/sale.entity';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @Roles('ADMIN', 'CASHIER')
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get('daily-summary')
  @Roles('ADMIN', 'CASHIER')
  async getDailySummary(@Query('date') dateStr: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.salesService.getDailySummary(date);
  }

  @Get(':id')
  @Roles('ADMIN', 'CASHIER')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'CASHIER')
  async create(@Body() data: Partial<Sale>): Promise<Sale> {
    return this.salesService.create(data);
  }
}
