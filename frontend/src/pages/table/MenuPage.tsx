import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TableMenuPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{t('nav.menu')}</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('common.loading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
