import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/sale.dto';

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
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }
    return this.salesService.getDailySummary(date);
  }

  @Get(':id')
  @Roles('ADMIN', 'CASHIER')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'CASHIER')
  async create(@Body() dto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(dto);
  }
}
