import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CashierSalesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('sales.title')}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t('sales.today')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('status.noData')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
