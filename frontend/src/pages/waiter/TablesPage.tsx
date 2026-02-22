import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { tablesService } from '@/services/tablesService';
import type { Table, TableStatus } from '@/types/table';
import { RefreshCw, Users } from 'lucide-react';

const tableStatusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'warning',
  RESERVED: 'default',
  OUT_OF_SERVICE: 'destructive',
};

const tableStatusKey: Record<string, string> = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  OUT_OF_SERVICE: 'outOfService',
};

export function WaiterTablesPage() {
  const { t } = useTranslation();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tablesService.getAll();
      setTables(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTableStatus = async (id: string, status: TableStatus) => {
    await tablesService.update(id, { status });
    await fetchData();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('tables.title')}</h2>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">{t('status.noData')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`rounded-xl border-2 p-4 ${
                table.status === 'AVAILABLE'
                  ? 'border-green-500/30 bg-green-500/5'
                  : table.status === 'OCCUPIED'
                    ? 'border-orange-500/30 bg-orange-500/5'
                    : table.status === 'RESERVED'
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-gray-500/30 bg-gray-500/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{table.name}</span>
                <Badge variant={tableStatusBadge[table.status] ?? 'outline'}>
                  {t(`tables.status.${tableStatusKey[table.status] ?? table.status.toLowerCase() as Lowercase<TableStatus>}`)}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                {table.capacity}
              </div>
              <div className="mt-3 flex gap-2">
                {table.status === 'AVAILABLE' && (
                  <Button size="sm" className="w-full" onClick={() => updateTableStatus(table.id, 'OCCUPIED' as TableStatus)}>
                    {t('tables.status.occupied')}
                  </Button>
                )}
                {table.status === 'OCCUPIED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => updateTableStatus(table.id, 'AVAILABLE' as TableStatus)}
                  >
                    {t('tables.status.available')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
