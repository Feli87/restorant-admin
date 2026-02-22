import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ordersService } from '@/services/ordersService';
import { salesService } from '@/services/salesService';
import type { Order, OrderStatus } from '@/types/order';
import { DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';

const paymentMethods = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT'] as const;
const paymentLabels: Record<string, string> = {
  CASH: 'Cash',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  MOBILE_PAYMENT: 'Mobile Payment',
};

export function CashierDashboardPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [payDialog, setPayDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data.filter((o) => ['READY', 'SERVED'].includes(o.status)));
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const openPayDialog = (order: Order) => {
    setSelectedOrder(order);
    setPaymentMethod('CASH');
    setPayDialog(true);
  };

  const processPayment = async () => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      await salesService.create({
        order_id: selectedOrder.id,
        subtotal: selectedOrder.subtotal,
        tax: selectedOrder.tax,
        total: selectedOrder.total,
        tip: selectedOrder.tip,
        payment_method: paymentMethod as 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_PAYMENT' | 'OTHER',
      });
      await ordersService.updateStatus(selectedOrder.id, 'COMPLETED' as OrderStatus);
      setPayDialog(false);
      await fetchData();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('cashier.title')}</h2>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('actions.refresh')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('cashier.readyOrders')}
            <Badge variant="outline">{orders.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">{t('status.noData')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">#{order.orderNumber}</span>
                      <Badge variant="outline">{order.tableName}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {order.items.length} {t('menu.items').toLowerCase()} — {order.waiterName}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t('orders.total')}</p>
                      <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => openPayDialog(order)}>
                      <DollarSign className="mr-1 h-4 w-4" />
                      {t('actions.confirm')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={payDialog} onOpenChange={setPayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>#{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>{selectedOrder?.tableName}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 border-t pt-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('orders.subtotal')}</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('orders.tax')}</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('orders.tip')}</span>
                  <span>${selectedOrder.tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('orders.total')}</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('sales.title')}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {paymentLabels[m]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={processPayment} disabled={processing}>
              {processing ? t('status.loading') : t('actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
