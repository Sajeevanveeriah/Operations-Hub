import { useStore } from '@/store'
import { formatRelative } from '@/lib/utils'
import { Button } from '../ui/Button'
import { X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const currentUserId = useStore((state) => state.currentUserId)
  const notifications = useStore((state) => state.notifications)
  const markNotificationRead = useStore((state) => state.markNotificationRead)
  const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead)
  const navigate = useNavigate()

  const userNotifications = notifications
    .filter((n) => n.userId === currentUserId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markNotificationRead(notification.id)
    if (notification.entityType && notification.entityId) {
      navigate(`/${notification.entityType}s/${notification.entityId}`)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/80" onClick={onClose} />
      <div className="relative w-96 bg-card shadow-lg border-l">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex items-center gap-2">
            {userNotifications.some((n) => !n.read) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={markAllNotificationsRead}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {userNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {userNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatRelative(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
