import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Award } from 'lucide-react'

export default function RFQDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const rfqs = useStore((state) => state.rfqs)
  const quotes = useStore((state) => state.quotes)
  const suppliers = useStore((state) => state.suppliers)
  const sites = useStore((state) => state.sites)
  const users = useStore((state) => state.users)

  const rfq = rfqs.find((r) => r.id === id)

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">RFQ not found</p>
        <Button onClick={() => navigate('/rfq')} className="mt-4">
          Back to RFQs
        </Button>
      </div>
    )
  }

  const site = sites.find((s) => s.id === rfq.siteId)
  const requester = users.find((u) => u.id === rfq.requesterId)
  const rfqQuotes = quotes.filter((q) => q.rfqId === rfq.id)

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/rfq')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to RFQs
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{rfq.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    RFQ {rfq.id.substring(0, 8)}
                  </p>
                </div>
                <StatusBadge status={rfq.status} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{rfq.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotes ({rfqQuotes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfqQuotes.map((quote) => {
                  const supplier = suppliers.find((s) => s.id === quote.supplierId)
                  const isAwarded = rfq.awardedQuoteId === quote.id

                  return (
                    <div
                      key={quote.id}
                      className={`p-4 rounded-lg border ${isAwarded ? 'border-green-500 bg-green-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{supplier?.name}</p>
                          <StatusBadge status={quote.status} className="mt-1" />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(quote.total)}</p>
                          {quote.leadTimeDays && (
                            <p className="text-xs text-muted-foreground">
                              Lead time: {quote.leadTimeDays} days
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        {quote.lines.map((line) => (
                          <div key={line.id} className="flex items-center justify-between">
                            <span>
                              {line.description} (x{line.quantity})
                            </span>
                            <span>{formatCurrency(line.total)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(quote.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tax</span>
                          <span>{formatCurrency(quote.tax)}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(quote.total)}</span>
                        </div>
                      </div>

                      {quote.notes && (
                        <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                          {quote.notes}
                        </p>
                      )}

                      {isAwarded && (
                        <div className="mt-3 flex items-center gap-2 text-green-700">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-medium">Awarded Quote</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                {rfqQuotes.length === 0 && (
                  <p className="text-sm text-muted-foreground">No quotes received yet</p>
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

              {rfq.dueDate && (
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <p className="text-sm">{formatDateTime(rfq.dueDate)}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Invited Suppliers</label>
                <div className="space-y-1">
                  {rfq.supplierIds.map((supplierId) => {
                    const supplier = suppliers.find((s) => s.id === supplierId)
                    return (
                      <p key={supplierId} className="text-sm">
                        {supplier?.name || 'Unknown'}
                      </p>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
