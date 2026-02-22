import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['order', 'cashier'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['order', 'cashier'],
    });
    if (!sale) {
      throw new NotFoundException(`Sale with ID "${id}" not found`);
    }
    return sale;
  }

  async create(data: Partial<Sale>): Promise<Sale> {
    const sale = this.saleRepository.create(data);
    return this.saleRepository.save(sale);
  }

  async getDailySummary(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await this.saleRepository.find({
      where: {
        created_at: Between(startOfDay, endOfDay),
      },
      relations: ['order', 'cashier'],
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const totalTax = sales.reduce((sum, sale) => sum + Number(sale.tax), 0);
    const totalTips = sales.reduce((sum, sale) => sum + Number(sale.tip), 0);
    const totalTransactions = sales.length;

    return {
      date: date.toISOString().split('T')[0],
      total_revenue: totalRevenue,
      total_tax: totalTax,
      total_tips: totalTips,
      total_transactions: totalTransactions,
      sales,
    };
  }
}
