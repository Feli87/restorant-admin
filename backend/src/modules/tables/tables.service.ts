import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async findAll(): Promise<Table[]> {
    return this.tableRepository.find({
      order: { number: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with ID "${id}" not found`);
    }
    return table;
  }

  async create(data: Partial<Table>): Promise<Table> {
    if (data.number) {
      const existing = await this.tableRepository.findOne({ where: { number: data.number } });
      if (existing) {
        throw new ConflictException(`Table number ${data.number} already exists`);
      }
    }
    const table = this.tableRepository.create(data);
    return this.tableRepository.save(table);
  }

  async update(id: string, data: Partial<Table>): Promise<Table> {
    const table = await this.findOne(id);
    if (data.number && data.number !== table.number) {
      const existing = await this.tableRepository.findOne({ where: { number: data.number } });
      if (existing) {
        throw new ConflictException(`Table number ${data.number} already exists`);
      }
    }
    Object.assign(table, data);
    return this.tableRepository.save(table);
  }

  async remove(id: string): Promise<void> {
    const table = await this.findOne(id);
    await this.tableRepository.remove(table);
  }
}
