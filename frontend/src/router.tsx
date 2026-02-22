import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { AdminUsersPage } from './pages/admin/UsersPage';
import { AdminMenuPage } from './pages/admin/MenuPage';
import { AdminOrdersPage } from './pages/admin/OrdersPage';
import { AdminInventoryPage } from './pages/admin/InventoryPage';
import { AdminReportsPage } from './pages/admin/ReportsPage';
import { CashierDashboardPage } from './pages/cashier/DashboardPage';
import { CashierSalesPage } from './pages/cashier/SalesPage';
import { WaiterDashboardPage } from './pages/waiter/DashboardPage';
import { WaiterTablesPage } from './pages/waiter/TablesPage';
import { WaiterOrdersPage } from './pages/waiter/OrdersPage';
import { WaiterNotificationsPage } from './pages/waiter/NotificationsPage';
import { ChefDashboardPage } from './pages/chef/DashboardPage';
import { TableMenuPage } from './pages/table/MenuPage';
import { TableOrderPage } from './pages/table/OrderPage';
import { TableStatusPage } from './pages/table/StatusPage';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { TabletLayout } from './components/layout/TabletLayout';
import { KitchenLayout } from './components/layout/KitchenLayout';
import { MobileLayout } from './components/layout/MobileLayout';
import { RoleGuard } from './guards/RoleGuard';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
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
        <Route path="sales" element={<CashierSalesPage />} />
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
        <Route path="tables" element={<WaiterTablesPage />} />
        <Route path="orders" element={<WaiterOrdersPage />} />
        <Route path="notifications" element={<WaiterNotificationsPage />} />
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
        <Route path="order" element={<TableOrderPage />} />
        <Route path="status" element={<TableStatusPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
