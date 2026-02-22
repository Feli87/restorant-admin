import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, DollarSign, Users, UtensilsCrossed, RefreshCw, Clock } from 'lucide-react';
import { ordersService } from '@/services/ordersService';
import { tablesService } from '@/services/tablesService';
import { usersService } from '@/services/usersService';
import type { Order, OrderStatus } from '@/types/order';
import type { Table } from '@/types/table';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PREPARING: 'default',
  READY: 'success',
  SERVED: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersData, tablesData, usersData] = await Promise.all([
        ordersService.getAll().catch(() => [] as Order[]),
        tablesService.getAll().catch(() => [] as Table[]),
        usersService.getAll().catch(() => []),
      ]);
      setOrders(ordersData);
      setTables(tablesData);
      setStaffCount(usersData.filter((u) => u.isActive).length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeOrders = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));
  const todayRevenue = orders
    .filter((o) => {
      const today = new Date().toISOString().split('T')[0] ?? '';
      return o.createdAt.startsWith(today) && o.status !== 'CANCELLED';
    })
    .reduce((sum, o) => sum + o.total, 0);
  const occupiedTables = tables.filter((tbl) => tbl.status === 'OCCUPIED').length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const stats = [
    { label: t('dashboard.activeOrders'), value: activeOrders.length, icon: ShoppingCart, color: 'text-blue-500' },
    { label: t('dashboard.todayRevenue'), value: `$${todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { label: t('dashboard.occupiedTables'), value: `${occupiedTables}/${tables.length}`, icon: UtensilsCrossed, color: 'text-orange-500' },
    { label: t('dashboard.activeStaff'), value: staffCount, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.dashboard')}</h2>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('actions.refresh')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) =>
          loading ? (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ) : (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('orders.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-muted-foreground">{t('status.noData')}</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold">#{order.orderNumber}</span>
                    <span className="text-sm text-muted-foreground">{order.tableName}</span>
                    <span className="text-sm text-muted-foreground">{order.waiterName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                    <Badge variant={statusBadgeVariant[order.status] ?? 'outline'}>
                      {t(`orders.status.${order.status.toLowerCase() as Lowercase<OrderStatus>}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
