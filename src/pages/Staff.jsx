import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Phone, MapPin, FileText, Image, ChevronDown, Users, Eye } from 'lucide-react'

function Staff() {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [viewingStaff, setViewingStaff] = useState(null)

  // Sample customers list (in real app, this would come from customer state/API)
  const availableCustomers = [
    { id: 1, name: 'Rahul Sharma', carNumber: 'MH01AB1234' },
    { id: 2, name: 'Priya Patel', carNumber: 'MH02CD5678' },
    { id: 3, name: 'Amit Kumar', carNumber: 'MH12EF9012' },
    { id: 4, name: 'Vikram Singh', carNumber: 'MH03GH3456' },
  ]

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Ramesh Kumar',
      phone: '9876543220',
      address: '101, Worker Colony, Mumbai',
      aadhar: '1234-5678-9012',
      hasElectricBill: true,
      hasDrivingLicense: true,
      hasPhoto: true,
      joiningDate: '2023-01-15',
      status: 'Active',
      area: 'Andheri East',
      allocatedCustomers: [1, 2]
    },
    {
      id: 2,
      name: 'Suresh Yadav',
      phone: '9876543221',
      address: '202, Labor Nagar, Mumbai',
      aadhar: '2345-6789-0123',
      hasElectricBill: true,
      hasDrivingLicense: false,
      hasPhoto: true,
      joiningDate: '2023-03-20',
      status: 'Active',
      area: 'Bandra West',
      allocatedCustomers: [3]
    },
    {
      id: 3,
      name: 'Mohan Singh',
      phone: '9876543222',
      address: '303, Staff Quarters, Thane',
      aadhar: '3456-7890-1234',
      hasElectricBill: true,
      hasDrivingLicense: true,
      hasPhoto: true,
      joiningDate: '2023-06-10',
      status: 'Active',
      area: 'Thane Central',
      allocatedCustomers: [4]
    },
    {
      id: 4,
      name: 'Vijay Sharma',
      phone: '9876543223',
      address: '404, Worker Lane, Mumbai',
      aadhar: '4567-8901-2345',
      hasElectricBill: false,
      hasDrivingLicense: true,
      hasPhoto: true,
      joiningDate: '2024-01-05',
      status: 'On Leave',
      area: 'Powai',
      allocatedCustomers: []
    },
  ])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    aadhar: '',
    hasElectricBill: false,
    hasDrivingLicense: false,
    hasPhoto: false,
    area: '',
    allocatedCustomers: []
  })

  const handleCustomerToggle = (customerId) => {
    const currentCustomers = Array.isArray(formData.allocatedCustomers) ? formData.allocatedCustomers : []
    if (currentCustomers.includes(customerId)) {
      setFormData({ ...formData, allocatedCustomers: currentCustomers.filter(id => id !== customerId) })
    } else {
      setFormData({ ...formData, allocatedCustomers: [...currentCustomers, customerId] })
    }
  }

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEditMode) {
      // Update existing staff
      setStaff(staff.map(s =>
        s.id === editingStaffId ? { ...formData, id: editingStaffId, joiningDate: s.joiningDate, status: s.status } : s
      ))
    } else {
      // Add new staff
      const newStaff = {
        ...formData,
        id: staff.length + 1,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
      setStaff([...staff, newStaff])
    }

    // Reset form and close modal
    setShowModal(false)
    setIsEditMode(false)
    setEditingStaffId(null)
    setShowCustomerDropdown(false)
    setFormData({
      name: '',
      phone: '',
      address: '',
      aadhar: '',
      hasElectricBill: false,
      hasDrivingLicense: false,
      hasPhoto: false,
      area: '',
      allocatedCustomers: []
    })
  }

  const handleEdit = (member) => {
    setIsEditMode(true)
    setEditingStaffId(member.id)
    setFormData({
      name: member.name,
      phone: member.phone,
      address: member.address,
      aadhar: member.aadhar,
      hasElectricBill: member.hasElectricBill,
      hasDrivingLicense: member.hasDrivingLicense,
      hasPhoto: member.hasPhoto,
      area: member.area || '',
      allocatedCustomers: member.allocatedCustomers || []
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setIsEditMode(false)
    setEditingStaffId(null)
    setShowCustomerDropdown(false)
    setFormData({
      name: '',
      phone: '',
      address: '',
      aadhar: '',
      hasElectricBill: false,
      hasDrivingLicense: false,
      hasPhoto: false,
      area: '',
      allocatedCustomers: []
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== id))
    }
  }

  const handleView = (member) => {
    setViewingStaff(member)
    setShowViewDialog(true)
  }

  return (
    <div>
      <div className="page-header">
        <h2>Staff Management</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={20} color="#666" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="form-control"
              style={{ width: '300px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ color: '#666' }}>{filteredStaff.length} staff members</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Staff Info</th>
                <th>Contact</th>
                <th>Area</th>
                <th>Allocated Customers</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => {
                return (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.name}</strong>
                      <br />
                      <small style={{ color: '#666' }}>
                        <MapPin size={12} /> {member.address}
                      </small>
                    </td>
                    <td>
                      <Phone size={14} style={{ marginRight: '5px' }} />
                      {member.phone}
                    </td>
                    <td>
                      <span style={{ color: '#2196f3', fontWeight: '500' }}>
                        {member.area || '-'}
                      </span>
                    </td>
                    <td>
                      {member.allocatedCustomers && member.allocatedCustomers.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users size={14} color="#4caf50" />
                          <span style={{ fontSize: '0.85rem' }}>
                            {member.allocatedCustomers.length} customer{member.allocatedCustomers.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>No customers</span>
                      )}
                    </td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span
                        title="Aadhar"
                        style={{
                          color: member.aadhar ? '#4caf50' : '#ccc',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={18} />
                      </span>
                      <span
                        title="Electric Bill"
                        style={{
                          color: member.hasElectricBill ? '#4caf50' : '#ccc',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={18} />
                      </span>
                      <span
                        title="Driving License"
                        style={{
                          color: member.hasDrivingLicense ? '#4caf50' : '#ccc',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={18} />
                      </span>
                      <span
                        title="Photo"
                        style={{
                          color: member.hasPhoto ? '#4caf50' : '#ccc',
                          cursor: 'pointer'
                        }}
                      >
                        <Image size={18} />
                      </span>
                    </div>
                  </td>
                  <td>{member.joiningDate}</td>
                  <td>
                    <span className={`badge ${member.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {member.status}
                    </span>
                  </td>
                    <td>
                      {member.allocatedCustomers && member.allocatedCustomers.length > 0 && (
                        <button
                          className="btn btn-sm"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleView(member)}
                          title="View Customers"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      <button className="btn btn-sm" style={{ marginRight: '5px' }} onClick={() => handleEdit(member)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

              <div className="form-group">
                <label>Aadhar Number *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234-5678-9012"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Allocate Area *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Andheri East, Bandra West"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Allocate Customers</label>
                <div style={{ position: 'relative' }}>
                  <div
                    className="form-control"
                    onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'white'
                    }}
                  >
                    <span style={{ color: formData.allocatedCustomers.length > 0 ? '#333' : '#999' }}>
                      {formData.allocatedCustomers.length > 0
                        ? `${formData.allocatedCustomers.length} customer(s) selected`
                        : 'Select customers'}
                    </span>
                    <ChevronDown size={18} />
                  </div>
                  {showCustomerDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      marginTop: '5px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {availableCustomers.map((customer) => (
                        <label
                          key={customer.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 15px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            background: formData.allocatedCustomers.includes(customer.id) ? '#e3f2fd' : 'white',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = formData.allocatedCustomers.includes(customer.id) ? '#e3f2fd' : 'white'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.allocatedCustomers.includes(customer.id)}
                            onChange={() => handleCustomerToggle(customer.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{customer.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{customer.carNumber}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Documents</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.hasElectricBill}
                      onChange={(e) => setFormData({ ...formData, hasElectricBill: e.target.checked })}
                    />
                    Electric Bill
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.hasDrivingLicense}
                      onChange={(e) => setFormData({ ...formData, hasDrivingLicense: e.target.checked })}
                    />
                    Driving License
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.hasPhoto}
                      onChange={(e) => setFormData({ ...formData, hasPhoto: e.target.checked })}
                    />
                    Photo
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Details Dialog */}
      {showViewDialog && viewingStaff && (
        <div className="modal-overlay" onClick={() => setShowViewDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Allocated Customers - {viewingStaff.name}</h3>
              <button className="modal-close" onClick={() => setShowViewDialog(false)}>&times;</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Staff Name</label>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{viewingStaff.name}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Area</label>
                    <div style={{ fontWeight: '600', fontSize: '1rem', color: '#2196f3' }}>
                      {viewingStaff.area || '-'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Phone</label>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{viewingStaff.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#4caf50" />
                  Allocated Customers ({viewingStaff.allocatedCustomers?.length || 0})
                </h4>

                {viewingStaff.allocatedCustomers && viewingStaff.allocatedCustomers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {viewingStaff.allocatedCustomers.map((custId) => {
                      const customer = availableCustomers.find(c => c.id === custId)
                      if (!customer) return null
                      return (
                        <div
                          key={custId}
                          style={{
                            padding: '15px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            background: '#f9f9f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                          }}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#2196f3'
                          }}>
                            {customer.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>
                              {customer.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                              {customer.carNumber}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    No customers allocated
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() => setShowViewDialog(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Staff
