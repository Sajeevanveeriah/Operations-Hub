import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { X } from 'lucide-react'
import type { TicketCategory, TicketPriority } from '@/types'

interface CreateTicketModalProps {
  onClose: () => void
}

export function CreateTicketModal({ onClose }: CreateTicketModalProps) {
  const addTicket = useStore((state) => state.addTicket)
  const addActivity = useStore((state) => state.addActivity)
  const currentUserId = useStore((state) => state.currentUserId)
  const sites = useStore((state) => state.sites)
  const locations = useStore((state) => state.locations)
  const settings = useStore((state) => state.settings)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance' as TicketCategory,
    priority: 'medium' as TicketPriority,
    siteId: sites[0]?.id || '',
    locationId: '',
  })

  const siteLocations = locations.filter((l) => l.siteId === formData.siteId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const slaPolicy = settings.slaPolicies.find((p) => p.priority === formData.priority)
    const slaDeadline = slaPolicy
      ? new Date(Date.now() + slaPolicy.resolutionMinutes * 60 * 1000).toISOString()
      : undefined

    const newTicket = {
      id: uuidv4(),
      ...formData,
      status: 'open' as const,
      requesterId: currentUserId!,
      locationId: formData.locationId || undefined,
      slaDeadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addTicket(newTicket)

    addActivity({
      id: uuidv4(),
      entityType: 'ticket',
      entityId: newTicket.id,
      userId: currentUserId!,
      type: 'created',
      description: 'Ticket created',
      createdAt: new Date().toISOString(),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Ticket</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the issue"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
              >
                <option value="maintenance">Maintenance</option>
                <option value="it">IT</option>
                <option value="facilities">Facilities</option>
                <option value="safety">Safety</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site</label>
              <Select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value, locationId: '' })}
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location (Optional)</label>
              <Select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                <option value="">Select location</option>
                {siteLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
