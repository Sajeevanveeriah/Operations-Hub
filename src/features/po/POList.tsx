import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Select } from '@/components/ui/Select'
import { formatRelative, formatCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { PO } from '@/types'

export default function POList() {
  const navigate = useNavigate()
  const pos = useStore((state) => state.pos)
  const suppliers = useStore((state) => state.suppliers)

  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPOs = pos.filter((po) => {
    return statusFilter === 'all' || po.status === statusFilter
  })

  const getSupplierName = (supplierId: string) => {
    return suppliers.find((s) => s.id === supplierId)?.name || 'Unknown'
  }

  const columns = [
    {
      header: 'PO Number',
      accessor: (po: PO) => (
        <span className="font-mono text-sm font-medium">{po.poNumber}</span>
      ),
      className: 'w-32',
    },
    {
      header: 'Supplier',
      accessor: (po: PO) => <span className="font-medium">{getSupplierName(po.supplierId)}</span>,
      className: 'w-48',
    },
    {
      header: 'Status',
      accessor: (po: PO) => <StatusBadge status={po.status} />,
      className: 'w-40',
    },
    {
      header: 'Total',
      accessor: (po: PO) => (
        <span className="font-semibold">{formatCurrency(po.total)}</span>
      ),
      className: 'w-32',
    },
    {
      header: 'Delivery Date',
      accessor: (po: PO) => (
        <span className="text-sm">{po.deliveryDate ? formatDate(po.deliveryDate) : 'N/A'}</span>
      ),
      className: 'w-32',
    },
    {
      header: 'Created',
      accessor: (po: PO) => (
        <span className="text-xs text-muted-foreground">{formatRelative(po.createdAt)}</span>
      ),
      className: 'w-32',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Manage purchase orders"
        action={{
          label: 'New PO',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <div className="mb-6">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      <DataTable
        data={filteredPOs}
        columns={columns}
        onRowClick={(po) => navigate(`/po/${po.id}`)}
      />
    </div>
  )
}
