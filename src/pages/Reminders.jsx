import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Send, Clock, Check, AlertCircle, QrCode, Wifi, WifiOff, Loader, Power, RefreshCw, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/whatsapp'
const MANAGER_URL = import.meta.env.VITE_MANAGER_URL || 'http://localhost:3002/api/manager'

function Reminders() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [whatsappStatus, setWhatsappStatus] = useState({ isReady: false, qrCode: null, user: null })
  const [loading, setLoading] = useState(false)
  const [sendingId, setSendingId] = useState(null)
  const [serverStarting, setServerStarting] = useState(false)

  const [reminders, setReminders] = useState([
    {
      id: 1,
      customer: 'Rahul Sharma',
      phone: '9876543210',
      car: 'Honda City',
      serviceTime: '7:00 AM',
      serviceDate: 'Tomorrow',
      status: 'pending',
      sentAt: null
    },
    {
      id: 2,
      customer: 'Priya Patel',
      phone: '9876543211',
      car: 'Maruti Swift',
      serviceTime: '7:45 AM',
      serviceDate: 'Tomorrow',
      status: 'pending',
      sentAt: null
    },
    {
      id: 3,
      customer: 'Amit Kumar',
      phone: '8788230023',
      car: 'Hyundai Creta',
      serviceTime: '8:30 AM',
      serviceDate: 'Tomorrow',
      status: 'pending',
      sentAt: null
    },
  ])

  // Check WhatsApp status
  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`)
      const data = await res.json()
      setWhatsappStatus(data)
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 3000) // Check every 3 seconds
    return () => clearInterval(interval)
  }, [])

  // View QR Code
  const viewQRCode = () => {
    window.open(`${API_URL}/qr`, '_blank', 'width=600,height=700')
  }

  // Start WhatsApp Server
  const startServer = async () => {
    setServerStarting(true)
    try {
      const res = await fetch(`${MANAGER_URL}/start`, {
        method: 'POST'
      })
      const data = await res.json()

      if (data.success) {
        alert('✅ WhatsApp server started successfully!\n\nPlease wait a moment, then click "View QR Code" button to scan with WhatsApp.')
        // Wait a moment for server to initialize, then check status
        setTimeout(() => {
          checkStatus()
          setServerStarting(false)
        }, 3000)
      } else {
        // Check if server is already running
        if (data.message && data.message.includes('already running')) {
          alert('ℹ️ Server is already running!\n\nClick "View QR Code" button to scan with WhatsApp.')
        } else {
          alert('❌ ' + (data.message || 'Failed to start server'))
        }
        setServerStarting(false)
      }
    } catch (error) {
      alert('❌ Manager not running. Please contact support.')
      console.error('Error starting server:', error)
      setServerStarting(false)
    }
  }

  // Stop WhatsApp Server
  const stopServer = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${MANAGER_URL}/stop`, {
        method: 'POST'
      })
      const data = await res.json()

      setTimeout(() => {
        checkStatus()
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error stopping server:', error)
      setLoading(false)
    }
  }

  // Restart Connection (Logout and reconnect)
  const restartConnection = async () => {
    try {
      setLoading(true)
      await fetch(`${API_URL}/logout`, { method: 'POST' })

      setTimeout(() => {
        checkStatus()
        viewQRCode()
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Error restarting:', error)
      setLoading(false)
    }
  }

  // Send single message
  const sendReminder = async (reminder) => {
    setSendingId(reminder.id)
    try {
      const message = `🚗 *CarWash Reminder*\n\nHello ${reminder.customer}!\n\nYour car wash service for *${reminder.car}* is scheduled for *${reminder.serviceDate}* at *${reminder.serviceTime}*.\n\nPlease ensure your vehicle is available.\n\nThank you for choosing CarWash Service! 🙏`

      const res = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: reminder.phone,
          message,
          customerName: reminder.customer,
          customerCar: reminder.car,
          serviceTime: reminder.serviceTime,
          serviceDate: reminder.serviceDate
        })
      })

      const data = await res.json()

      if (data.success) {
        setReminders(prev => prev.map(r =>
          r.id === reminder.id
            ? { ...r, status: 'sent', sentAt: new Date().toLocaleTimeString() }
            : r
        ))
      } else {
        setReminders(prev => prev.map(r =>
          r.id === reminder.id
            ? { ...r, status: 'failed', error: data.error }
            : r
        ))
      }
    } catch (error) {
      setReminders(prev => prev.map(r =>
        r.id === reminder.id
          ? { ...r, status: 'failed', error: 'Server not running' }
          : r
      ))
    }
    setSendingId(null)
  }

  // Send all pending
  const sendAllPending = async () => {
    setLoading(true)
    const pending = reminders.filter(r => r.status === 'pending')
    for (const reminder of pending) {
      await sendReminder(reminder)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setLoading(false)
  }

  const filteredReminders = selectedFilter === 'all'
    ? reminders
    : reminders.filter(r => r.status === selectedFilter)

  const stats = {
    total: reminders.length,
    sent: reminders.filter(r => r.status === 'sent').length,
    pending: reminders.filter(r => r.status === 'pending').length,
    failed: reminders.filter(r => r.status === 'failed').length,
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check size={16} color="#4caf50" />
      case 'pending': return <Clock size={16} color="#ff9800" />
      case 'failed': return <AlertCircle size={16} color="#f44336" />
      default: return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent': return 'badge-success'
      case 'pending': return 'badge-warning'
      case 'failed': return 'badge-danger'
      default: return ''
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>WhatsApp Reminders</h2>
        <button
          className="btn btn-primary"
          onClick={sendAllPending}
          disabled={!whatsappStatus.isReady || loading || stats.pending === 0}
        >
          {loading ? <Loader size={18} className="spinning" /> : <Send size={18} />}
          Send All Pending
        </button>
      </div>

      {/* WhatsApp Connection Status */}
      <div className="card" style={{ marginBottom: '24px', background: whatsappStatus.isReady ? '#e8f5e9' : '#fff3e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            {whatsappStatus.isReady ? (
              <Wifi size={32} color="#4caf50" />
            ) : (
              <WifiOff size={32} color="#ff9800" />
            )}
            <div>
              <h3 style={{ margin: 0, color: whatsappStatus.isReady ? '#2e7d32' : '#ef6c00' }}>
                {whatsappStatus.isReady ? 'WhatsApp Connected' : 'WhatsApp Not Connected'}
              </h3>
              {whatsappStatus.isReady && whatsappStatus.user && (
                <p style={{ margin: '4px 0 0', color: '#666' }}>
                  Connected as: <strong>{whatsappStatus.user.name}</strong> ({whatsappStatus.user.number})
                </p>
              )}
              {!whatsappStatus.isReady && (
                <p style={{ margin: '4px 0 0', color: '#666' }}>
                  Click "View QR Code" button to scan with WhatsApp
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!whatsappStatus.isReady && (
              <>
                <button
                  className="btn btn-success"
                  onClick={startServer}
                  disabled={serverStarting}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {serverStarting ? <Loader size={18} className="spinning" /> : <Power size={18} />}
                  {serverStarting ? 'Starting...' : 'Start Server'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={viewQRCode}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <QrCode size={18} />
                  View QR Code
                </button>
              </>
            )}
            {whatsappStatus.isReady && (
              <>
                <button
                  className="btn"
                  onClick={restartConnection}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? <Loader size={18} className="spinning" /> : <RefreshCw size={18} />}
                  Restart Connection
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Bell size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Reminders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Check size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.sent}</h3>
            <p>Sent Successfully</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <AlertCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tomorrow's Service Reminders</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn btn-sm ${selectedFilter === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All ({stats.total})
            </button>
            <button
              className={`btn btn-sm ${selectedFilter === 'sent' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedFilter('sent')}
            >
              Sent ({stats.sent})
            </button>
            <button
              className={`btn btn-sm ${selectedFilter === 'pending' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button
              className={`btn btn-sm ${selectedFilter === 'failed' ? 'btn-primary' : ''}`}
              onClick={() => setSelectedFilter('failed')}
            >
              Failed ({stats.failed})
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>WhatsApp</th>
                <th>Service Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map((reminder) => (
                <tr key={reminder.id}>
                  <td>
                    <strong>{reminder.customer}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{reminder.car}</small>
                  </td>
                  <td>
                    <MessageCircle size={14} style={{ marginRight: '5px', color: '#25D366' }} />
                    {reminder.phone}
                  </td>
                  <td>
                    <strong>{reminder.serviceTime}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{reminder.serviceDate}</small>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getStatusIcon(reminder.status)}
                      <span className={`badge ${getStatusBadge(reminder.status)}`}>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </span>
                    </div>
                    {reminder.sentAt && (
                      <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                        Sent at {reminder.sentAt}
                      </small>
                    )}
                    {reminder.error && (
                      <small style={{ color: '#f44336', display: 'block', marginTop: '4px' }}>
                        {reminder.error}
                      </small>
                    )}
                  </td>
                  <td>
                    {reminder.status === 'pending' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => sendReminder(reminder)}
                        disabled={!whatsappStatus.isReady || sendingId === reminder.id}
                      >
                        {sendingId === reminder.id ? (
                          <Loader size={14} className="spinning" />
                        ) : (
                          <Send size={14} />
                        )}
                        Send
                      </button>
                    )}
                    {reminder.status === 'failed' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => sendReminder(reminder)}
                        disabled={!whatsappStatus.isReady}
                      >
                        <Send size={14} /> Retry
                      </button>
                    )}
                    {reminder.status === 'sent' && (
                      <span style={{ color: '#4caf50' }}>
                        <Check size={16} /> Delivered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reminders
