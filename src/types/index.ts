// Core Entity Types

export type UserRole = 'requester' | 'dispatcher' | 'technician' | 'manager' | 'supplier'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  siteId?: string
  avatarUrl?: string
  createdAt: string
}

export interface Site {
  id: string
  name: string
  address: string
  city: string
  industry: string
  managerId?: string
  createdAt: string
}

export interface Location {
  id: string
  siteId: string
  name: string
  floor?: string
  area?: string
  createdAt: string
}

// Service Desk Types

export type TicketStatus = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketCategory = 'maintenance' | 'it' | 'facilities' | 'safety' | 'other'

export interface Ticket {
  id: string
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  siteId: string
  locationId?: string
  requesterId: string
  assigneeId?: string
  dueDate?: string
  slaDeadline?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  closedAt?: string
}

export interface Comment {
  id: string
  entityType: 'ticket' | 'workorder' | 'rfq' | 'po'
  entityId: string
  userId: string
  content: string
  createdAt: string
}

export type ActivityType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'commented'
  | 'attachment_added'
  | 'attachment_removed'

export interface ActivityEvent {
  id: string
  entityType: 'ticket' | 'workorder' | 'asset' | 'rfq' | 'po'
  entityId: string
  userId: string
  type: ActivityType
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Attachment {
  id: string
  entityType: 'ticket' | 'workorder' | 'asset' | 'rfq' | 'po'
  entityId: string
  name: string
  type: string
  size: number
  data: string // base64
  uploadedBy: string
  createdAt: string
}

// Asset & Maintenance Types

export type AssetStatus = 'operational' | 'maintenance' | 'offline' | 'decommissioned'

export interface Asset {
  id: string
  name: string
  assetTag: string
  category: string
  siteId: string
  locationId?: string
  status: AssetStatus
  manufacturer?: string
  model?: string
  serialNumber?: string
  purchaseDate?: string
  warrantyExpiry?: string
  qrCode: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type WorkOrderStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type WorkOrderType = 'corrective' | 'preventive' | 'inspection' | 'project'

export interface ChecklistItem {
  id: string
  description: string
  completed: boolean
  completedBy?: string
  completedAt?: string
}

export interface PartUsed {
  id: string
  name: string
  quantity: number
  unitCost?: number
}

export interface WorkOrder {
  id: string
  title: string
  description: string
  type: WorkOrderType
  status: WorkOrderStatus
  priority: TicketPriority
  assetId?: string
  siteId: string
  locationId?: string
  assigneeId?: string
  ticketId?: string
  scheduledDate?: string
  dueDate?: string
  checklist: ChecklistItem[]
  partsUsed: PartUsed[]
  laborHours?: number
  notes?: string
  completionNotes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type PMFrequency = 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual'

export interface PMPlan {
  id: string
  name: string
  description: string
  assetId: string
  frequency: PMFrequency
  taskList: string[]
  assigneeId?: string
  isActive: boolean
  lastPerformed?: string
  nextDue?: string
  createdAt: string
  updatedAt: string
}

// Supplier & Procurement Types

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  categories: string[]
  rating?: number
  notes?: string
  createdAt: string
}

export type RFQStatus = 'draft' | 'sent' | 'quoted' | 'awarded' | 'cancelled'

export interface RFQ {
  id: string
  title: string
  description: string
  status: RFQStatus
  siteId: string
  requesterId: string
  ticketId?: string
  dueDate?: string
  supplierIds: string[]
  createdAt: string
  updatedAt: string
  awardedQuoteId?: string
}

export interface QuoteLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type QuoteStatus = 'pending' | 'submitted' | 'accepted' | 'rejected'

export interface Quote {
  id: string
  rfqId: string
  supplierId: string
  lines: QuoteLine[]
  subtotal: number
  tax: number
  total: number
  leadTimeDays?: number
  notes?: string
  status: QuoteStatus
  validUntil?: string
  createdAt: string
  updatedAt: string
}

export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'received' | 'cancelled'

export interface PO {
  id: string
  poNumber: string
  rfqId?: string
  quoteId?: string
  supplierId: string
  siteId: string
  requesterId: string
  approverId?: string
  status: POStatus
  lines: QuoteLine[]
  subtotal: number
  tax: number
  total: number
  deliveryDate?: string
  notes?: string
  approvalNotes?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  sentAt?: string
  receivedAt?: string
}

// Notification Types

export type NotificationType =
  | 'assignment'
  | 'sla_warning'
  | 'sla_overdue'
  | 'approval_request'
  | 'quote_received'
  | 'pm_due'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  entityType?: string
  entityId?: string
  read: boolean
  createdAt: string
}

// App State Types

export interface SLAPolicy {
  priority: TicketPriority
  responseMinutes: number
  resolutionMinutes: number
}

export interface AppSettings {
  siteId?: string
  slaEnabled: boolean
  slaPolicies: SLAPolicy[]
}

export interface AppData {
  version: number
  users: User[]
  sites: Site[]
  locations: Location[]
  tickets: Ticket[]
  comments: Comment[]
  activities: ActivityEvent[]
  attachments: Attachment[]
  assets: Asset[]
  workOrders: WorkOrder[]
  pmPlans: PMPlan[]
  suppliers: Supplier[]
  rfqs: RFQ[]
  quotes: Quote[]
  pos: PO[]
  notifications: Notification[]
  settings: AppSettings
  currentUserId?: string
}
