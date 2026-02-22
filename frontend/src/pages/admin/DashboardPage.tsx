import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, Users, UtensilsCrossed } from 'lucide-react';

export function AdminDashboardPage() {
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.activeOrders'), value: '—', icon: ShoppingCart },
    { label: t('dashboard.todayRevenue'), value: '—', icon: DollarSign },
    { label: t('dashboard.occupiedTables'), value: '—', icon: UtensilsCrossed },
    { label: t('dashboard.activeStaff'), value: '—', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('nav.dashboard')}</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
