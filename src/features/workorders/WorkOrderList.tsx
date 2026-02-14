import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatRelative } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'
import type { WorkOrder } from '@/types'

export default function WorkOrderList() {
  const navigate = useNavigate()
  const workOrders = useStore((state) => state.workOrders)
  const assets = useStore((state) => state.assets)
  const users = useStore((state) => state.users)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      searchTerm === '' ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
    const matchesType = typeFilter === 'all' || wo.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getAssetName = (assetId?: string) => {
    if (!assetId) return 'No asset'
    return assets.find((a) => a.id === assetId)?.name || 'Unknown'
  }

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned'
    return users.find((u) => u.id === userId)?.name || 'Unknown'
  }

  const columns = [
    {
      header: 'ID',
      accessor: (wo: WorkOrder) => (
        <span className="font-mono text-xs">{wo.id.substring(0, 8)}</span>
      ),
      className: 'w-24',
    },
    {
      header: 'Title',
      accessor: (wo: WorkOrder) => (
        <div className="min-w-[200px]">
          <p className="font-medium">{wo.title}</p>
          <p className="text-xs text-muted-foreground capitalize">{wo.type}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (wo: WorkOrder) => <StatusBadge status={wo.status} />,
      className: 'w-32',
    },
    {
      header: 'Priority',
      accessor: (wo: WorkOrder) => <PriorityBadge priority={wo.priority} />,
      className: 'w-32',
    },
    {
      header: 'Asset',
      accessor: (wo: WorkOrder) => <span className="text-sm">{getAssetName(wo.assetId)}</span>,
      className: 'w-48',
    },
    {
      header: 'Assignee',
      accessor: (wo: WorkOrder) => <span className="text-sm">{getUserName(wo.assigneeId)}</span>,
      className: 'w-40',
    },
    {
      header: 'Created',
      accessor: (wo: WorkOrder) => (
        <span className="text-xs text-muted-foreground">{formatRelative(wo.createdAt)}</span>
      ),
      className: 'w-32',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Work Orders"
        description="Manage maintenance work orders"
        action={{
          label: 'New Work Order',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="corrective">Corrective</option>
          <option value="preventive">Preventive</option>
          <option value="inspection">Inspection</option>
          <option value="project">Project</option>
        </Select>
      </div>

      {/* Work Order List */}
      <DataTable
        data={filteredWorkOrders}
        columns={columns}
        onRowClick={(wo) => navigate(`/work-orders/${wo.id}`)}
      />
    </div>
  )
}
