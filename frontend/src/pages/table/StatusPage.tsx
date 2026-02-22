import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TableStatusPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{t('nav.status')}</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('nav.status')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('status.noData')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
