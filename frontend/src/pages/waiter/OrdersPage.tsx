import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersService } from '@/services/ordersService';
import type { Order, OrderStatus } from '@/types/order';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PREPARING: 'default',
  READY: 'success',
  SERVED: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

export function WaiterOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)));
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markServed = async (orderId: string) => {
    await ordersService.updateStatus(orderId, 'SERVED' as OrderStatus);
    await fetchData();
  };

  const sorted = [...orders].sort((a, b) => {
    const priority: Record<string, number> = { READY: 0, PREPARING: 1, PENDING: 2, SERVED: 3 };
    return (priority[a.status] ?? 4) - (priority[b.status] ?? 4);
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('orders.title')}</h2>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">{t('status.noData')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => (
            <Card key={order.id} className={order.status === 'READY' ? 'border-green-500/50' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">
                  #{order.orderNumber} — {order.tableName}
                </CardTitle>
                <Badge variant={statusBadgeVariant[order.status] ?? 'outline'}>
                  {t(`orders.status.${order.status.toLowerCase()}`)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <Badge variant={statusBadgeVariant[item.status] ?? 'outline'} className="text-xs">
                        {t(`orders.itemStatus.${item.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                  {order.status === 'READY' && (
                    <Button size="sm" onClick={() => markServed(order.id)}>
                      {t('orders.status.served')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
