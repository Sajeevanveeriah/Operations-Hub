import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Select } from '@/components/ui/Select'
import { formatRelative, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { RFQ } from '@/types'

export default function RFQList() {
  const navigate = useNavigate()
  const rfqs = useStore((state) => state.rfqs)
  const sites = useStore((state) => state.sites)

  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRFQs = rfqs.filter((rfq) => {
    return statusFilter === 'all' || rfq.status === statusFilter
  })

  const getSiteName = (siteId: string) => sites.find((s) => s.id === siteId)?.name || 'Unknown'

  const columns = [
    {
      header: 'ID',
      accessor: (rfq: RFQ) => (
        <span className="font-mono text-xs">{rfq.id.substring(0, 8)}</span>
      ),
      className: 'w-24',
    },
    {
      header: 'Title',
      accessor: (rfq: RFQ) => (
        <div className="min-w-[200px]">
          <p className="font-medium">{rfq.title}</p>
          <p className="text-xs text-muted-foreground truncate">{rfq.description}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (rfq: RFQ) => <StatusBadge status={rfq.status} />,
      className: 'w-32',
    },
    {
      header: 'Site',
      accessor: (rfq: RFQ) => <span className="text-sm">{getSiteName(rfq.siteId)}</span>,
      className: 'w-48',
    },
    {
      header: 'Suppliers',
      accessor: (rfq: RFQ) => <span className="text-sm">{rfq.supplierIds.length}</span>,
      className: 'w-24',
    },
    {
      header: 'Due Date',
      accessor: (rfq: RFQ) => (
        <span className="text-sm">{rfq.dueDate ? formatDate(rfq.dueDate) : 'N/A'}</span>
      ),
      className: 'w-32',
    },
    {
      header: 'Created',
      accessor: (rfq: RFQ) => (
        <span className="text-xs text-muted-foreground">{formatRelative(rfq.createdAt)}</span>
      ),
      className: 'w-32',
    },
  ]

  return (
    <div>
      <PageHeader
        title="RFQs"
        description="Request for Quotation management"
        action={{
          label: 'New RFQ',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <div className="mb-6">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="quoted">Quoted</option>
          <option value="awarded">Awarded</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      <DataTable
        data={filteredRFQs}
        columns={columns}
        onRowClick={(rfq) => navigate(`/rfq/${rfq.id}`)}
      />
    </div>
  )
}
