import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileLayout() {
  const { t } = useTranslation();
  const { tableId } = useParams();

  const navItems = [
    { to: `/table/${tableId}`, icon: UtensilsCrossed, labelKey: 'nav.menu' },
    { to: `/table/${tableId}/order`, icon: ShoppingCart, labelKey: 'nav.order' },
    { to: `/table/${tableId}/status`, icon: Bell, labelKey: 'nav.status' },
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b bg-card px-4 py-3">
        <h1 className="text-lg font-semibold">
          {t('table.title', { number: tableId })}
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom tabs */}
      <nav className="flex items-center justify-around border-t bg-card px-2 py-1 safe-area-bottom">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-md px-4 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
