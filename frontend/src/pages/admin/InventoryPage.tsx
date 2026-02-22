import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { inventoryService, type InventoryItem } from '@/services/inventoryService';

export function AdminInventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: '', quantity: 0, unit: '', min_stock: 0, unit_cost: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAll();
      setItems(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setForm({ name: item.name, quantity: item.quantity, unit: item.unit, min_stock: item.min_stock, unit_cost: item.unit_cost });
    } else {
      setEditingItem(null);
      setForm({ name: '', quantity: 0, unit: '', min_stock: 0, unit_cost: 0 });
    }
    setDialogOpen(true);
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await inventoryService.update(editingItem.id, form);
      } else {
        await inventoryService.create(form);
      }
      setDialogOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    await inventoryService.delete(id);
    await fetchData();
  };

  const isLowStock = (item: InventoryItem) => item.quantity <= item.min_stock;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('inventory.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('actions.refresh')}
          </Button>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.add')}
          </Button>
        </div>
      </div>

      {items.some(isLowStock) && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="flex items-center gap-2 py-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">
              {t('inventory.lowStock')}: {items.filter(isLowStock).map((i) => i.name).join(', ')}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">{t('status.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('inventory.product')}</TableHead>
                  <TableHead>{t('inventory.quantity')}</TableHead>
                  <TableHead>{t('inventory.unit')}</TableHead>
                  <TableHead>{t('inventory.minStock')}</TableHead>
                  <TableHead>{t('users.status')}</TableHead>
                  <TableHead className="w-24">{t('actions.edit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.min_stock}</TableCell>
                    <TableCell>
                      {isLowStock(item) ? (
                        <Badge variant="warning">{t('inventory.lowStock')}</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('actions.edit') : t('actions.create')} {t('inventory.product').toLowerCase()}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t('actions.edit') : t('actions.create')} {t('inventory.product').toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('inventory.product')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('inventory.quantity')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('inventory.unit')}</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('inventory.minStock')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.min_stock}
                  onChange={(e) => setForm({ ...form, min_stock: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('menu.price')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.unit_cost}
                  onChange={(e) => setForm({ ...form, unit_cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={saveItem} disabled={saving || !form.name || !form.unit}>
              {saving ? t('status.saving') : t('actions.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
