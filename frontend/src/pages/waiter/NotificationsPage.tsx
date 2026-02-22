import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WaiterNotificationsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t('nav.notifications')}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t('nav.notifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('status.noData')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
