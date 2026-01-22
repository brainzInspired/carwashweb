import { useState, useEffect } from 'react'
import { MessageCircle, Trash2, RefreshCw, Phone, Car, Clock, Calendar, Search } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/whatsapp'

function SentMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/history`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const clearHistory = async () => {
    if (confirm('Are you sure you want to clear all message history?')) {
      try {
        await fetch(`${API_URL}/history`, { method: 'DELETE' })
        setMessages([])
      } catch (error) {
        console.error('Error clearing history:', error)
      }
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(msg =>
    msg.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.phone?.includes(searchTerm) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats
  const todayCount = messages.filter(msg => {
    const msgDate = new Date(msg.sentAt).toDateString()
    const today = new Date().toDateString()
    return msgDate === today
  }).length

  const thisWeekCount = messages.filter(msg => {
    const msgDate = new Date(msg.sentAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return msgDate >= weekAgo
  }).length

  return (
    <div>
      <div className="page-header">
        <h2>Sent Messages History</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={fetchHistory}>
            <RefreshCw size={18} /> Refresh
          </button>
          <button className="btn btn-danger" onClick={clearHistory} disabled={messages.length === 0}>
            <Trash2 size={18} /> Clear History
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <MessageCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{messages.length}</h3>
            <p>Total Messages Sent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>{todayCount}</h3>
            <p>Sent Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>{thisWeekCount}</h3>
            <p>Sent This Week</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={20} color="#666" />
            <input
              type="text"
              placeholder="Search by name, phone, or message..."
              className="form-control"
              style={{ width: '300px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ color: '#666' }}>{filteredMessages.length} messages</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <MessageCircle size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p>No messages sent yet</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service Details</th>
                  <th>Message</th>
                  <th>Sent At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <strong>{msg.customerName}</strong>
                      {msg.customerCar !== 'N/A' && (
                        <>
                          <br />
                          <small style={{ color: '#666' }}>
                            <Car size={12} /> {msg.customerCar}
                          </small>
                        </>
                      )}
                    </td>
                    <td>
                      <Phone size={14} style={{ marginRight: '5px' }} />
                      {msg.phone}
                    </td>
                    <td>
                      {msg.serviceTime !== 'N/A' ? (
                        <>
                          <Clock size={14} style={{ marginRight: '5px' }} />
                          {msg.serviceTime}
                          <br />
                          <small style={{ color: '#666' }}>{msg.serviceDate}</small>
                        </>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '250px' }}>
                      <small style={{
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {msg.message.substring(0, 100)}
                        {msg.message.length > 100 && '...'}
                      </small>
                    </td>
                    <td>
                      <small>{formatDate(msg.sentAt)}</small>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {msg.status || 'Sent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SentMessages
