import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Staff from './pages/Staff'
import Packages from './pages/Packages'
import Attendance from './pages/Attendance'
import Reminders from './pages/Reminders'
import SentMessages from './pages/SentMessages'
import QRGenerator from './pages/QRGenerator'
import BookSlot from './pages/BookSlot'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/sent-messages" element={<SentMessages />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/book-slot" element={<BookSlot />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
