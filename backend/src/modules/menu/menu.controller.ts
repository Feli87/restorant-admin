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
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';

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
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.menuService.createCategory(dto);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.menuService.updateCategory(id, dto);
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
  async createMenuItem(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuService.createMenuItem(dto);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuService.updateMenuItem(id, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeMenuItem(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.removeMenuItem(id);
  }
}
