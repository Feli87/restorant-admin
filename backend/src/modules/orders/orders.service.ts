import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { NotificationsService } from '@/modules/notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.menu_item', 'table', 'waiter'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.menu_item', 'table', 'waiter'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async create(data: Partial<Order> & { items?: Partial<OrderItem>[] }): Promise<Order> {
    const order = this.orderRepository.create({
      table_id: data.table_id,
      waiter_id: data.waiter_id,
      notes: data.notes,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (data.items && data.items.length > 0) {
      const orderItems = data.items.map((item) =>
        this.orderItemRepository.create({
          ...item,
          order_id: savedOrder.id,
        }),
      );
      await this.orderItemRepository.save(orderItems);

      const total = orderItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
      );
      savedOrder.total = total;
      await this.orderRepository.save(savedOrder);
    }

    this.notificationsService.notifyNewOrder(savedOrder);

    return this.findOne(savedOrder.id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    this.notificationsService.notifyOrderStatusChange(updatedOrder);

    return this.findOne(updatedOrder.id);
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, data);
    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async updateItemStatus(
    orderId: string,
    itemId: string,
    status: string,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: itemId, order_id: orderId },
    });
    if (!orderItem) {
      throw new NotFoundException(`Order item with ID "${itemId}" not found`);
    }

    orderItem.status = status as any;

    if (status === 'PREPARING' && !orderItem.started_at) {
      orderItem.started_at = new Date();
    }
    if (status === 'READY' || status === 'SERVED') {
      orderItem.completed_at = new Date();
    }

    return this.orderItemRepository.save(orderItem);
  }
}
