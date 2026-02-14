import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function PODetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pos = useStore((state) => state.pos)
  const suppliers = useStore((state) => state.suppliers)
  const sites = useStore((state) => state.sites)
  const users = useStore((state) => state.users)

  const po = pos.find((p) => p.id === id)

  if (!po) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Purchase order not found</p>
        <Button onClick={() => navigate('/po')} className="mt-4">
          Back to Purchase Orders
        </Button>
      </div>
    )
  }

  const supplier = suppliers.find((s) => s.id === po.supplierId)
  const site = sites.find((s) => s.id === po.siteId)
  const requester = users.find((u) => u.id === po.requesterId)
  const approver = users.find((u) => u.id === po.approverId)

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/po')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase Orders
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">PO {po.poNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supplier: {supplier?.name}
                  </p>
                </div>
                <StatusBadge status={po.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Line Items</h3>
                  <div className="space-y-2">
                    {po.lines.map((line) => (
                      <div key={line.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{line.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Quantity: {line.quantity} × {formatCurrency(line.unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">{formatCurrency(line.total)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(po.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(po.tax)}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(po.total)}</span>
                    </div>
                  </div>
                </div>

                {po.notes && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                      {po.notes}
                    </p>
                  </div>
                )}

                {po.approvalNotes && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Approval Notes</label>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                      {po.approvalNotes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Site</label>
                <p className="text-sm">{site?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Requester</label>
                <p className="text-sm">{requester?.name}</p>
              </div>

              {approver && (
                <div>
                  <label className="block text-sm font-medium mb-1">Approver</label>
                  <p className="text-sm">{approver.name}</p>
                </div>
              )}

              {po.deliveryDate && (
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Date</label>
                  <p className="text-sm">{formatDateTime(po.deliveryDate)}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Created</label>
                <p className="text-sm">{formatDateTime(po.createdAt)}</p>
              </div>

              {po.approvedAt && (
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Approved
                  </label>
                  <p className="text-sm">{formatDateTime(po.approvedAt)}</p>
                </div>
              )}

              {po.sentAt && (
                <div>
                  <label className="block text-sm font-medium mb-1">Sent to Supplier</label>
                  <p className="text-sm">{formatDateTime(po.sentAt)}</p>
                </div>
              )}

              {po.receivedAt && (
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Received
                  </label>
                  <p className="text-sm">{formatDateTime(po.receivedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-sm">{supplier?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-sm">{supplier?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <p className="text-sm">{supplier?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <p className="text-sm">{supplier?.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
