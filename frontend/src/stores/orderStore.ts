import { create } from 'zustand';
import type { Order } from '../types/order';

interface OrderState {
  activeOrders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  setOrders: (orders: Order[]) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  activeOrders: [],

  addOrder: (order: Order) =>
    set((state) => ({
      activeOrders: [...state.activeOrders, order],
    })),

  updateOrder: (orderId: string, updates: Partial<Order>) =>
    set((state) => ({
      activeOrders: state.activeOrders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    })),

  removeOrder: (orderId: string) =>
    set((state) => ({
      activeOrders: state.activeOrders.filter((order) => order.id !== orderId),
    })),

  setOrders: (orders: Order[]) => set({ activeOrders: orders }),

  getOrderById: (orderId: string) =>
    get().activeOrders.find((order) => order.id === orderId),
}));
