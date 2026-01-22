import { useState } from 'react'
import { Clock, User, UserCheck, Edit, Save, X, Coffee, FileSpreadsheet, Search, UserX } from 'lucide-react'

function Attendance() {
  // Filter inputs (not applied yet)
  const [selectedStaff, setSelectedStaff] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Applied filters (used for actual filtering)
  const [appliedStaff, setAppliedStaff] = useState('all')
  const [appliedStatus, setAppliedStatus] = useState('all')
  const [appliedStartDate, setAppliedStartDate] = useState('')
  const [appliedEndDate, setAppliedEndDate] = useState('')

  const staffMembers = [
    { id: 1, name: 'Ramesh Kumar' },
    { id: 2, name: 'Suresh Yadav' },
    { id: 3, name: 'Mohan Singh' },
    { id: 4, name: 'Vijay Sharma' },
  ]

  const [todayAttendance, setTodayAttendance] = useState([
    { id: 1, name: 'Ramesh Kumar', loginTime: '', logoutTime: '', status: 'Present', customersServed: 0, reason: '' },
    { id: 2, name: 'Suresh Yadav', loginTime: '', logoutTime: '', status: 'Present', customersServed: 0, reason: '' },
    { id: 3, name: 'Mohan Singh', loginTime: '', logoutTime: '', status: 'Present', customersServed: 0, reason: '' },
    { id: 4, name: 'Vijay Sharma', loginTime: '', logoutTime: '', status: 'Absent', customersServed: 0, reason: '' },
  ])

  const [attendanceHistory] = useState([
    { id: 1, date: '2024-01-14', staffId: 1, staffName: 'Ramesh Kumar', loginTime: '06:45', logoutTime: '14:30', status: 'Present', hoursWorked: '7:45', customersServed: 8, reason: '' },
    { id: 2, date: '2024-01-14', staffId: 2, staffName: 'Suresh Yadav', loginTime: '06:50', logoutTime: '14:15', status: 'Present', hoursWorked: '7:25', customersServed: 7, reason: '' },
    { id: 3, date: '2024-01-14', staffId: 3, staffName: 'Mohan Singh', loginTime: '07:00', logoutTime: '15:00', status: 'Present', hoursWorked: '8:00', customersServed: 9, reason: '' },
    { id: 4, date: '2024-01-14', staffId: 4, staffName: 'Vijay Sharma', loginTime: '-', logoutTime: '-', status: 'On Leave', hoursWorked: '-', customersServed: 0, reason: 'Family Function' },
    { id: 5, date: '2024-01-13', staffId: 1, staffName: 'Ramesh Kumar', loginTime: '06:40', logoutTime: '14:20', status: 'Present', hoursWorked: '7:40', customersServed: 7, reason: '' },
    { id: 6, date: '2024-01-13', staffId: 2, staffName: 'Suresh Yadav', loginTime: '07:00', logoutTime: '14:00', status: 'Present', hoursWorked: '7:00', customersServed: 6, reason: '' },
    { id: 7, date: '2024-01-13', staffId: 3, staffName: 'Mohan Singh', loginTime: '06:55', logoutTime: '15:10', status: 'Present', hoursWorked: '8:15', customersServed: 10, reason: '' },
    { id: 8, date: '2024-01-13', staffId: 4, staffName: 'Vijay Sharma', loginTime: '07:10', logoutTime: '14:30', status: 'Present', hoursWorked: '7:20', customersServed: 6, reason: '' },
    { id: 9, date: '2024-01-12', staffId: 1, staffName: 'Ramesh Kumar', loginTime: '06:50', logoutTime: '14:25', status: 'Present', hoursWorked: '7:35', customersServed: 8, reason: '' },
    { id: 10, date: '2024-01-12', staffId: 2, staffName: 'Suresh Yadav', loginTime: '-', logoutTime: '-', status: 'Absent', hoursWorked: '-', customersServed: 0, reason: 'Sick' },
    { id: 11, date: '2024-01-12', staffId: 3, staffName: 'Mohan Singh', loginTime: '07:05', logoutTime: '15:00', status: 'Present', hoursWorked: '7:55', customersServed: 9, reason: '' },
    { id: 12, date: '2024-01-12', staffId: 4, staffName: 'Vijay Sharma', loginTime: '07:00', logoutTime: '14:00', status: 'Present', hoursWorked: '7:00', customersServed: 5, reason: '' },
    { id: 13, date: '2024-01-11', staffId: 1, staffName: 'Ramesh Kumar', loginTime: '06:45', logoutTime: '14:30', status: 'Present', hoursWorked: '7:45', customersServed: 7, reason: '' },
    { id: 14, date: '2024-01-11', staffId: 2, staffName: 'Suresh Yadav', loginTime: '06:55', logoutTime: '14:10', status: 'Present', hoursWorked: '7:15', customersServed: 6, reason: '' },
    { id: 15, date: '2024-01-11', staffId: 3, staffName: 'Mohan Singh', loginTime: '-', logoutTime: '-', status: 'On Leave', hoursWorked: '-', customersServed: 0, reason: 'Personal Work' },
    { id: 16, date: '2024-01-11', staffId: 4, staffName: 'Vijay Sharma', loginTime: '07:15', logoutTime: '14:45', status: 'Present', hoursWorked: '7:30', customersServed: 7, reason: '' },
    { id: 17, date: '2024-01-10', staffId: 1, staffName: 'Ramesh Kumar', loginTime: '06:40', logoutTime: '14:20', status: 'Present', hoursWorked: '7:40', customersServed: 8, reason: '' },
    { id: 18, date: '2024-01-10', staffId: 2, staffName: 'Suresh Yadav', loginTime: '07:00', logoutTime: '14:30', status: 'Present', hoursWorked: '7:30', customersServed: 7, reason: '' },
    { id: 19, date: '2024-01-10', staffId: 3, staffName: 'Mohan Singh', loginTime: '06:50', logoutTime: '15:00', status: 'Present', hoursWorked: '8:10', customersServed: 9, reason: '' },
    { id: 20, date: '2024-01-10', staffId: 4, staffName: 'Vijay Sharma', loginTime: '-', logoutTime: '-', status: 'Absent', hoursWorked: '-', customersServed: 0, reason: 'Not informed' },
  ])

  // Manual Login - Sets login time and marks as Present
  const handleLogin = (staffId) => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setTodayAttendance(prev => prev.map(s =>
      s.id === staffId
        ? { ...s, loginTime: now, status: 'Present' }
        : s
    ))
  }

  // Handle status change
  const handleStatusChange = (staffId, newStatus) => {
    setTodayAttendance(prev => prev.map(s =>
      s.id === staffId
        ? { ...s, status: newStatus }
        : s
    ))
  }

  // Update customers served
  const handleUpdateCustomers = (staffId, count) => {
    setTodayAttendance(prev => prev.map(s =>
      s.id === staffId
        ? { ...s, customersServed: parseInt(count) || 0 }
        : s
    ))
  }

  // Update reason
  const handleUpdateReason = (staffId, reason) => {
    setTodayAttendance(prev => prev.map(s =>
      s.id === staffId
        ? { ...s, reason }
        : s
    ))
  }

  // Manual time edit
  const [editingTime, setEditingTime] = useState(null)
  const [tempTime, setTempTime] = useState({ login: '', logout: '' })

  const startEditTime = (staff) => {
    setEditingTime(staff.id)
    setTempTime({ login: staff.loginTime, logout: staff.logoutTime })
  }

  const saveEditTime = (staffId) => {
    setTodayAttendance(prev => prev.map(s =>
      s.id === staffId
        ? {
            ...s,
            loginTime: tempTime.login,
            logoutTime: tempTime.logout
          }
        : s
    ))
    setEditingTime(null)
  }

  // Apply filters when search button is clicked
  const handleSearch = () => {
    setAppliedStaff(selectedStaff)
    setAppliedStatus(selectedStatus)
    setAppliedStartDate(startDate)
    setAppliedEndDate(endDate)
  }

  // History Filter logic - Uses applied filters
  const filteredHistory = attendanceHistory.filter(record => {
    if (appliedStaff !== 'all' && record.staffId !== parseInt(appliedStaff)) return false
    if (appliedStatus !== 'all' && record.status !== appliedStatus) return false
    if (appliedStartDate && record.date < appliedStartDate) return false
    if (appliedEndDate && record.date > appliedEndDate) return false
    return true
  })

  // Stats
  const totalPresent = filteredHistory.filter(r => r.status === 'Present').length
  const totalAbsent = filteredHistory.filter(r => r.status === 'Absent').length
  const totalLeave = filteredHistory.filter(r => r.status === 'On Leave').length
  const totalCustomers = filteredHistory.reduce((sum, r) => sum + r.customersServed, 0)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const clearFilters = () => {
    setSelectedStaff('all')
    setSelectedStatus('all')
    setStartDate('')
    setEndDate('')
    setAppliedStaff('all')
    setAppliedStatus('all')
    setAppliedStartDate('')
    setAppliedEndDate('')
  }

  // Download Excel (CSV)
  const downloadExcel = () => {
    const headers = ['Date', 'Staff Name', 'Login Time', 'Logout Time', 'Hours Worked', 'Customers Served', 'Status', 'Reason']
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(r => [
        r.date,
        r.staffName,
        r.loginTime,
        r.logoutTime,
        r.hoursWorked,
        r.customersServed,
        r.status,
        `"${r.reason || '-'}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `attendance_history_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return 'badge-success'
      case 'Half Day': return 'badge-info'
      case 'On Leave': return 'badge-warning'
      case 'Absent': return 'badge-danger'
      default: return ''
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Staff Attendance</h2>
        <p style={{ color: '#666', margin: 0 }}>Manage daily staff attendance and view history</p>
      </div>

      {/* Today's Manual Attendance Entry */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Today's Attendance Entry</h3>
          <span style={{ color: '#666' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Status</th>
                <th>Customers Served</th>
                <th>Reason/Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((staff) => (
                <tr key={staff.id}>
                  <td><strong>{staff.name}</strong></td>
                  <td>
                    {editingTime === staff.id ? (
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: '120px' }}
                        value={tempTime.login}
                        onChange={(e) => setTempTime({ ...tempTime, login: e.target.value })}
                      />
                    ) : (
                      <>
                        {staff.loginTime && <Clock size={14} style={{ marginRight: '5px' }} />}
                        {staff.loginTime || '-'}
                      </>
                    )}
                  </td>
                  <td>
                    {editingTime === staff.id ? (
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: '120px' }}
                        value={tempTime.logout}
                        onChange={(e) => setTempTime({ ...tempTime, logout: e.target.value })}
                      />
                    ) : (
                      staff.logoutTime || '-'
                    )}
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={staff.status}
                      onChange={(e) => handleStatusChange(staff.id, e.target.value)}
                      style={{ width: '130px', padding: '6px' }}
                    >
                      <option value="Present">Present</option>
                      <option value="Half Day">Half Day</option>
                      <option value="On Leave">Leave</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      value={staff.customersServed}
                      onChange={(e) => handleUpdateCustomers(staff.id, e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      style={{ minWidth: '200px' }}
                      value={staff.reason}
                      onChange={(e) => handleUpdateReason(staff.id, e.target.value)}
                      placeholder={staff.status === 'On Leave' || staff.status === 'Absent' ? 'Enter reason...' : 'Optional remarks'}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {editingTime === staff.id ? (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => saveEditTime(staff.id)}>
                            <Save size={14} />
                          </button>
                          <button className="btn btn-sm" onClick={() => setEditingTime(null)}>
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleLogin(staff.id)}>
                            <UserCheck size={14} /> Login
                          </button>
                          <button className="btn btn-sm" onClick={() => startEditTime(staff)}>
                            <Edit size={14} /> Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title">Attendance History</h3>
            <p style={{ color: '#666', margin: '4px 0 0', fontSize: '0.85rem' }}>Filter and view past attendance records</p>
          </div>
          <button className="btn btn-success btn-sm" onClick={downloadExcel}>
            <FileSpreadsheet size={16} /> Download Excel
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '150px' }}>
              <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>Filter by Staff</label>
              <select className="form-control" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={{ padding: '8px' }}>
                <option value="all">All Staff</option>
                {staffMembers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ minWidth: '120px' }}>
              <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
              <select className="form-control" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: '8px' }}>
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">Leave</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>From Date</label>
              <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '8px', width: '150px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>To Date</label>
              <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '8px', width: '150px' }} />
            </div>

            <button className="btn btn-primary btn-sm" onClick={handleSearch} style={{ padding: '8px 16px' }}>
              <Search size={16} style={{ marginRight: '4px' }} />
              Search
            </button>
            <button className="btn btn-sm" onClick={clearFilters} style={{ padding: '8px 16px' }}>Clear Filters</button>

            {/* Stats inline */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: '#4caf50', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={14} /> Present: {totalPresent}
              </span>
              <span style={{ color: '#ff9800', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Coffee size={14} /> Leave: {totalLeave}
              </span>
              <span style={{ color: '#f44336', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserX size={14} /> Absent: {totalAbsent}
              </span>
              <span style={{ color: '#1976d2', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} /> Customers: {totalCustomers}
              </span>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
          <table>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <tr>
                <th>Date</th>
                <th>Staff Name</th>
                <th>Login</th>
                <th>Logout</th>
                <th>Hours Worked</th>
                <th>Customers</th>
                <th>Status</th>
                <th>Reason/Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No records found
                  </td>
                </tr>
              ) : (
                filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map(record => (
                  <tr key={record.id}>
                    <td><strong>{formatDate(record.date)}</strong></td>
                    <td>{record.staffName}</td>
                    <td>
                      {record.loginTime !== '-' && <Clock size={14} style={{ marginRight: '5px', color: '#4caf50' }} />}
                      {record.loginTime}
                    </td>
                    <td>
                      {record.logoutTime !== '-' && <Clock size={14} style={{ marginRight: '5px', color: '#f44336' }} />}
                      {record.logoutTime}
                    </td>
                    <td>{record.hoursWorked}</td>
                    <td style={{ fontWeight: '600' }}>{record.customersServed}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ color: record.reason ? '#666' : '#ccc', fontStyle: record.reason ? 'normal' : 'italic' }}>
                      {record.reason || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid #eee', background: '#f8fafc', fontSize: '0.85rem', color: '#666' }}>
          Showing {filteredHistory.length} records
        </div>
      </div>
    </div>
  )
}

export default Attendance
