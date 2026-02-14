import { useState } from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { resetDemoData, exportData, importData } from '@/lib/storage'
import { Download, Upload, RefreshCw, Users, Building2, Settings } from 'lucide-react'

export default function AdminPanel() {
  const users = useStore((state) => state.users)
  const sites = useStore((state) => state.sites)
  const currentUserId = useStore((state) => state.currentUserId)
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  const reloadData = useStore((state) => state.reloadData)
  const settings = useStore((state) => state.settings)

  const [message, setMessage] = useState('')

  const currentUser = users.find((u) => u.id === currentUserId)

  const handleResetDemo = () => {
    if (confirm('Are you sure you want to reset all demo data? This cannot be undone.')) {
      resetDemoData()
      reloadData()
      setMessage('Demo data has been reset successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `operations-hub-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Data exported successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string
          importData(data)
          reloadData()
          setMessage('Data imported successfully!')
          setTimeout(() => setMessage(''), 3000)
        } catch (error) {
          setMessage('Error importing data. Please check the file format.')
          setTimeout(() => setMessage(''), 3000)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleSwitchUser = (userId: string) => {
    setCurrentUser(userId)
    setMessage(`Switched to ${users.find((u) => u.id === userId)?.name}`)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        description="Manage system settings and demo data"
      />

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Switch between demo users to test different roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current User</label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="flex-1">
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {currentUser?.role}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Switch to User</label>
              <Select
                value={currentUserId}
                onChange={(e) => handleSwitchUser(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </Select>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">All Users</p>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-sm">
                    <span>{user.name}</span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sites & Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Sites & Locations
            </CardTitle>
            <CardDescription>Manage operational sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sites.map((site) => (
                <div key={site.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{site.name}</p>
                      <p className="text-xs text-muted-foreground">{site.city}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {site.industry}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{site.address}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Import, export, and reset demo data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleExport} variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Data to JSON
            </Button>

            <Button onClick={handleImport} variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import Data from JSON
            </Button>

            <div className="pt-3 border-t">
              <Button
                onClick={handleResetDemo}
                variant="destructive"
                className="w-full justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Demo Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will restore all data to the original demo state. This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SLA Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SLA Policies</CardTitle>
            <CardDescription>Service level agreement configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settings.slaPolicies.map((policy) => (
                <div key={policy.priority} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{policy.priority} Priority</p>
                    <p className="text-xs text-muted-foreground">
                      Response: {policy.responseMinutes}min • Resolution: {policy.resolutionMinutes}min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
