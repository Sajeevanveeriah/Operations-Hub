import { Badge } from '../ui/Badge'
import type { TicketPriority } from '@/types'

interface PriorityBadgeProps {
  priority: TicketPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = {
    low: { variant: 'secondary' as const, label: 'Low' },
    medium: { variant: 'default' as const, label: 'Medium' },
    high: { variant: 'warning' as const, label: 'High' },
    critical: { variant: 'destructive' as const, label: 'Critical' },
  }

  const { variant, label } = config[priority]

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
