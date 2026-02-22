import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RefreshCw, Eye } from 'lucide-react';
import { ordersService } from '@/services/ordersService';
import type { Order, OrderStatus } from '@/types/order';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PREPARING: 'default',
  READY: 'success',
  SERVED: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

const allStatuses: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'] as OrderStatus[];

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await ordersService.updateStatus(orderId, status);
    await fetchData();
  };

  const filteredOrders = orders
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('orders.title')}</h2>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('actions.refresh')}
        </Button>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('actions.filter')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('actions.filter')}</SelectItem>
          {allStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {t(`orders.status.${s.toLowerCase()}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">{t('status.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('orders.orderNumber')}</TableHead>
                  <TableHead>{t('orders.table')}</TableHead>
                  <TableHead>{t('orders.waiter')}</TableHead>
                  <TableHead>{t('menu.items')}</TableHead>
                  <TableHead>{t('orders.total')}</TableHead>
                  <TableHead>{t('users.status')}</TableHead>
                  <TableHead className="w-32">{t('actions.edit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-bold">#{order.orderNumber}</TableCell>
                    <TableCell>{order.tableName}</TableCell>
                    <TableCell>{order.waiterName}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[order.status] ?? 'outline'}>
                        {t(`orders.status.${order.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allStatuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {t(`orders.status.${s.toLowerCase()}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('orders.orderNumber')}: #{selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.tableName} — {selectedOrder?.waiterName}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <Badge variant={statusBadgeVariant[selectedOrder.status] ?? 'outline'}>
                  {t(`orders.status.${selectedOrder.status.toLowerCase()}`)}
                </Badge>
                <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('menu.items')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('menu.item')}</TableHead>
                        <TableHead>{t('inventory.quantity')}</TableHead>
                        <TableHead>{t('menu.price')}</TableHead>
                        <TableHead>{t('users.status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant[item.status] ?? 'outline'}>
                              {t(`orders.itemStatus.${item.status.toLowerCase()}`)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-4 text-sm">
                <span>{t('orders.subtotal')}: ${selectedOrder.subtotal.toFixed(2)}</span>
                <span>{t('orders.tax')}: ${selectedOrder.tax.toFixed(2)}</span>
                <span>{t('orders.tip')}: ${selectedOrder.tip.toFixed(2)}</span>
                <span className="font-bold">{t('orders.total')}: ${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
