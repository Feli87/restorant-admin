import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ordersService } from '@/services/ordersService';
import type { Order, OrderItemStatus } from '@/types/order';
import { Clock, ChefHat, CheckCircle2, RefreshCw } from 'lucide-react';

const itemStatusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PREPARING: 'default',
  READY: 'success',
  SERVED: 'secondary',
  CANCELLED: 'destructive',
};

function getElapsedMinutes(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

export function ChefDashboardPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data.filter((o) => ['PENDING', 'PREPARING'].includes(o.status)));
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateItemStatus = async (orderId: string, itemId: string, status: OrderItemStatus) => {
    await ordersService.updateItemStatus(orderId, itemId, status);
    await fetchData();
  };

  const markOrderReady = async (orderId: string) => {
    await ordersService.updateStatus(orderId, 'READY' as import('@/types/order').OrderStatus);
    await fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="h-6 w-6" />
          <span className="text-xl font-bold">{t('kitchen.title')}</span>
          <Badge variant="outline">{orders.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-gray-600" />
            <p className="mt-4 text-2xl font-bold text-gray-400">{t('kitchen.noOrders')}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {orders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isUrgent = elapsed > 20;
            return (
              <div
                key={order.id}
                className={`rounded-xl border-2 p-4 ${isUrgent ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-900'}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">#{order.orderNumber}</span>
                    <Badge variant="outline">{order.tableName}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className={`text-lg font-mono font-bold ${isUrgent ? 'text-red-500' : 'text-gray-300'}`}>
                      {elapsed}m
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">{item.quantity}x</span>
                        <div>
                          <span className="text-base font-medium text-white">{item.name}</span>
                          {item.notes && <p className="text-xs text-gray-400">{item.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemStatus(order.id, item.id, 'PREPARING' as OrderItemStatus)}
                          >
                            {t('orders.itemStatus.preparing')}
                          </Button>
                        )}
                        {item.status === 'PREPARING' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateItemStatus(order.id, item.id, 'READY' as OrderItemStatus)}
                          >
                            {t('orders.itemStatus.ready')}
                          </Button>
                        )}
                        {(item.status === 'READY' || item.status === 'SERVED') && (
                          <Badge variant={itemStatusBadge[item.status]}>
                            {t(`orders.itemStatus.${item.status.toLowerCase()}`)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.items.every((i) => i.status === 'READY') && (
                  <Button
                    className="mt-3 w-full bg-green-600 text-lg font-bold hover:bg-green-700"
                    size="lg"
                    onClick={() => markOrderReady(order.id)}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {t('orders.status.ready')}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
