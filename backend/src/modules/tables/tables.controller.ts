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
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Table } from './entities/table.entity';

@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Roles('ADMIN', 'WAITER', 'CASHIER')
  async findAll(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'WAITER', 'CASHIER')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Table> {
    return this.tablesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: Partial<Table>): Promise<Table> {
    return this.tablesService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN', 'WAITER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Table>,
  ): Promise<Table> {
    return this.tablesService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tablesService.remove(id);
  }
}
