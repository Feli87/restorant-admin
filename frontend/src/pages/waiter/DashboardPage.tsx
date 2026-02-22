import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { tablesService } from '@/services/tablesService';
import { ordersService } from '@/services/ordersService';
import type { Table, TableStatus } from '@/types/table';
import type { Order } from '@/types/order';
import { UtensilsCrossed, ShoppingCart, Clock } from 'lucide-react';

const tableStatusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'warning',
  RESERVED: 'default',
  OUT_OF_SERVICE: 'destructive',
};

const tableStatusKey: Record<string, string> = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  OUT_OF_SERVICE: 'outOfService',
};

export function WaiterDashboardPage() {
  const { t } = useTranslation();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tablesData, ordersData] = await Promise.all([
        tablesService.getAll().catch(() => [] as Table[]),
        ordersService.getAll().catch(() => [] as Order[]),
      ]);
      setTables(tablesData);
      setOrders(ordersData.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeOrders = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold tracking-tight">{t('waiter.title')}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t('dashboard.activeOrders')}</p>
              <p className="text-xl font-bold">{loading ? '—' : activeOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t('orders.status.ready')}</p>
              <p className="text-xl font-bold">{loading ? '—' : readyOrders.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <UtensilsCrossed className="h-4 w-4" />
            {t('waiter.myTables')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : tables.length === 0 ? (
            <p className="text-muted-foreground">{t('status.noData')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {tables.map((table) => {
                const tableOrder = orders.find((o) => o.tableId === table.id);
                return (
                  <div
                    key={table.id}
                    className={`rounded-lg border p-3 ${table.status === 'OCCUPIED' ? 'border-orange-500/50 bg-orange-500/5' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{table.name}</span>
                      <Badge variant={tableStatusBadge[table.status] ?? 'outline'}>
                        {t(`tables.status.${tableStatusKey[table.status] ?? table.status.toLowerCase() as Lowercase<TableStatus>}`)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('tables.capacity')}: {table.capacity}
                    </p>
                    {tableOrder && (
                      <p className="mt-1 text-xs font-medium">
                        #{tableOrder.orderNumber} — ${tableOrder.total.toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {readyOrders.length > 0 && (
        <Card className="border-green-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-500">{t('orders.status.ready')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {readyOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-green-500/10 p-3">
                <div>
                  <span className="font-bold">#{order.orderNumber}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{order.tableName}</span>
                </div>
                <Badge variant="success">{t('orders.status.ready')}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
