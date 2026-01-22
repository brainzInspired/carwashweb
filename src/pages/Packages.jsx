import { Check, Star } from 'lucide-react'

function Packages() {
  const packages = [
    {
      id: 1,
      name: 'Basic',
      type: 'basic',
      description: 'Weekly Once Service',
      features: ['Vacuum Cleaning', 'Greasing', 'Tyre Cleaning', 'Dash Polish'],
      prices: {
        'Monthly 4 Visits': {
          'Sedan/Hatchback/SUV Small': 499,
          'XUV': 699
        },
        'Monthly 8 Visits': {
          'Sedan/Hatchback/SUV Small': 999,
          'XUV': 1399
        }
      }
    },
    {
      id: 2,
      name: 'Premium',
      type: 'premium',
      description: 'Complete Care Package',
      features: ['Vacuum Cleaning', 'Greasing', 'Tyre Cleaning', 'Dash Polish', 'Perfume Spray', 'All Time Care'],
      prices: {
        'Monthly 4 Visits': {
          'Sedan/Hatchback/SUV Small': 699,
          'XUV': 900
        },
        'Monthly 8 Visits': {
          'Sedan/Hatchback/SUV Small': 1200,
          'XUV': 1400
        }
      }
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h2>Packages & Pricing</h2>
      </div>

      <div className="package-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className={`package-header ${pkg.type}`}>
              {pkg.type === 'premium' && <Star size={24} style={{ marginBottom: '8px' }} />}
              <h3>{pkg.name} Package</h3>
              <p>{pkg.description}</p>
            </div>
            <div className="package-body">
              <h4 style={{ marginBottom: '16px', color: '#1e3a5f' }}>Services Included:</h4>
              <ul className="package-features">
                {pkg.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={18} color="#4caf50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-header">
          <h3 className="card-title">Pricing Chart</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Package</th>
                <th>Frequency</th>
                <th>Sedan / Hatchback / SUV Small</th>
                <th>XUV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2}><span className="badge badge-success">Basic</span></td>
                <td>Monthly 4 Visits</td>
                <td><strong>₹499</strong></td>
                <td><strong>₹699</strong></td>
              </tr>
              <tr>
                <td>Monthly 8 Visits</td>
                <td><strong>₹999</strong></td>
                <td><strong>₹1,399</strong></td>
              </tr>
              <tr>
                <td rowSpan={2}><span className="badge badge-info">Premium</span></td>
                <td>Monthly 4 Visits</td>
                <td><strong>₹699</strong></td>
                <td><strong>₹900</strong></td>
              </tr>
              <tr>
                <td>Monthly 8 Visits</td>
                <td><strong>₹1,200</strong></td>
                <td><strong>₹1,400</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Car Type Classification</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '10px 0' }}>
          <div>
            <h4 style={{ color: '#1e3a5f', marginBottom: '10px' }}>Sedan / Hatchback / SUV Small</h4>
            <ul style={{ color: '#666', paddingLeft: '20px' }}>
              <li>Maruti Swift, Baleno, Dzire</li>
              <li>Honda City, Amaze</li>
              <li>Hyundai i20, Verna, Venue</li>
              <li>Tata Tiago, Altroz, Nexon</li>
              <li>Kia Sonet, Seltos</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#1e3a5f', marginBottom: '10px' }}>XUV (Large SUVs)</h4>
            <ul style={{ color: '#666', paddingLeft: '20px' }}>
              <li>Mahindra XUV700, Scorpio, Thar</li>
              <li>Toyota Fortuner, Innova</li>
              <li>Hyundai Creta, Alcazar</li>
              <li>Tata Harrier, Safari</li>
              <li>MG Hector, Gloster</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Packages
