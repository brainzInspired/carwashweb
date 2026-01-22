import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Phone, MapPin, Car } from 'lucide-react'

function Customers() {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      whatsapp: '9876543210',
      address: '123, MG Road, Mumbai',
      carModel: 'Honda City',
      carCompany: 'Honda',
      carNumber: 'MH01AB1234',
      carType: 'Sedan',
      package: 'Premium',
      frequency: 'Weekly Twice',
      serviceDay: 'Mon, Thu',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Priya Patel',
      whatsapp: '9876543211',
      address: '456, Park Street, Mumbai',
      carModel: 'Swift',
      carCompany: 'Maruti',
      carNumber: 'MH02CD5678',
      carType: 'Hatchback',
      package: 'Basic',
      frequency: 'Weekly Once',
      serviceDay: 'Tuesday',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      whatsapp: '9876543212',
      address: '789, Lake View, Pune',
      carModel: 'Creta',
      carCompany: 'Hyundai',
      carNumber: 'MH12EF9012',
      carType: 'SUV Small',
      package: 'Premium',
      frequency: 'Weekly Twice',
      serviceDay: 'Wed, Sat',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      whatsapp: '9876543214',
      address: '321, Hill Road, Mumbai',
      carModel: 'XUV700',
      carCompany: 'Mahindra',
      carNumber: 'MH03GH3456',
      carType: 'XUV',
      package: 'Premium',
      frequency: 'Monthly 8',
      serviceDay: 'Mon, Wed, Fri',
      status: 'Active'
    },
  ])

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    carModel: '',
    carCompany: '',
    carNumber: '',
    carType: 'Sedan',
    package: 'Basic',
    frequency: 'Weekly Once',
    serviceDay: []
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleDayToggle = (day) => {
    const currentDays = Array.isArray(formData.serviceDay) ? formData.serviceDay : []
    if (currentDays.includes(day)) {
      setFormData({ ...formData, serviceDay: currentDays.filter(d => d !== day) })
    } else {
      setFormData({ ...formData, serviceDay: [...currentDays, day] })
    }
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.whatsapp.includes(searchTerm)
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert serviceDay array to string for storage
    const serviceDayString = Array.isArray(formData.serviceDay)
      ? formData.serviceDay.join(', ')
      : formData.serviceDay

    const customerData = {
      ...formData,
      serviceDay: serviceDayString
    }

    if (isEditMode) {
      // Update existing customer
      setCustomers(customers.map(c =>
        c.id === editingCustomerId ? { ...customerData, id: editingCustomerId, status: c.status } : c
      ))
    } else {
      // Add new customer
      const newCustomer = {
        ...customerData,
        id: customers.length + 1,
        status: 'Active'
      }
      setCustomers([...customers, newCustomer])
    }

    // Reset form and close modal
    setShowModal(false)
    setIsEditMode(false)
    setEditingCustomerId(null)
    setFormData({
      name: '',
      whatsapp: '',
      address: '',
      carModel: '',
      carCompany: '',
      carNumber: '',
      carType: 'Sedan',
      package: 'Basic',
      frequency: 'Weekly Once',
      serviceDay: []
    })
  }

  const handleEdit = (customer) => {
    setIsEditMode(true)
    setEditingCustomerId(customer.id)

    // Convert serviceDay string to array for checkboxes
    const serviceDayArray = customer.serviceDay
      ? customer.serviceDay.split(',').map(day => day.trim())
      : []

    setFormData({
      name: customer.name,
      whatsapp: customer.whatsapp,
      address: customer.address,
      carModel: customer.carModel,
      carCompany: customer.carCompany,
      carNumber: customer.carNumber,
      carType: customer.carType,
      package: customer.package,
      frequency: customer.frequency,
      serviceDay: serviceDayArray
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setIsEditMode(false)
    setEditingCustomerId(null)
    setFormData({
      name: '',
      whatsapp: '',
      address: '',
      carModel: '',
      carCompany: '',
      carNumber: '',
      carType: 'Sedan',
      package: 'Basic',
      frequency: 'Weekly Once',
      serviceDay: []
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Customer Management</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={20} color="#666" />
            <input
              type="text"
              placeholder="Search by name, car number, or phone..."
              className="form-control"
              style={{ width: '300px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ color: '#666' }}>{filteredCustomers.length} customers</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Car Details</th>
                <th>Package</th>
                <th>Service Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>
                      <MapPin size={12} /> {customer.address}
                    </small>
                  </td>
                  <td>
                    <Phone size={14} style={{ marginRight: '5px' }} />
                    {customer.whatsapp}
                  </td>
                  <td>
                    <Car size={14} style={{ marginRight: '5px' }} />
                    {customer.carCompany} {customer.carModel}
                    <br />
                    <small style={{ color: '#666' }}>{customer.carNumber} | {customer.carType}</small>
                  </td>
                  <td>
                    <span className={`badge ${customer.package === 'Premium' ? 'badge-info' : 'badge-success'}`}>
                      {customer.package}
                    </span>
                  </td>
                  <td>
                    {customer.frequency}
                    <br />
                    <small style={{ color: '#666' }}>{customer.serviceDay}</small>
                  </td>
                  <td>
                    <span className={`badge ${customer.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm" style={{ marginRight: '5px' }} onClick={() => handleEdit(customer)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(customer.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Car Company *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Honda, Maruti"
                    value={formData.carCompany}
                    onChange={(e) => setFormData({ ...formData, carCompany: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Car Model *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., City, Swift"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Car Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., MH01AB1234"
                    value={formData.carNumber}
                    onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Car Type *</label>
                  <select
                    className="form-control"
                    value={formData.carType}
                    onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV Small">SUV Small</option>
                    <option value="XUV">XUV</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package *</label>
                  <select
                    className="form-control"
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequency *</label>
                  <select
                    className="form-control"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="Weekly Once">Weekly Once</option>
                    <option value="Weekly Twice">Weekly Twice</option>
                    <option value="Monthly 4">Monthly 4 Visits</option>
                    <option value="Monthly 8">Monthly 8 Visits</option>
                  </select>
                </div>
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
                      background: Array.isArray(formData.serviceDay) && formData.serviceDay.includes(day) ? '#e3f2fd' : 'white',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.serviceDay) && formData.serviceDay.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>{day.substring(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
