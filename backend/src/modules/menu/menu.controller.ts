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
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // --- Categories ---

  @Get('categories')
  async findAllCategories(): Promise<Category[]> {
    return this.menuService.findAllCategories();
  }

  @Get('categories/:id')
  async findOneCategory(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.menuService.findOneCategory(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategory(@Body() data: Partial<Category>): Promise<Category> {
    return this.menuService.createCategory(data);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Category>,
  ): Promise<Category> {
    return this.menuService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeCategory(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.removeCategory(id);
  }

  // --- Menu Items ---

  @Get('items')
  async findAllMenuItems(): Promise<MenuItem[]> {
    return this.menuService.findAllMenuItems();
  }

  @Get('items/:id')
  async findOneMenuItem(@Param('id', ParseUUIDPipe) id: string): Promise<MenuItem> {
    return this.menuService.findOneMenuItem(id);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createMenuItem(@Body() data: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuService.createMenuItem(data);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<MenuItem>,
  ): Promise<MenuItem> {
    return this.menuService.updateMenuItem(id, data);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeMenuItem(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.removeMenuItem(id);
  }
}
