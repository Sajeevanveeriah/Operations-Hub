import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { Timeline } from '@/components/shared/Timeline'
import { formatDateTime, formatRelative, calculateSLAStatus } from '@/lib/utils'
import { ArrowLeft, Send, AlertCircle, Clock } from 'lucide-react'
import type { TicketStatus } from '@/types'

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tickets = useStore((state) => state.tickets)
  const updateTicket = useStore((state) => state.updateTicket)
  const addComment = useStore((state) => state.addComment)
  const addActivity = useStore((state) => state.addActivity)
  const comments = useStore((state) => state.comments)
  const activities = useStore((state) => state.activities)
  const users = useStore((state) => state.users)
  const sites = useStore((state) => state.sites)
  const locations = useStore((state) => state.locations)
  const currentUserId = useStore((state) => state.currentUserId)

  const [commentText, setCommentText] = useState('')

  const ticket = tickets.find((t) => t.id === id)

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ticket not found</p>
        <Button onClick={() => navigate('/tickets')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    )
  }

  const site = sites.find((s) => s.id === ticket.siteId)
  const location = locations.find((l) => l.id === ticket.locationId)
  const requester = users.find((u) => u.id === ticket.requesterId)
  const technicians = users.filter((u) => u.role === 'technician' || u.role === 'manager')

  const ticketComments = comments.filter((c) => c.entityId === ticket.id && c.entityType === 'ticket')
  const ticketActivities = activities.filter((a) => a.entityId === ticket.id && a.entityType === 'ticket')

  const slaStatus = calculateSLAStatus(ticket.slaDeadline, ticket.status)

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket(ticket.id, { status: newStatus })
    addActivity({
      id: uuidv4(),
      entityType: 'ticket',
      entityId: ticket.id,
      userId: currentUserId!,
      type: 'status_changed',
      description: `Status changed to ${newStatus}`,
      createdAt: new Date().toISOString(),
    })
  }

  const handleAssigneeChange = (assigneeId: string) => {
    updateTicket(ticket.id, { assigneeId: assigneeId || undefined })
    addActivity({
      id: uuidv4(),
      entityType: 'ticket',
      entityId: ticket.id,
      userId: currentUserId!,
      type: 'assigned',
      description: assigneeId
        ? `Assigned to ${users.find((u) => u.id === assigneeId)?.name}`
        : 'Unassigned',
      createdAt: new Date().toISOString(),
    })
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    addComment({
      id: uuidv4(),
      entityType: 'ticket',
      entityId: ticket.id,
      userId: currentUserId!,
      content: commentText,
      createdAt: new Date().toISOString(),
    })

    addActivity({
      id: uuidv4(),
      entityType: 'ticket',
      entityId: ticket.id,
      userId: currentUserId!,
      type: 'commented',
      description: 'Added a comment',
      createdAt: new Date().toISOString(),
    })

    setCommentText('')
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/tickets')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tickets
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {ticket.id.substring(0, 8)} • Created {formatRelative(ticket.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketComments.map((comment) => {
                  const user = users.find((u) => u.id === comment.userId)
                  return (
                    <div key={comment.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelative(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  )
                })}
                {ticketComments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                )}

                <div className="mt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} className="mt-2" disabled={!commentText.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline activities={ticketActivities} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <Select
                  value={ticket.assigneeId || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <p className="text-sm capitalize">{ticket.category}</p>
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

              <div>
                <label className="block text-sm font-medium mb-1">Requester</label>
                <p className="text-sm">{requester?.name}</p>
              </div>

              {ticket.slaDeadline && (
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    SLA Deadline
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{formatDateTime(ticket.slaDeadline)}</p>
                    {slaStatus === 'overdue' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  {slaStatus === 'overdue' && (
                    <p className="text-xs text-destructive mt-1">Overdue</p>
                  )}
                  {slaStatus === 'warning' && (
                    <p className="text-xs text-yellow-600 mt-1">Due soon</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
