import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ClipboardList,
  Bell,
  Car,
  MessageSquare,
  QrCode,
  CalendarPlus
} from 'lucide-react'

function Layout({ children }) {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/book-slot', icon: CalendarPlus, label: 'Book Slot' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/staff', icon: UserCog, label: 'Staff Management' },
    { path: '/packages', icon: Package, label: 'Packages' },
    { path: '/attendance', icon: ClipboardList, label: 'Staff Attendance' },
    { path: '/reminders', icon: Bell, label: 'Send Reminders' },
    { path: '/sent-messages', icon: MessageSquare, label: 'Sent Messages' },
    { path: '/qr-generator', icon: QrCode, label: 'WhatsApp QR' },
  ]

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1><Car size={24} style={{display: 'inline', marginRight: '8px'}} />CarWash</h1>
          <p>Admin Panel</p>
        </div>
        <nav>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
