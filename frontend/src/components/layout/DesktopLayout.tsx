import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/admin/users', icon: Users, labelKey: 'nav.users' },
  { to: '/admin/menu', icon: UtensilsCrossed, labelKey: 'nav.menu' },
  { to: '/admin/orders', icon: ShoppingCart, labelKey: 'nav.orders' },
  { to: '/admin/inventory', icon: Package, labelKey: 'nav.inventory' },
  { to: '/admin/reports', icon: BarChart3, labelKey: 'nav.reports' },
];

const cashierNav = [
  { to: '/cashier', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/cashier/sales', icon: ShoppingCart, labelKey: 'nav.sales' },
];

export function DesktopLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === 'CASHIER' ? cashierNav : adminNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!collapsed && <span className="font-semibold text-lg">Restaurant</span>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-card px-6">
          <h1 className="text-lg font-semibold">{user?.name}</h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
