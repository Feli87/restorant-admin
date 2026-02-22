import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  // --- Categories ---

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['menu_items'],
      order: { display_order: 'ASC' },
    });
  }

  async findOneCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menu_items'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.findOneCategory(id);
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findOneCategory(id);
    await this.categoryRepository.remove(category);
  }

  // --- Menu Items ---

  async findAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
    return menuItem;
  }

  async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    if (data.category_id) {
      await this.findOneCategory(data.category_id);
    }
    const menuItem = this.menuItemRepository.create(data);
    return this.menuItemRepository.save(menuItem);
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const menuItem = await this.findOneMenuItem(id);
    if (data.category_id) {
      await this.findOneCategory(data.category_id);
    }
    Object.assign(menuItem, data);
    return this.menuItemRepository.save(menuItem);
  }

  async removeMenuItem(id: string): Promise<void> {
    const menuItem = await this.findOneMenuItem(id);
    await this.menuItemRepository.remove(menuItem);
  }
}
