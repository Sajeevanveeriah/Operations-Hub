import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, QrCode, Wrench } from 'lucide-react'

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const assets = useStore((state) => state.assets)
  const workOrders = useStore((state) => state.workOrders)
  const pmPlans = useStore((state) => state.pmPlans)
  const sites = useStore((state) => state.sites)
  const locations = useStore((state) => state.locations)

  const asset = assets.find((a) => a.id === id)

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Asset not found</p>
        <Button onClick={() => navigate('/assets')} className="mt-4">
          Back to Assets
        </Button>
      </div>
    )
  }

  const site = sites.find((s) => s.id === asset.siteId)
  const location = locations.find((l) => l.id === asset.locationId)
  const assetWorkOrders = workOrders.filter((w) => w.assetId === asset.id)
  const assetPMPlans = pmPlans.filter((p) => p.assetId === asset.id)

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/assets')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Assets
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{asset.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    {asset.assetTag}
                  </p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <p className="text-sm">{asset.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site</label>
                  <p className="text-sm">{site?.name}</p>
                </div>
                {location && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <p className="text-sm">{location.name}</p>
                  </div>
                )}
                {asset.manufacturer && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Manufacturer</label>
                    <p className="text-sm">{asset.manufacturer}</p>
                  </div>
                )}
                {asset.model && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Model</label>
                    <p className="text-sm">{asset.model}</p>
                  </div>
                )}
                {asset.serialNumber && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Serial Number</label>
                    <p className="text-sm font-mono">{asset.serialNumber}</p>
                  </div>
                )}
                {asset.purchaseDate && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date</label>
                    <p className="text-sm">{formatDate(asset.purchaseDate)}</p>
                  </div>
                )}
                {asset.warrantyExpiry && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Warranty Expiry</label>
                    <p className="text-sm">{formatDate(asset.warrantyExpiry)}</p>
                  </div>
                )}
              </div>

              {asset.notes && (
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <p className="text-sm whitespace-pre-wrap">{asset.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Orders ({assetWorkOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assetWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    onClick={() => navigate(`/work-orders/${wo.id}`)}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{wo.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{wo.type}</p>
                    </div>
                    <StatusBadge status={wo.status} />
                  </div>
                ))}
                {assetWorkOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground">No work orders</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PM Plans */}
          <Card>
            <CardHeader>
              <CardTitle>PM Plans ({assetPMPlans.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assetPMPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{plan.frequency}</p>
                    </div>
                    {plan.nextDue && (
                      <p className="text-sm">Next: {formatDate(plan.nextDue)}</p>
                    )}
                  </div>
                ))}
                {assetPMPlans.length === 0 && (
                  <p className="text-sm text-muted-foreground">No PM plans</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                <QrCode className="h-24 w-24 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2 font-mono">{asset.qrCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
