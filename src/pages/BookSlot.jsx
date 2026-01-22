import { useState } from 'react'
import { Calendar, Clock, Car, User, Phone, MapPin, Package, Check, X, IndianRupee, List, Eye, Trash2 } from 'lucide-react'

function BookSlot() {
  const [view, setView] = useState('book') // 'book' or 'list'
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [carType, setCarType] = useState('')
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0])

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    carCompany: '',
    carModel: '',
    carNumber: '',
    package: 'Basic',
    frequency: 'Weekly Once',
    serviceDay: []
  })

  // Days of week for service days
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleDayToggle = (day) => {
    const currentDays = Array.isArray(newCustomer.serviceDay) ? newCustomer.serviceDay : []
    if (currentDays.includes(day)) {
      setNewCustomer({ ...newCustomer, serviceDay: currentDays.filter(d => d !== day) })
    } else {
      setNewCustomer({ ...newCustomer, serviceDay: [...currentDays, day] })
    }
  }

  // Existing customers
  const customers = [
    { id: 1, name: 'Rajesh Patil', phone: '9876543210', carNumber: 'MH12AB1234', carModel: 'Swift', carType: 'Hatchback' },
    { id: 2, name: 'Amit Shah', phone: '9898989898', carNumber: 'MH14CD5678', carModel: 'City', carType: 'Sedan' },
    { id: 3, name: 'Priya Sharma', phone: '8787878787', carNumber: 'MH12EF9012', carModel: 'Creta', carType: 'SUV' },
    { id: 4, name: 'Sunil Kumar', phone: '7676767676', carNumber: 'MH14GH3456', carModel: 'Fortuner', carType: 'XUV' },
  ]

  // Helper to get date string
  const getDateString = (daysFromToday = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromToday)
    return date.toISOString().split('T')[0]
  }

  // Bookings state - Sample data with today and tomorrow's bookings
  const [bookings, setBookings] = useState([
    { id: 1, date: getDateString(0), slotId: 3, slotTime: '07:30 - 08:15', customerName: 'Rajesh Patil', phone: '9876543210', carNumber: 'MH12AB1234', carModel: 'Swift', carType: 'Hatchback', packageName: 'Premium Wash', amount: 699, status: 'Confirmed' },
    { id: 2, date: getDateString(0), slotId: 6, slotTime: '09:45 - 10:30', customerName: 'Amit Shah', phone: '9898989898', carNumber: 'MH14CD5678', carModel: 'City', carType: 'Sedan', packageName: 'Basic Wash', amount: 599, status: 'Confirmed' },
    { id: 3, date: getDateString(0), slotId: 11, slotTime: '13:30 - 14:15', customerName: 'Priya Sharma', phone: '8787878787', carNumber: 'MH12EF9012', carModel: 'Creta', carType: 'SUV', packageName: 'Deluxe Wash', amount: 1399, status: 'Confirmed' },
    { id: 4, date: getDateString(1), slotId: 2, slotTime: '06:45 - 07:30', customerName: 'Sunil Kumar', phone: '7676767676', carNumber: 'MH14GH3456', carModel: 'Fortuner', carType: 'XUV', packageName: 'Ultimate Wash', amount: 2299, status: 'Confirmed' },
    { id: 5, date: getDateString(1), slotId: 5, slotTime: '09:00 - 09:45', customerName: 'Rajesh Patil', phone: '9876543210', carNumber: 'MH12AB1234', carModel: 'Swift', carType: 'Hatchback', packageName: 'Basic Wash', amount: 499, status: 'Confirmed' },
  ])

  // Base time slots (45 min each, 6 AM to 6 PM)
  const baseTimeSlots = [
    { id: 1, time: '06:00 - 06:45' },
    { id: 2, time: '06:45 - 07:30' },
    { id: 3, time: '07:30 - 08:15' },
    { id: 4, time: '08:15 - 09:00' },
    { id: 5, time: '09:00 - 09:45' },
    { id: 6, time: '09:45 - 10:30' },
    { id: 7, time: '10:30 - 11:15' },
    { id: 8, time: '11:15 - 12:00' },
    { id: 9, time: '12:00 - 12:45' },
    { id: 10, time: '12:45 - 13:30' },
    { id: 11, time: '13:30 - 14:15' },
    { id: 12, time: '14:15 - 15:00' },
    { id: 13, time: '15:00 - 15:45' },
    { id: 14, time: '15:45 - 16:30' },
    { id: 15, time: '16:30 - 17:15' },
    { id: 16, time: '17:15 - 18:00' },
  ]

  // Get time slots with availability based on selected date
  const getTimeSlotsForDate = (date) => {
    return baseTimeSlots.map(slot => {
      const booking = bookings.find(b => b.date === date && b.slotId === slot.id)
      return {
        ...slot,
        available: !booking,
        bookedBy: booking?.customerName || null,
        booking: booking || null
      }
    })
  }

  const timeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : baseTimeSlots.map(s => ({ ...s, available: true }))

  // Packages with pricing
  const packages = [
    { id: 1, name: 'Basic Wash', description: 'Exterior wash, Interior vacuum, Dashboard cleaning', prices: { Hatchback: 499, Sedan: 599, SUV: 699, XUV: 799 } },
    { id: 2, name: 'Premium Wash', description: 'Basic + Tyre polish, Glass cleaning, Air freshener', prices: { Hatchback: 699, Sedan: 799, SUV: 999, XUV: 1199 } },
    { id: 3, name: 'Deluxe Wash', description: 'Premium + Wax polish, Engine cleaning, Seat shampooing', prices: { Hatchback: 999, Sedan: 1199, SUV: 1399, XUV: 1599 } },
    { id: 4, name: 'Ultimate Wash', description: 'Deluxe + Ceramic coating, Leather conditioning, Full detailing', prices: { Hatchback: 1499, Sedan: 1699, SUV: 1999, XUV: 2299 } },
  ]

  const carTypes = ['Hatchback', 'Sedan', 'SUV', 'XUV']
  const today = new Date().toISOString().split('T')[0]

  const getSelectedCustomerData = () => {
    if (isNewCustomer) {
      return { name: newCustomer.name, phone: newCustomer.phone, carNumber: newCustomer.carNumber, carModel: newCustomer.carModel }
    }
    return customers.find(c => c.id === parseInt(selectedCustomer))
  }

  const getPrice = () => {
    if (!selectedPackage || !carType) return 0
    const pkg = packages.find(p => p.id === selectedPackage)
    return pkg?.prices[carType] || 0
  }

  const handleBooking = () => {
    // Validate date is not in the past
    if (selectedDate < today) {
      alert('Cannot book for past dates. Please select today or a future date.')
      return
    }

    const customerData = getSelectedCustomerData()
    const pkg = packages.find(p => p.id === selectedPackage)

    const newBooking = {
      id: Date.now(),
      date: selectedDate,
      slotId: selectedSlot.id,
      slotTime: selectedSlot.time,
      customerName: customerData.name,
      phone: customerData.phone,
      carNumber: customerData.carNumber,
      carModel: customerData.carModel || carType,
      carType: carType,
      packageName: pkg.name,
      amount: getPrice(),
      status: 'Confirmed'
    }

    setBookings([...bookings, newBooking])
    setBookingSuccess(true)

    setTimeout(() => {
      setStep(1)
      setSelectedDate('')
      setSelectedSlot(null)
      setSelectedPackage(null)
      setCarType('')
      setSelectedCustomer('')
      setIsNewCustomer(false)
      setNewCustomer({ name: '', phone: '', address: '', carCompany: '', carModel: '', carNumber: '', package: 'Basic', frequency: 'Weekly Once', serviceDay: [] })
      setBookingSuccess(false)
    }, 2000)
  }

  const cancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.filter(b => b.id !== bookingId))
    }
  }

  // Get bookings for view date
  const filteredBookings = bookings.filter(b => b.date === viewDate).sort((a, b) => a.slotId - b.slotId)
  const todayBookings = bookings.filter(b => b.date === today)
  const upcomingBookings = bookings.filter(b => b.date > today)

  const canProceedStep1 = selectedDate && selectedSlot && selectedDate >= today
  const canProceedStep2 = (isNewCustomer ? (newCustomer.name && newCustomer.phone && newCustomer.address && newCustomer.carCompany && newCustomer.carModel && newCustomer.carNumber) : selectedCustomer) && carType
  const canProceedStep3 = selectedPackage

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Book Service Slot</h2>
          <p style={{ color: '#666', margin: 0 }}>Schedule car wash appointment</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${view === 'book' ? 'btn-primary' : ''}`}
            onClick={() => setView('book')}
          >
            <Calendar size={18} /> Book Slot
          </button>
          <button
            className={`btn ${view === 'list' ? 'btn-primary' : ''}`}
            onClick={() => setView('list')}
          >
            <List size={18} /> View Bookings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#1976d2' }}>{todayBookings.length}</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.85rem' }}>Today's Bookings</p>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#4caf50' }}>{upcomingBookings.length}</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.85rem' }}>Upcoming</p>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#ff9800' }}>{16 - todayBookings.length}</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.85rem' }}>Slots Available Today</p>
        </div>
        <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#9c27b0' }}>₹{todayBookings.reduce((sum, b) => sum + b.amount, 0)}</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.85rem' }}>Today's Revenue</p>
        </div>
      </div>

      {/* VIEW BOOKINGS */}
      {view === 'list' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title"><List size={20} /> Booked Slots</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', color: '#666' }}>Select Date:</label>
              <input
                type="date"
                className="form-control"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                style={{ width: '160px', padding: '8px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px', padding: '10px 15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <strong>{formatDate(viewDate)}</strong> - {filteredBookings.length} bookings
          </div>

          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <Calendar size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>No bookings for this date</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Time Slot</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Vehicle</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Package</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="#1976d2" />
                        <strong>{booking.slotTime}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div><strong>{booking.customerName}</strong></div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}><Phone size={12} /> {booking.phone}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div>{booking.carNumber}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{booking.carModel} ({booking.carType})</div>
                    </td>
                    <td style={{ padding: '12px' }}>{booking.packageName}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1976d2' }}>₹{booking.amount}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-success">{booking.status}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => cancelBooking(booking.id)}
                        style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px' }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Daily Slot Overview */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ marginBottom: '15px', color: '#1e3a5f' }}>Slot Overview - {formatDate(viewDate)}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
              {getTimeSlotsForDate(viewDate).map(slot => (
                <div
                  key={slot.id}
                  style={{
                    padding: '10px 5px',
                    borderRadius: '8px',
                    background: slot.available ? '#e8f5e9' : '#ffebee',
                    border: `1px solid ${slot.available ? '#4caf50' : '#f44336'}`,
                    textAlign: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{slot.time.split(' - ')[0]}</div>
                  <div style={{ color: slot.available ? '#4caf50' : '#c62828', marginTop: '4px' }}>
                    {slot.available ? 'Free' : 'Booked'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOOK SLOT FORM */}
      {view === 'book' && (
        <>
          {/* Progress Steps */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {[1, 2, 3, 4].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: step >= s ? '#1976d2' : '#e0e0e0',
                    color: step >= s ? 'white' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>
                    {step > s ? <Check size={20} /> : s}
                  </div>
                  {i < 3 && (
                    <div style={{
                      width: '60px',
                      height: '3px',
                      background: step > s ? '#1976d2' : '#e0e0e0',
                      margin: '0 5px'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '30px' }}>
            <span style={{ color: step >= 1 ? '#1976d2' : '#666', fontSize: '0.85rem', width: '80px', textAlign: 'center' }}>Date & Time</span>
            <span style={{ color: step >= 2 ? '#1976d2' : '#666', fontSize: '0.85rem', width: '80px', textAlign: 'center' }}>Customer</span>
            <span style={{ color: step >= 3 ? '#1976d2' : '#666', fontSize: '0.85rem', width: '80px', textAlign: 'center' }}>Package</span>
            <span style={{ color: step >= 4 ? '#1976d2' : '#666', fontSize: '0.85rem', width: '80px', textAlign: 'center' }}>Confirm</span>
          </div>

          {/* Success Message */}
          {bookingSuccess && (
            <div style={{
              background: '#e8f5e9',
              border: '1px solid #4caf50',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <Check size={60} color="#4caf50" style={{ marginBottom: '15px' }} />
              <h3 style={{ color: '#2e7d32', margin: '0 0 10px' }}>Booking Confirmed!</h3>
              <p style={{ color: '#666', margin: 0 }}>Appointment has been scheduled successfully.</p>
            </div>
          )}

          {!bookingSuccess && (
            <>
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><Calendar size={20} /> Select Date & Time Slot</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                        min={today}
                        style={{ padding: '12px', fontSize: '1rem' }}
                      />
                      {selectedDate && selectedDate >= today && (
                        <p style={{ color: '#1976d2', marginTop: '10px', fontSize: '0.9rem' }}>
                          Selected: {formatDate(selectedDate)}
                        </p>
                      )}
                      {selectedDate && selectedDate < today && (
                        <p style={{ color: '#c62828', marginTop: '10px', fontSize: '0.9rem', background: '#ffebee', padding: '8px 12px', borderRadius: '6px' }}>
                          Cannot book for past dates. Please select today or a future date.
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Time Slot (45 min)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {timeSlots.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && setSelectedSlot(slot)}
                            disabled={!slot.available}
                            style={{
                              padding: '12px 8px',
                              border: selectedSlot?.id === slot.id ? '2px solid #1976d2' : '1px solid #ddd',
                              borderRadius: '8px',
                              background: !slot.available ? '#ffebee' : selectedSlot?.id === slot.id ? '#e3f2fd' : 'white',
                              color: !slot.available ? '#c62828' : '#333',
                              cursor: slot.available ? 'pointer' : 'not-allowed',
                              fontSize: '0.85rem',
                              textAlign: 'center'
                            }}
                          >
                            <Clock size={14} style={{ marginRight: '4px' }} />
                            {slot.time}
                            {!slot.available && (
                              <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>{slot.bookedBy}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      style={{ padding: '12px 30px' }}
                    >
                      Next: Customer Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Details */}
              {step === 2 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><User size={20} /> Customer Details</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button className={`btn ${!isNewCustomer ? 'btn-primary' : ''}`} onClick={() => setIsNewCustomer(false)}>
                      Existing Customer
                    </button>
                    <button className={`btn ${isNewCustomer ? 'btn-primary' : ''}`} onClick={() => setIsNewCustomer(true)}>
                      New Customer
                    </button>
                  </div>

                  {!isNewCustomer ? (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Customer</label>
                      <select
                        className="form-control"
                        value={selectedCustomer}
                        onChange={(e) => {
                          setSelectedCustomer(e.target.value)
                          const customer = customers.find(c => c.id === parseInt(e.target.value))
                          if (customer) setCarType(customer.carType)
                        }}
                        style={{ maxWidth: '400px' }}
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} - {c.carNumber} ({c.carModel})</option>
                        ))}
                      </select>

                      {selectedCustomer && (
                        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', maxWidth: '400px' }}>
                          {(() => {
                            const c = customers.find(c => c.id === parseInt(selectedCustomer))
                            return c && (
                              <>
                                <p style={{ margin: '0 0 8px' }}><strong>{c.name}</strong></p>
                                <p style={{ margin: '0 0 5px', color: '#666', fontSize: '0.9rem' }}><Phone size={14} /> {c.phone}</p>
                                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}><Car size={14} /> {c.carNumber} - {c.carModel} ({c.carType})</p>
                              </>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ maxWidth: '800px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label><User size={14} /> Customer Name *</label>
                          <input type="text" className="form-control" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="Enter name" required />
                        </div>
                        <div className="form-group">
                          <label><Phone size={14} /> WhatsApp Number *</label>
                          <input type="tel" className="form-control" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} placeholder="10 digit number" maxLength={10} required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label><MapPin size={14} /> Address *</label>
                        <input type="text" className="form-control" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} placeholder="Enter address" required />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label><Car size={14} /> Car Company *</label>
                          <input type="text" className="form-control" value={newCustomer.carCompany} onChange={(e) => setNewCustomer({ ...newCustomer, carCompany: e.target.value })} placeholder="e.g., Honda, Maruti" required />
                        </div>
                        <div className="form-group">
                          <label><Car size={14} /> Car Model *</label>
                          <input type="text" className="form-control" value={newCustomer.carModel} onChange={(e) => setNewCustomer({ ...newCustomer, carModel: e.target.value })} placeholder="e.g., City, Swift" required />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label><Car size={14} /> Car Number *</label>
                          <input type="text" className="form-control" value={newCustomer.carNumber} onChange={(e) => setNewCustomer({ ...newCustomer, carNumber: e.target.value.toUpperCase() })} placeholder="MH12AB1234" required />
                        </div>
                        <div className="form-group">
                          <label>Package *</label>
                          <select className="form-control" value={newCustomer.package} onChange={(e) => setNewCustomer({ ...newCustomer, package: e.target.value })}>
                            <option value="Basic">Basic</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Frequency *</label>
                        <select className="form-control" value={newCustomer.frequency} onChange={(e) => setNewCustomer({ ...newCustomer, frequency: e.target.value })} style={{ maxWidth: '300px' }}>
                          <option value="Weekly Once">Weekly Once</option>
                          <option value="Weekly Twice">Weekly Twice</option>
                          <option value="Monthly 4">Monthly 4 Visits</option>
                          <option value="Monthly 8">Monthly 8 Visits</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Service Days</label>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '10px',
                          marginTop: '8px'
                        }}>
                          {daysOfWeek.map((day) => (
                            <label key={day} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              background: Array.isArray(newCustomer.serviceDay) && newCustomer.serviceDay.includes(day) ? '#e3f2fd' : 'white',
                              transition: 'all 0.2s'
                            }}>
                              <input
                                type="checkbox"
                                checked={Array.isArray(newCustomer.serviceDay) && newCustomer.serviceDay.includes(day)}
                                onChange={() => handleDayToggle(day)}
                                style={{ cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.9rem' }}>{day.substring(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Car Type *</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {carTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => setCarType(type)}
                          style={{
                            padding: '12px 20px',
                            border: carType === type ? '2px solid #1976d2' : '1px solid #ddd',
                            borderRadius: '8px',
                            background: carType === type ? '#e3f2fd' : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn" onClick={() => setStep(1)} style={{ padding: '12px 30px' }}>Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!canProceedStep2} style={{ padding: '12px 30px' }}>
                      Next: Select Package
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Package Selection */}
              {step === 3 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><Package size={20} /> Select Package</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {packages.map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        style={{
                          padding: '20px',
                          border: selectedPackage === pkg.id ? '2px solid #1976d2' : '1px solid #ddd',
                          borderRadius: '12px',
                          background: selectedPackage === pkg.id ? '#e3f2fd' : 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 8px', color: '#1e3a5f' }}>{pkg.name}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{pkg.description}</p>
                          </div>
                          <div style={{
                            background: selectedPackage === pkg.id ? '#1976d2' : '#f5f5f5',
                            color: selectedPackage === pkg.id ? 'white' : '#1976d2',
                            padding: '8px 15px',
                            borderRadius: '20px',
                            fontWeight: '600'
                          }}>
                            ₹{carType ? pkg.prices[carType] : pkg.prices.Hatchback}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn" onClick={() => setStep(2)} style={{ padding: '12px 30px' }}>Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!canProceedStep3} style={{ padding: '12px 30px' }}>
                      Next: Confirm Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><Check size={20} /> Confirm Booking</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                      <h4 style={{ margin: '0 0 20px', color: '#1e3a5f' }}>Booking Summary</h4>

                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#666', fontSize: '0.85rem' }}>Date & Time</span>
                        <p style={{ margin: '5px 0 0', fontWeight: '500' }}>
                          <Calendar size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
                          {formatDate(selectedDate)}
                        </p>
                        <p style={{ margin: '5px 0 0', fontWeight: '500' }}>
                          <Clock size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
                          {selectedSlot?.time}
                        </p>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#666', fontSize: '0.85rem' }}>Customer</span>
                        <p style={{ margin: '5px 0 0', fontWeight: '500' }}>
                          <User size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
                          {getSelectedCustomerData()?.name}
                        </p>
                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          <Phone size={14} style={{ marginRight: '8px' }} />
                          {getSelectedCustomerData()?.phone}
                        </p>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <span style={{ color: '#666', fontSize: '0.85rem' }}>Vehicle</span>
                        <p style={{ margin: '5px 0 0', fontWeight: '500' }}>
                          <Car size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
                          {getSelectedCustomerData()?.carNumber} - {getSelectedCustomerData()?.carModel || carType}
                        </p>
                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>Type: {carType}</p>
                      </div>

                      <div>
                        <span style={{ color: '#666', fontSize: '0.85rem' }}>Package</span>
                        <p style={{ margin: '5px 0 0', fontWeight: '500' }}>
                          <Package size={16} style={{ marginRight: '8px', color: '#1976d2' }} />
                          {packages.find(p => p.id === selectedPackage)?.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div style={{
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        padding: '30px',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: '0 0 10px', opacity: 0.9 }}>Total Amount</p>
                        <h2 style={{ margin: '0 0 20px', fontSize: '3rem' }}>₹{getPrice()}</h2>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                          {packages.find(p => p.id === selectedPackage)?.name} - {carType}
                        </p>
                      </div>

                      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
                        <p style={{ margin: 0, color: '#e65100', fontSize: '0.9rem' }}>
                          <strong>Note:</strong> Payment to be collected at the time of service.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn" onClick={() => setStep(3)} style={{ padding: '12px 30px' }}>Back</button>
                    <button className="btn btn-success" onClick={handleBooking} style={{ padding: '12px 40px', fontSize: '1.1rem' }}>
                      <Check size={20} /> Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default BookSlot
