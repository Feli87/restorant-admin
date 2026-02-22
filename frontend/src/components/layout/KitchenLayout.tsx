import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function KitchenLayout() {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      {/* Header - minimal, high contrast */}
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
        <h1 className="text-2xl font-bold">{t('kitchen.title')}</h1>
        <div className="flex items-center gap-2 text-xl font-mono">
          <Clock className="h-6 w-6" />
          <span>
            {time.toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      </header>

      {/* Main content - fullscreen grid for orders */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
