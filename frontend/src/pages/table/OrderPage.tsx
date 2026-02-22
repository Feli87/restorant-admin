import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersService } from '@/services/ordersService';
import type { Order } from '@/types/order';
import { ShoppingCart, Clock } from 'lucide-react';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PREPARING: 'default',
  READY: 'success',
  SERVED: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

export function TableOrderPage() {
  const { t } = useTranslation();
  const { tableId } = useParams<{ tableId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data.filter((o) => o.tableId === tableId && !['COMPLETED', 'CANCELLED'].includes(o.status)));
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{t('nav.order')}</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">{t('status.noData')}</p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>#{order.orderNumber}</span>
                <Badge variant={statusBadgeVariant[order.status] ?? 'outline'}>
                  {t(`orders.status.${order.status.toLowerCase()}`)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>${item.totalPrice.toFixed(2)}</span>
                      <Badge variant={statusBadgeVariant[item.status] ?? 'outline'} className="text-xs">
                        {t(`orders.itemStatus.${item.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>
                <span className="text-base font-bold">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {orders.length > 0 && (
        <Button variant="outline" className="w-full" onClick={fetchData}>
          {t('actions.refresh')}
        </Button>
      )}
    </div>
  );
}
