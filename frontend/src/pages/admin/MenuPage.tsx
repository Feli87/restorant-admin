import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { menuService } from '@/services/menuService';
import type { Category, MenuItem } from '@/types/menu';

export function AdminMenuPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', isActive: true, sortOrder: 0 });
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isAvailable: true,
    preparationTime: 15,
    sortOrder: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([menuService.getCategories(), menuService.getItems()]);
      setCategories(cats);
      setItems(menuItems);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description ?? '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', isActive: true, sortOrder: categories.length });
    }
    setCategoryDialog(true);
  };

  const openItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description ?? '',
        price: item.price,
        categoryId: item.categoryId,
        isAvailable: item.isAvailable,
        preparationTime: item.preparationTime ?? 15,
        sortOrder: item.sortOrder,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        description: '',
        price: 0,
        categoryId: categories[0]?.id ?? '',
        isAvailable: true,
        preparationTime: 15,
        sortOrder: items.length,
      });
    }
    setItemDialog(true);
  };

  const saveCategory = async () => {
    setSaving(true);
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, categoryForm);
      } else {
        await menuService.createCategory(categoryForm);
      }
      setCategoryDialog(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    await menuService.deleteCategory(id);
    await fetchData();
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await menuService.updateItem(editingItem.id, itemForm);
      } else {
        await menuService.createItem(itemForm);
      }
      setItemDialog(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    await menuService.deleteItem(id);
    await fetchData();
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    await menuService.updateItem(item.id, { isAvailable: !item.isAvailable });
    await fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('menu.title')}</h2>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('actions.refresh')}
        </Button>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">{t('menu.categories')}</TabsTrigger>
          <TabsTrigger value="items">{t('menu.items')}</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCategoryDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              {t('menu.addCategory')}
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">{t('status.noData')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Card key={cat.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base">{cat.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openCategoryDialog(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{cat.description || '—'}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={cat.isActive ? 'success' : 'secondary'}>
                        {cat.isActive ? t('menu.available') : t('menu.unavailable')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {items.filter((i) => i.categoryId === cat.id).length} {t('menu.items').toLowerCase()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openItemDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              {t('menu.addItem')}
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">{t('status.noData')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const category = categories.find((c) => c.id === item.categoryId);
                return (
                  <Card key={item.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        {category && <p className="text-xs text-muted-foreground">{category.name}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openItemDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description || '—'}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <Switch checked={item.isAvailable} onCheckedChange={() => toggleItemAvailability(item)} />
                          <span className="text-xs">
                            {item.isAvailable ? t('menu.available') : t('menu.unavailable')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t('actions.edit') : t('actions.create')} {t('menu.category')}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? t('actions.edit') : t('actions.create')} {t('menu.category').toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('users.name')}</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('menu.description')}</Label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={categoryForm.isActive}
                onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, isActive: checked })}
              />
              <Label>{t('menu.available')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={saveCategory} disabled={saving || !categoryForm.name}>
              {saving ? t('status.saving') : t('actions.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('actions.edit') : t('actions.create')} {t('menu.item')}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t('actions.edit') : t('actions.create')} {t('menu.item').toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('users.name')}</Label>
              <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('menu.description')}</Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('menu.price')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('menu.category')}</Label>
                <Select value={itemForm.categoryId} onValueChange={(v) => setItemForm({ ...itemForm, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={itemForm.isAvailable}
                onCheckedChange={(checked) => setItemForm({ ...itemForm, isAvailable: checked })}
              />
              <Label>{t('menu.available')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={saveItem} disabled={saving || !itemForm.name || !itemForm.categoryId}>
              {saving ? t('status.saving') : t('actions.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
