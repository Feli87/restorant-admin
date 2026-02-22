import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersService } from '@/services/ordersService';
import type { Order, OrderStatus } from '@/types/order';
import { CheckCircle2, Clock, ChefHat, UtensilsCrossed, RefreshCw } from 'lucide-react';

const statusIcons: Record<string, typeof CheckCircle2> = {
  PENDING: Clock,
  PREPARING: ChefHat,
  READY: CheckCircle2,
  SERVED: UtensilsCrossed,
};

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-500',
  PREPARING: 'text-blue-500',
  READY: 'text-green-500',
  SERVED: 'text-gray-500',
};

const steps: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'SERVED'] as OrderStatus[];

export function TableStatusPage() {
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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getStepIndex = (status: string) => steps.indexOf(status as OrderStatus);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('nav.status')}</h2>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">{t('status.noData')}</p>
        </div>
      ) : (
        orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold">#{order.orderNumber}</span>
                  <Badge>{t(`orders.status.${order.status.toLowerCase()}`)}</Badge>
                </div>

                {/* Progress steps */}
                <div className="flex items-center justify-between">
                  {steps.map((step, idx) => {
                    const Icon = statusIcons[step] ?? Clock;
                    const isActive = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-1">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                            isCurrent
                              ? `border-current ${statusColors[step]} bg-current/10`
                              : isActive
                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                : 'border-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs ${isCurrent ? 'font-bold' : 'text-muted-foreground'}`}>
                          {t(`orders.status.${step.toLowerCase()}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="mt-4 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <Badge
                        variant={item.status === 'READY' ? 'success' : item.status === 'PREPARING' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {t(`orders.itemStatus.${item.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
