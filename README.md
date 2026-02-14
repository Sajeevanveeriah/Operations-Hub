# Operations Hub - Demo

A comprehensive operations management platform demo built with React, TypeScript, and Vite. This is a fully client-side application showcasing Service Desk, CMMS, and Procurement capabilities.

![Operations Hub](https://img.shields.io/badge/demo-live-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

**GitHub Pages URL**: `https://<username>.github.io/Operations-Hub/`

> **Note**: Replace `<username>` with your GitHub username. The app is configured to work under the `/Operations-Hub/` base path.

## ✨ Features

### 📋 Service Desk
- **Ticket Management**: Create, track, and resolve service requests
- **SLA Tracking**: Automatic SLA deadline calculation with overdue alerts
- **Comments & Activity Log**: Full audit trail for every ticket
- **Filtering & Search**: Filter by status, priority, site, and search text
- **Assignment**: Assign tickets to technicians with automatic notifications

### 🔧 Maintenance CMMS
- **Asset Registry**: Track equipment with QR codes, warranty info, and documentation
- **Work Orders**: Create corrective and preventive maintenance work orders
- **PM Plans**: Scheduled preventive maintenance with automatic work order generation
- **Checklists**: Task lists with completion tracking
- **Parts & Labor**: Track parts used and labor hours

### 🛒 Supplier & Procurement
- **Supplier Directory**: Manage supplier contacts and service categories
- **RFQ Flow**: Request for quotation with multi-supplier invitations
- **Quote Comparison**: Compare quotes side-by-side with line items and totals
- **Purchase Orders**: Create POs from quotes with approval workflow
- **Spend Tracking**: Monitor total spend across all purchase orders

### ⚙️ Admin & Configuration
- **Multi-Role Demo**: Switch between requester, dispatcher, technician, manager roles
- **Multi-Site Support**: Manage operations across multiple sites and industries
- **Data Management**: Export/import all data as JSON
- **Reset Demo Data**: One-click restore to original demo state
- **SLA Configuration**: Customize response and resolution times by priority

### 🎯 Cross-Cutting Features
- **Notifications**: Real-time notifications for assignments, SLA warnings, approvals
- **Activity Logs**: Comprehensive audit trail for all entities
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **localStorage Persistence**: All data persists across sessions
- **Versioned Migrations**: Schema versioning for data model updates

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **State Management**: Zustand
- **Styling**: Tailwind CSS (shadcn/ui pattern)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Storage**: localStorage with JSON serialization
- **Deployment**: GitHub Pages with Actions

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/<username>/Operations-Hub.git
cd Operations-Hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment

This repo includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to `main` or `master`.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"
   - Save

2. **Update Base Path** (if repo name differs):
   - Edit `vite.config.ts`:
     ```typescript
     export default defineConfig({
       base: '/YOUR-REPO-NAME/',
       // ...
     })
     ```

3. **Push to main/master**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

4. **Wait for deployment**:
   - Check Actions tab for build status
   - Visit `https://<username>.github.io/Operations-Hub/`

## 📊 Demo Data

The app seeds realistic demo data on first load:

- **3 Sites**: Manufacturing plant, medical center, hospitality venue
- **5 Users**: Manager, technicians, dispatcher, requester
- **5+ Tickets**: Across different priorities and statuses
- **4 Assets**: CNC machine, forklift, MRI scanner, HVAC unit
- **2 Work Orders**: Preventive and corrective maintenance
- **3 PM Plans**: Scheduled maintenance schedules
- **3 Suppliers**: Across different service categories
- **2 RFQs**: With quotes and supplier responses
- **1 PO**: Approved purchase order example

### Reset Demo Data

1. Navigate to Admin Panel
2. Click "Reset Demo Data"
3. Confirm the action
4. All data will be restored to initial state

### Export/Import Data

**Export**:
- Admin Panel → Export Data to JSON
- Saves a timestamped JSON file with all data

**Import**:
- Admin Panel → Import Data from JSON
- Select a previously exported JSON file
- Data will be restored from the file

## 🎮 Using the Demo

### Switch Roles
1. Go to Admin Panel
2. Select a user from the dropdown
3. Experience different role capabilities

### Common Workflows

**Create a Ticket**:
1. Service Desk → New Ticket
2. Fill in title, description, priority, site
3. Submit
4. View in ticket list

**Assign and Resolve**:
1. Open ticket detail
2. Change status to "In Progress"
3. Assign to a technician
4. Add comments
5. Change status to "Resolved"

**Create Work Order from Ticket**:
1. View ticket detail
2. Note the ticket ID
3. Navigate to Work Orders
4. Reference ticket when creating work order

**RFQ to PO Flow**:
1. Create RFQ with suppliers
2. Suppliers submit quotes (demo data)
3. Compare quotes
4. Award quote
5. Create PO from awarded quote
6. Approve PO

## 🏗️ Project Structure

```
Operations-Hub/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── layout/             # Layout components (Sidebar, Header)
│   │   ├── shared/             # Reusable components (DataTable, StatusBadge)
│   │   └── ui/                 # Base UI components (Button, Card, Input)
│   ├── features/
│   │   ├── admin/              # Admin panel
│   │   ├── assets/             # Asset management
│   │   ├── dashboard/          # Dashboard with KPIs
│   │   ├── pm/                 # PM plans
│   │   ├── po/                 # Purchase orders
│   │   ├── rfq/                # Request for quotation
│   │   ├── suppliers/          # Supplier directory
│   │   ├── tickets/            # Service desk tickets
│   │   └── workorders/         # Work orders
│   ├── lib/
│   │   ├── demoData.ts         # Demo data generation
│   │   ├── storage.ts          # localStorage persistence
│   │   └── utils.ts            # Utility functions
│   ├── store/
│   │   └── index.ts            # Zustand store
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── tailwind.config.js          # Tailwind config
```

## 🔧 Configuration

### Base Path for GitHub Pages

In `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/Operations-Hub/',  // Change to match your repo name
  // ...
})
```

### SLA Policies

In `src/lib/demoData.ts`, modify the `slaPolicies`:
```typescript
slaPolicies: [
  { priority: 'critical', responseMinutes: 15, resolutionMinutes: 120 },
  // Add more policies...
]
```

## 🚧 Limitations & Non-Goals

This is a **demo application** with intentional limitations:

- ❌ No real authentication or authorization
- ❌ No backend server or API
- ❌ No real-time multi-user sync
- ❌ No email or SMS notifications
- ❌ No file uploads (attachments use base64)
- ❌ Data stored in browser localStorage only
- ❌ Not intended for production use

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this code for learning and demonstrations.

## 🙋 Support

For questions or issues:
1. Check the code and comments
2. Review the demo data in `src/lib/demoData.ts`
3. Inspect localStorage in browser DevTools

## 🎯 Use Cases

Perfect for:
- **Sales Demos**: Showcase operations management capabilities
- **Customer Previews**: Let prospects explore the UI and workflows
- **Internal Training**: Familiarize teams with operations concepts
- **Prototyping**: Rapid UI/UX validation
- **Learning**: Study React, TypeScript, Zustand, Tailwind patterns

---

Built with ❤️ using React, TypeScript, and Vite