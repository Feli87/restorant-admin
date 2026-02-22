import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/stores/notificationStore';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

const typeBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  info: 'default',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
};

export function WaiterNotificationsPage() {
  const { t } = useTranslation();
  const { notifications, markRead, markAllRead, removeNotification, clearAll } = useNotificationStore();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('nav.notifications')}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="mr-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="py-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">{t('status.noData')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium">{notif.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={typeBadge[notif.type] ?? 'outline'}>{notif.type}</Badge>
                  {!notif.isRead && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markRead(notif.id)}>
                      <CheckCheck className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeNotification(notif.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
