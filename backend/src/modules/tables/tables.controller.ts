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
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';

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
  async create(@Body() dto: CreateTableDto): Promise<Table> {
    return this.tablesService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'WAITER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTableDto,
  ): Promise<Table> {
    return this.tablesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tablesService.remove(id);
  }
}
