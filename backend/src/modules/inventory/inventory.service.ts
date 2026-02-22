import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
    return item;
  }

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.inventoryRepository.create(data);
    return this.inventoryRepository.save(item);
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.inventoryRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.inventoryRepository.remove(item);
  }

  async getLowStockAlerts(): Promise<InventoryItem[]> {
    const items = await this.inventoryRepository
      .createQueryBuilder('item')
      .where('item.quantity <= item.min_stock')
      .orderBy('item.quantity', 'ASC')
      .getMany();
    return items;
  }
}
