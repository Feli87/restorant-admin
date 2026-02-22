import { useEffect, useCallback } from 'react';
import { useOrderStore } from '../stores/orderStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from './useSocket';
import { SocketEvents } from '../socket/events';
import type { Order } from '../types/order';

export const useOrders = () => {
  const { activeOrders, addOrder, updateOrder, removeOrder, setOrders, getOrderById } =
    useOrderStore();
  const { addNotification } = useNotificationStore();
  const { on, off } = useSocket();

  useEffect(() => {
    const handleNewOrder = (order: Order) => {
      addOrder(order);
      addNotification({
        title: 'Nuevo Pedido',
        message: `Pedido #${order.orderNumber} recibido de mesa ${order.tableName}`,
        type: 'info',
      });
    };

    const handleOrderUpdate = (data: { orderId: string; updates: Partial<Order> }) => {
      updateOrder(data.orderId, data.updates);
    };

    const handleOrderCancel = (data: { orderId: string }) => {
      const order = getOrderById(data.orderId);
      if (order) {
        addNotification({
          title: 'Pedido Cancelado',
          message: `Pedido #${order.orderNumber} ha sido cancelado`,
          type: 'warning',
        });
      }
      removeOrder(data.orderId);
    };

    const handleOrderComplete = (data: { orderId: string }) => {
      const order = getOrderById(data.orderId);
      if (order) {
        addNotification({
          title: 'Pedido Completado',
          message: `Pedido #${order.orderNumber} ha sido completado`,
          type: 'success',
        });
      }
      removeOrder(data.orderId);
    };

    on<Order>(SocketEvents.ORDER_NEW, handleNewOrder);
    on<{ orderId: string; updates: Partial<Order> }>(SocketEvents.ORDER_UPDATE, handleOrderUpdate);
    on<{ orderId: string }>(SocketEvents.ORDER_CANCEL, handleOrderCancel);
    on<{ orderId: string }>(SocketEvents.ORDER_COMPLETE, handleOrderComplete);

    return () => {
      off(SocketEvents.ORDER_NEW);
      off(SocketEvents.ORDER_UPDATE);
      off(SocketEvents.ORDER_CANCEL);
      off(SocketEvents.ORDER_COMPLETE);
    };
  }, [on, off, addOrder, updateOrder, removeOrder, getOrderById, addNotification]);

  const getOrdersByStatus = useCallback(
    (status: Order['status']) => activeOrders.filter((order) => order.status === status),
    [activeOrders]
  );

  return {
    activeOrders,
    addOrder,
    updateOrder,
    removeOrder,
    setOrders,
    getOrderById,
    getOrdersByStatus,
  };
};
