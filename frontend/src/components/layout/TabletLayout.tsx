import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Grid3X3, ShoppingCart, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const waiterNav = [
  { to: '/waiter', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/waiter/tables', icon: Grid3X3, labelKey: 'nav.tables' },
  { to: '/waiter/orders', icon: ShoppingCart, labelKey: 'nav.orders' },
  { to: '/waiter/notifications', icon: Bell, labelKey: 'nav.notifications' },
];

export function TabletLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="flex items-center justify-around border-t bg-card px-2 py-1 safe-area-bottom">
        {waiterNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </nav>
    </div>
  );
}
