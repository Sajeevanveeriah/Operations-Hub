import { Bell, User } from 'lucide-react'
import { useStore } from '@/store'
import { Badge } from '../ui/Badge'
import { useState } from 'react'
import { NotificationPanel } from '../shared/NotificationPanel'

export function Header() {
  const currentUserId = useStore((state) => state.currentUserId)
  const users = useStore((state) => state.users)
  const notifications = useStore((state) => state.notifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const currentUser = users.find((u) => u.id === currentUserId)
  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUserId).length

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-xs">
          Demo Mode
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative rounded-full p-2 hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{currentUser?.name || 'Guest'}</span>
          <Badge variant="secondary" className="text-xs">
            {currentUser?.role || 'guest'}
          </Badge>
        </div>
      </div>
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </header>
  )
}
