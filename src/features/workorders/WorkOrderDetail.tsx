import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const workOrders = useStore((state) => state.workOrders)
  const assets = useStore((state) => state.assets)
  const users = useStore((state) => state.users)
  const sites = useStore((state) => state.sites)

  const workOrder = workOrders.find((w) => w.id === id)

  if (!workOrder) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Work order not found</p>
        <Button onClick={() => navigate('/work-orders')} className="mt-4">
          Back to Work Orders
        </Button>
      </div>
    )
  }

  const asset = assets.find((a) => a.id === workOrder.assetId)
  const assignee = users.find((u) => u.id === workOrder.assigneeId)
  const site = sites.find((s) => s.id === workOrder.siteId)

  const totalPartsCost = workOrder.partsUsed.reduce((sum, part) => {
    return sum + (part.unitCost || 0) * part.quantity
  }, 0)

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/work-orders')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Work Orders
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{workOrder.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {workOrder.type} Work Order
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={workOrder.status} />
                  <PriorityBadge priority={workOrder.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{workOrder.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workOrder.checklist.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.description}
                      </p>
                      {item.completed && item.completedBy && (
                        <p className="text-xs text-muted-foreground">
                          {users.find((u) => u.id === item.completedBy)?.name} • {item.completedAt && formatDateTime(item.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {workOrder.partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Parts Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workOrder.partsUsed.map((part) => (
                    <div key={part.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {part.quantity}</p>
                      </div>
                      {part.unitCost && (
                        <p className="text-sm">{formatCurrency(part.unitCost * part.quantity)}</p>
                      )}
                    </div>
                  ))}
                  {totalPartsCost > 0 && (
                    <div className="pt-2 border-t flex items-center justify-between font-medium">
                      <p className="text-sm">Total Parts Cost</p>
                      <p className="text-sm">{formatCurrency(totalPartsCost)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {workOrder.completionNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Completion Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{workOrder.completionNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {asset && (
                <div>
                  <label className="block text-sm font-medium mb-1">Asset</label>
                  <p className="text-sm">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.assetTag}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Site</label>
                <p className="text-sm">{site?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <p className="text-sm">{assignee?.name || 'Unassigned'}</p>
              </div>

              {workOrder.scheduledDate && (
                <div>
                  <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                  <p className="text-sm">{formatDateTime(workOrder.scheduledDate)}</p>
                </div>
              )}

              {workOrder.dueDate && (
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <p className="text-sm">{formatDateTime(workOrder.dueDate)}</p>
                </div>
              )}

              {workOrder.laborHours && (
                <div>
                  <label className="block text-sm font-medium mb-1">Labor Hours</label>
                  <p className="text-sm">{workOrder.laborHours}h</p>
                </div>
              )}

              {workOrder.completedAt && (
                <div>
                  <label className="block text-sm font-medium mb-1">Completed</label>
                  <p className="text-sm">{formatDateTime(workOrder.completedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
