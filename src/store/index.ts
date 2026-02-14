import { create } from 'zustand'
import type {
  AppData,
  Site,
  Location,
  Ticket,
  Comment,
  ActivityEvent,
  Attachment,
  Asset,
  WorkOrder,
  PMPlan,
  Supplier,
  RFQ,
  Quote,
  PO,
  Notification,
} from '../types'
import { loadData, saveData } from '../lib/storage'

interface AppState extends AppData {
  // Actions
  setCurrentUser: (userId: string) => void

  // Tickets
  addTicket: (ticket: Ticket) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void

  // Comments
  addComment: (comment: Comment) => void

  // Activities
  addActivity: (activity: ActivityEvent) => void

  // Attachments
  addAttachment: (attachment: Attachment) => void
  removeAttachment: (id: string) => void

  // Assets
  addAsset: (asset: Asset) => void
  updateAsset: (id: string, updates: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  // Work Orders
  addWorkOrder: (workOrder: WorkOrder) => void
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void
  deleteWorkOrder: (id: string) => void

  // PM Plans
  addPMPlan: (plan: PMPlan) => void
  updatePMPlan: (id: string, updates: Partial<PMPlan>) => void
  deletePMPlan: (id: string) => void

  // Suppliers
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void

  // RFQs
  addRFQ: (rfq: RFQ) => void
  updateRFQ: (id: string, updates: Partial<RFQ>) => void

  // Quotes
  addQuote: (quote: Quote) => void
  updateQuote: (id: string, updates: Partial<Quote>) => void

  // POs
  addPO: (po: PO) => void
  updatePO: (id: string, updates: Partial<PO>) => void

  // Notifications
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Sites & Locations
  addSite: (site: Site) => void
  addLocation: (location: Location) => void

  // Utility
  reloadData: () => void
}

export const useStore = create<AppState>((set, get) => ({
  ...loadData(),

  setCurrentUser: (userId) => {
    set({ currentUserId: userId })
    saveData(get())
  },

  // Tickets
  addTicket: (ticket) => {
    set((state) => ({ tickets: [...state.tickets, ticket] }))
    saveData(get())
  },
  updateTicket: (id, updates) => {
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    }))
    saveData(get())
  },
  deleteTicket: (id) => {
    set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id) }))
    saveData(get())
  },

  // Comments
  addComment: (comment) => {
    set((state) => ({ comments: [...state.comments, comment] }))
    saveData(get())
  },

  // Activities
  addActivity: (activity) => {
    set((state) => ({ activities: [...state.activities, activity] }))
    saveData(get())
  },

  // Attachments
  addAttachment: (attachment) => {
    set((state) => ({ attachments: [...state.attachments, attachment] }))
    saveData(get())
  },
  removeAttachment: (id) => {
    set((state) => ({ attachments: state.attachments.filter((a) => a.id !== id) }))
    saveData(get())
  },

  // Assets
  addAsset: (asset) => {
    set((state) => ({ assets: [...state.assets, asset] }))
    saveData(get())
  },
  updateAsset: (id, updates) => {
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)),
    }))
    saveData(get())
  },
  deleteAsset: (id) => {
    set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }))
    saveData(get())
  },

  // Work Orders
  addWorkOrder: (workOrder) => {
    set((state) => ({ workOrders: [...state.workOrders, workOrder] }))
    saveData(get())
  },
  updateWorkOrder: (id, updates) => {
    set((state) => ({
      workOrders: state.workOrders.map((w) => (w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w)),
    }))
    saveData(get())
  },
  deleteWorkOrder: (id) => {
    set((state) => ({ workOrders: state.workOrders.filter((w) => w.id !== id) }))
    saveData(get())
  },

  // PM Plans
  addPMPlan: (plan) => {
    set((state) => ({ pmPlans: [...state.pmPlans, plan] }))
    saveData(get())
  },
  updatePMPlan: (id, updates) => {
    set((state) => ({
      pmPlans: state.pmPlans.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    }))
    saveData(get())
  },
  deletePMPlan: (id) => {
    set((state) => ({ pmPlans: state.pmPlans.filter((p) => p.id !== id) }))
    saveData(get())
  },

  // Suppliers
  addSupplier: (supplier) => {
    set((state) => ({ suppliers: [...state.suppliers, supplier] }))
    saveData(get())
  },
  updateSupplier: (id, updates) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
    saveData(get())
  },

  // RFQs
  addRFQ: (rfq) => {
    set((state) => ({ rfqs: [...state.rfqs, rfq] }))
    saveData(get())
  },
  updateRFQ: (id, updates) => {
    set((state) => ({
      rfqs: state.rfqs.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)),
    }))
    saveData(get())
  },

  // Quotes
  addQuote: (quote) => {
    set((state) => ({ quotes: [...state.quotes, quote] }))
    saveData(get())
  },
  updateQuote: (id, updates) => {
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q)),
    }))
    saveData(get())
  },

  // POs
  addPO: (po) => {
    set((state) => ({ pos: [...state.pos, po] }))
    saveData(get())
  },
  updatePO: (id, updates) => {
    set((state) => ({
      pos: state.pos.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    }))
    saveData(get())
  },

  // Notifications
  addNotification: (notification) => {
    set((state) => ({ notifications: [...state.notifications, notification] }))
    saveData(get())
  },
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
    saveData(get())
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
    saveData(get())
  },

  // Sites & Locations
  addSite: (site) => {
    set((state) => ({ sites: [...state.sites, site] }))
    saveData(get())
  },
  addLocation: (location) => {
    set((state) => ({ locations: [...state.locations, location] }))
    saveData(get())
  },

  // Utility
  reloadData: () => {
    set(loadData())
  },
}))
