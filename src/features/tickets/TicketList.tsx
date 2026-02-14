import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatRelative, calculateSLAStatus } from '@/lib/utils'
import { Plus, Search, AlertCircle } from 'lucide-react'
import { CreateTicketModal } from './CreateTicketModal'
import type { Ticket } from '@/types'

export default function TicketList() {
  const navigate = useNavigate()
  const tickets = useStore((state) => state.tickets)
  const sites = useStore((state) => state.sites)
  const users = useStore((state) => state.users)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [siteFilter, setSiteFilter] = useState('all')

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchTerm === '' ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesSite = siteFilter === 'all' || ticket.siteId === siteFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesSite
  })

  const getSiteName = (siteId: string) => sites.find((s) => s.id === siteId)?.name || 'Unknown'
  const getUserName = (userId: string) => users.find((u) => u.id === userId)?.name || 'Unassigned'

  const columns = [
    {
      header: 'ID',
      accessor: (ticket: Ticket) => (
        <span className="font-mono text-xs">{ticket.id.substring(0, 8)}</span>
      ),
      className: 'w-24',
    },
    {
      header: 'Title',
      accessor: (ticket: Ticket) => (
        <div className="min-w-[200px]">
          <p className="font-medium">{ticket.title}</p>
          <p className="text-xs text-muted-foreground truncate">{ticket.description}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (ticket: Ticket) => <StatusBadge status={ticket.status} />,
      className: 'w-32',
    },
    {
      header: 'Priority',
      accessor: (ticket: Ticket) => (
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          {calculateSLAStatus(ticket.slaDeadline, ticket.status) === 'overdue' && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      ),
      className: 'w-32',
    },
    {
      header: 'Site',
      accessor: (ticket: Ticket) => <span className="text-sm">{getSiteName(ticket.siteId)}</span>,
      className: 'w-48',
    },
    {
      header: 'Assignee',
      accessor: (ticket: Ticket) => (
        <span className="text-sm">{ticket.assigneeId ? getUserName(ticket.assigneeId) : 'Unassigned'}</span>
      ),
      className: 'w-40',
    },
    {
      header: 'Created',
      accessor: (ticket: Ticket) => (
        <span className="text-xs text-muted-foreground">{formatRelative(ticket.createdAt)}</span>
      ),
      className: 'w-32',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Service Desk"
        description="Manage service requests and incidents"
        action={{
          label: 'New Ticket',
          onClick: () => setShowCreateModal(true),
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
        <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
          <option value="all">All Sites</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Ticket List */}
      <DataTable
        data={filteredTickets}
        columns={columns}
        onRowClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
      />

      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
