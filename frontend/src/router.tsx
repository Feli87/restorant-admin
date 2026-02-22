import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { CashierDashboardPage } from './pages/cashier/DashboardPage';
import { WaiterDashboardPage } from './pages/waiter/DashboardPage';
import { ChefDashboardPage } from './pages/chef/DashboardPage';
import { TableMenuPage } from './pages/table/MenuPage';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { TabletLayout } from './components/layout/TabletLayout';
import { KitchenLayout } from './components/layout/KitchenLayout';
import { MobileLayout } from './components/layout/MobileLayout';
import { RoleGuard } from './guards/RoleGuard';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={['ADMIN']}>
            <DesktopLayout />
          </RoleGuard>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>

      {/* Cashier routes */}
      <Route
        path="/cashier"
        element={
          <RoleGuard allowedRoles={['CASHIER']}>
            <DesktopLayout />
          </RoleGuard>
        }
      >
        <Route index element={<CashierDashboardPage />} />
      </Route>

      {/* Waiter routes */}
      <Route
        path="/waiter"
        element={
          <RoleGuard allowedRoles={['WAITER']}>
            <TabletLayout />
          </RoleGuard>
        }
      >
        <Route index element={<WaiterDashboardPage />} />
      </Route>

      {/* Chef routes */}
      <Route
        path="/chef"
        element={
          <RoleGuard allowedRoles={['CHEF']}>
            <KitchenLayout />
          </RoleGuard>
        }
      >
        <Route index element={<ChefDashboardPage />} />
      </Route>

      {/* Table (customer) routes */}
      <Route
        path="/table/:tableId"
        element={
          <RoleGuard allowedRoles={['TABLE_USER']}>
            <MobileLayout />
          </RoleGuard>
        }
      >
        <Route index element={<TableMenuPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
