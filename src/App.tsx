import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { initializeStorage } from './lib/storage'
import Layout from './components/layout/Layout'
import Dashboard from './features/dashboard/Dashboard'
import TicketList from './features/tickets/TicketList'
import TicketDetail from './features/tickets/TicketDetail'
import AssetList from './features/assets/AssetList'
import AssetDetail from './features/assets/AssetDetail'
import WorkOrderList from './features/workorders/WorkOrderList'
import WorkOrderDetail from './features/workorders/WorkOrderDetail'
import PMPlanList from './features/pm/PMPlanList'
import SupplierList from './features/suppliers/SupplierList'
import RFQList from './features/rfq/RFQList'
import RFQDetail from './features/rfq/RFQDetail'
import POList from './features/po/POList'
import PODetail from './features/po/PODetail'
import AdminPanel from './features/admin/AdminPanel'

const basename = import.meta.env.BASE_URL || '/'

function App() {
  useEffect(() => {
    // Initialize storage and seed demo data on first load
    initializeStorage()
  }, [])

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Service Desk */}
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/:id" element={<TicketDetail />} />

          {/* Assets & Maintenance */}
          <Route path="assets" element={<AssetList />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="work-orders" element={<WorkOrderList />} />
          <Route path="work-orders/:id" element={<WorkOrderDetail />} />
          <Route path="pm-plans" element={<PMPlanList />} />

          {/* Suppliers & Procurement */}
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="rfq" element={<RFQList />} />
          <Route path="rfq/:id" element={<RFQDetail />} />
          <Route path="po" element={<POList />} />
          <Route path="po/:id" element={<PODetail />} />

          {/* Admin */}
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
