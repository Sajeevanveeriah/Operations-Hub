import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Plus, Search, QrCode } from 'lucide-react'
import type { Asset } from '@/types'

export default function AssetList() {
  const navigate = useNavigate()
  const assets = useStore((state) => state.assets)
  const sites = useStore((state) => state.sites)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [siteFilter, setSiteFilter] = useState('all')

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchTerm === '' ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
    const matchesSite = siteFilter === 'all' || asset.siteId === siteFilter

    return matchesSearch && matchesStatus && matchesSite
  })

  const getSiteName = (siteId: string) => sites.find((s) => s.id === siteId)?.name || 'Unknown'

  const columns = [
    {
      header: 'Asset Tag',
      accessor: (asset: Asset) => (
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{asset.assetTag}</span>
        </div>
      ),
      className: 'w-40',
    },
    {
      header: 'Name',
      accessor: (asset: Asset) => (
        <div>
          <p className="font-medium">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.category}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (asset: Asset) => <StatusBadge status={asset.status} />,
      className: 'w-32',
    },
    {
      header: 'Manufacturer',
      accessor: (asset: Asset) => (
        <div>
          <p className="text-sm">{asset.manufacturer || 'N/A'}</p>
          <p className="text-xs text-muted-foreground">{asset.model || ''}</p>
        </div>
      ),
      className: 'w-48',
    },
    {
      header: 'Site',
      accessor: (asset: Asset) => <span className="text-sm">{getSiteName(asset.siteId)}</span>,
      className: 'w-48',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Manage equipment and infrastructure"
        action={{
          label: 'Add Asset',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="operational">Operational</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
          <option value="decommissioned">Decommissioned</option>
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

      {/* Asset List */}
      <DataTable
        data={filteredAssets}
        columns={columns}
        onRowClick={(asset) => navigate(`/assets/${asset.id}`)}
      />
    </div>
  )
}
