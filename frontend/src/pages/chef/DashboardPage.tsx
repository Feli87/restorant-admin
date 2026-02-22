import { useTranslation } from 'react-i18next';

export function ChefDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
          <p className="text-2xl font-bold text-gray-400">{t('kitchen.noOrders')}</p>
        </div>
      </div>
    </div>
  );
}
