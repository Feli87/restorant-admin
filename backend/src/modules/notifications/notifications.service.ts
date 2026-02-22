import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  notifyNewOrder(order: any): void {
    this.gateway.sendToRoom('kitchen', 'new-order', {
      message: `New order #${order.id.slice(0, 8)} received`,
      order,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('waiters', 'new-order', {
      message: `New order #${order.id.slice(0, 8)} created`,
      order,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('admin', 'new-order', {
      message: `New order #${order.id.slice(0, 8)} received`,
      order,
      timestamp: new Date().toISOString(),
    });
  }

  notifyOrderStatusChange(order: any): void {
    this.gateway.sendToRoom('waiters', 'order-status-changed', {
      message: `Order #${order.id.slice(0, 8)} status changed to ${order.status}`,
      order,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('kitchen', 'order-status-changed', {
      message: `Order #${order.id.slice(0, 8)} status changed to ${order.status}`,
      order,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('cashiers', 'order-status-changed', {
      message: `Order #${order.id.slice(0, 8)} status changed to ${order.status}`,
      order,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('admin', 'order-status-changed', {
      message: `Order #${order.id.slice(0, 8)} status: ${order.status}`,
      order,
      timestamp: new Date().toISOString(),
    });
  }

  notifyLowStock(item: any): void {
    this.gateway.sendToRoom('admin', 'low-stock-alert', {
      message: `Low stock alert: ${item.name} (${item.quantity} ${item.unit} remaining)`,
      item,
      timestamp: new Date().toISOString(),
    });

    this.gateway.sendToRoom('kitchen', 'low-stock-alert', {
      message: `Low stock: ${item.name}`,
      item,
      timestamp: new Date().toISOString(),
    });
  }
}
