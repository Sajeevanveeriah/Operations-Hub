import { Badge } from '../ui/Badge'
import type { TicketStatus, WorkOrderStatus, RFQStatus, POStatus, AssetStatus, QuoteStatus } from '@/types'

type Status = TicketStatus | WorkOrderStatus | RFQStatus | POStatus | AssetStatus | QuoteStatus

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; label: string }> = {
    // Ticket/Work Order statuses
    open: { variant: 'default', label: 'Open' },
    draft: { variant: 'secondary', label: 'Draft' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    on_hold: { variant: 'outline', label: 'On Hold' },
    resolved: { variant: 'success', label: 'Resolved' },
    closed: { variant: 'secondary', label: 'Closed' },
    scheduled: { variant: 'default', label: 'Scheduled' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },

    // Asset statuses
    operational: { variant: 'success', label: 'Operational' },
    maintenance: { variant: 'warning', label: 'Maintenance' },
    offline: { variant: 'destructive', label: 'Offline' },
    decommissioned: { variant: 'secondary', label: 'Decommissioned' },

    // RFQ/Quote/PO statuses
    sent: { variant: 'default', label: 'Sent' },
    quoted: { variant: 'warning', label: 'Quoted' },
    awarded: { variant: 'success', label: 'Awarded' },
    pending: { variant: 'warning', label: 'Pending' },
    pending_approval: { variant: 'warning', label: 'Pending Approval' },
    submitted: { variant: 'default', label: 'Submitted' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'destructive', label: 'Rejected' },
    accepted: { variant: 'success', label: 'Accepted' },
    received: { variant: 'success', label: 'Received' },
  }

  const config = statusConfig[status] || { variant: 'default' as const, label: status }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
