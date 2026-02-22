import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { menuService } from '@/services/menuService';
import type { Category, MenuItem } from '@/types/menu';

import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export function TableMenuPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([menuService.getCategories(), menuService.getItems()]);
      setCategories(cats.filter((c) => c.isActive));
      setItems(menuItems.filter((i) => i.isAvailable));
      if (cats.length > 0 && !selectedCategory && cats[0]) {
        setSelectedCategory(cats[0].id);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) => (c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c));
      }
      return prev.filter((c) => c.menuItemId !== menuItemId);
    });
  };

  const getCartQuantity = (menuItemId: string) => {
    return cart.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0;
  };

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const filteredItems = selectedCategory ? items.filter((i) => i.categoryId === selectedCategory) : items;

  return (
    <div className="flex flex-col pb-20">
      {/* Category tabs */}
      {!loading && categories.length > 0 && (
        <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-background px-4 py-3">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="shrink-0"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      )}

      {/* Menu items */}
      <div className="space-y-3 px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : filteredItems.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('status.noData')}</p>
        ) : (
          filteredItems.map((item) => {
            const qty = getCartQuantity(item.id);
            return (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                    <p className="mt-1 text-sm font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center font-bold">{qty}</span>
                      </>
                    )}
                    <Button size="icon" className="h-8 w-8" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Cart summary bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 left-0 right-0 border-t bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <Badge>{totalItems}</Badge>
            </div>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
