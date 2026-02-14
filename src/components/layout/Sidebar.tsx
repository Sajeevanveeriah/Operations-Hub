import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Ticket,
  Package,
  Wrench,
  Calendar,
  Building2,
  FileText,
  ShoppingCart,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Service Desk', section: true },
  { name: 'Tickets', to: '/tickets', icon: Ticket },
  { name: 'Maintenance', section: true },
  { name: 'Assets', to: '/assets', icon: Package },
  { name: 'Work Orders', to: '/work-orders', icon: Wrench },
  { name: 'PM Plans', to: '/pm-plans', icon: Calendar },
  { name: 'Procurement', section: true },
  { name: 'Suppliers', to: '/suppliers', icon: Building2 },
  { name: 'RFQs', to: '/rfq', icon: FileText },
  { name: 'Purchase Orders', to: '/po', icon: ShoppingCart },
  { name: 'System', section: true },
  { name: 'Admin', to: '/admin', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Operations Hub</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item, index) =>
          item.section ? (
            <div key={index} className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 first:mt-0">
              {item.name}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.name}
            </NavLink>
          )
        )}
      </nav>
    </div>
  )
}
