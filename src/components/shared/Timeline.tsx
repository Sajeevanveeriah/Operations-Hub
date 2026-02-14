import { formatDateTime } from '@/lib/utils'
import type { ActivityEvent } from '@/types'
import { useStore } from '@/store'
import { Activity } from 'lucide-react'

interface TimelineProps {
  activities: ActivityEvent[]
}

export function Timeline({ activities }: TimelineProps) {
  const users = useStore((state) => state.users)

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || 'Unknown User'
  }

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            {index < sortedActivities.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {getUserName(activity.userId)} • {formatDateTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
      {sortedActivities.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity yet</p>
      )}
    </div>
  )
}
