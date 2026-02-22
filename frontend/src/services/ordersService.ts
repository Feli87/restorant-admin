import api from './api';
import type { Order, OrderItem, OrderStatus, OrderItemStatus } from '../types/order';

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/orders');
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  create: async (order: {
    tableId: string;
    waiterId?: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
    notes?: string;
  }): Promise<Order> => {
    const { data } = await api.post<Order>('/orders', order);
    return data;
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    const { data } = await api.put<Order>(`/orders/${id}`, order);
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },

  updateItemStatus: async (orderId: string, itemId: string, status: OrderItemStatus): Promise<OrderItem> => {
    const { data } = await api.patch<OrderItem>(`/orders/${orderId}/items/${itemId}/status`, { status });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
