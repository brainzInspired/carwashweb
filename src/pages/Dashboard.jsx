import { Users, Car, Calendar, IndianRupee } from 'lucide-react'

function Dashboard() {
  const stats = [
    { icon: Users, label: 'Total Customers', value: '156', color: 'blue' },
    { icon: Car, label: 'Cars Serviced Today', value: '24', color: 'green' },
    { icon: Calendar, label: 'Pending Services', value: '12', color: 'orange' },
    { icon: IndianRupee, label: 'Revenue This Month', value: '45,600', color: 'purple' },
  ]

  const todaySchedule = [
    { time: '7:00 AM', customer: 'Rahul Sharma', car: 'Honda City', service: 'Weekly Wash' },
    { time: '7:45 AM', customer: 'Priya Patel', car: 'Maruti Swift', service: 'Weekly Wash' },
    { time: '8:30 AM', customer: 'Amit Kumar', car: 'Hyundai Creta', service: 'Premium Wash' },
    { time: '9:15 AM', customer: 'Sneha Gupta', car: 'Tata Nexon', service: 'Weekly Wash' },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p style={{ color: '#666' }}>Welcome to Car Wash Admin Panel</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Today's Schedule</h3>
          <button className="btn btn-primary btn-sm">View Full</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Service</th>
              </tr>
            </thead>
            <tbody>
              {todaySchedule.map((schedule, index) => (
                <tr key={index}>
                  <td><strong>{schedule.time}</strong></td>
                  <td>{schedule.customer}</td>
                  <td>{schedule.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
