import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { formatRelative, formatCurrency, calculateSLAStatus } from '@/lib/utils'
import {
  Ticket,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const tickets = useStore((state) => state.tickets)
  const workOrders = useStore((state) => state.workOrders)
  const assets = useStore((state) => state.assets)
  const pmPlans = useStore((state) => state.pmPlans)
  const pos = useStore((state) => state.pos)
  const suppliers = useStore((state) => state.suppliers)

  // KPIs
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length
  const overdueTickets = tickets.filter(
    (t) => calculateSLAStatus(t.slaDeadline, t.status) === 'overdue'
  ).length
  const pendingApprovals = pos.filter((p) => p.status === 'pending_approval').length
  const upcomingPM = pmPlans.filter((p) => {
    if (!p.nextDue) return false
    const daysUntil = (new Date(p.nextDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysUntil <= 7 && daysUntil >= 0
  }).length

  const totalSpend = pos
    .filter((p) => p.status === 'approved' || p.status === 'sent' || p.status === 'received')
    .reduce((sum, po) => sum + po.total, 0)

  const operationalAssets = assets.filter((a) => a.status === 'operational').length
  const maintenanceAssets = assets.filter((a) => a.status === 'maintenance').length

  // Recent activity
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const recentWorkOrders = [...workOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Operations overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Active service requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue SLAs</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground mt-1">Purchase orders awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming PM</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingPM}</div>
            <p className="text-xs text-muted-foreground mt-1">Due within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {operationalAssets} operational, {maintenanceAssets} in maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active supplier relationships</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelative(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
              {recentTickets.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent tickets</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkOrders.map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => navigate(`/work-orders/${wo.id}`)}
                  className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{wo.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {wo.type} • {formatRelative(wo.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={wo.status} />
                </div>
              ))}
              {recentWorkOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent work orders</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
