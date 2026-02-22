import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WaiterTablesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t('tables.title')}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t('waiter.myTables')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('status.noData')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
