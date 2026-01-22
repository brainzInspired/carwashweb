import { useState, useEffect } from 'react'
import { QrCode, Download, Copy, Phone, MessageSquare, Check, RefreshCw, Upload, X, Image as ImageIcon } from 'lucide-react'

function QRGenerator() {
  // const [phoneNumber, setPhoneNumber] = useState('7709959881')
  const [phoneNumber, setPhoneNumber] = useState('7387512134')
  const [message, setMessage] = useState('Hello! I am interested in your car wash service.')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)

  // Payment QR state
  const [paymentQR, setPaymentQR] = useState(null)
  const [paymentQRPreview, setPaymentQRPreview] = useState(null)

  // Generate QR Code URL using Google Charts API (free)
  const generateQRCode = () => {
    const waLink = `https://wa.me/91${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(waLink)}`
    setQrCodeUrl(qrApiUrl)
  }

  useEffect(() => {
    generateQRCode()
  }, [])

  const getWhatsAppLink = () => {
    return `https://wa.me/91${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  }

  const copyLink = () => {
    navigator.clipboard.writeText(getWhatsAppLink())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `whatsapp-qr-${phoneNumber}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle payment QR upload
  const handlePaymentQRUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Store the file
      setPaymentQR(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentQRPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove payment QR
  const removePaymentQR = () => {
    setPaymentQR(null)
    setPaymentQRPreview(null)
  }

  // Download payment QR
  const downloadPaymentQR = () => {
    if (paymentQRPreview) {
      const link = document.createElement('a')
      link.href = paymentQRPreview
      link.download = 'payment-qr.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Preset messages
  const presetMessages = [
    'Hello! I am interested in your car wash service.',
    'Hi! I want to book a car wash appointment.',
    'Hello! Can you tell me about your packages?',
    'Hi! I need to schedule a car wash for tomorrow.',
    'Hello! What are your service timings?',
  ]

  return (
    <div>
      <div className="page-header">
        <h2>WhatsApp QR Code Generator</h2>
        <p style={{ color: '#666', margin: 0 }}>Generate QR code for customers to contact you</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">QR Code Settings</h3>
          </div>

          <div className="form-group">
            <label><Phone size={16} style={{ marginRight: '8px' }} />Business WhatsApp Number</label>
            <input
              type="tel"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10 digit number"
              maxLength={10}
            />
            <small style={{ color: '#666' }}>This is the number customers will message</small>
          </div>

          <div className="form-group">
            <label><MessageSquare size={16} style={{ marginRight: '8px' }} />Pre-filled Message</label>
            <textarea
              className="form-control"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message that will be pre-filled when customer scans"
            />
          </div>

          <div className="form-group">
            <label>Quick Messages</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {presetMessages.map((msg, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${message === msg ? 'btn-primary' : ''}`}
                  onClick={() => setMessage(msg)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {msg.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={generateQRCode} style={{ width: '100%' }}>
            <RefreshCw size={18} /> Generate QR Code
          </button>
        </div>

        {/* QR Code Display */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-header">
            <h3 className="card-title">Generated QR Code</h3>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            display: 'inline-block',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            margin: '20px auto'
          }}>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="WhatsApp QR Code"
                style={{ width: '250px', height: '250px' }}
              />
            ) : (
              <div style={{
                width: '250px',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <QrCode size={64} color="#ccc" />
              </div>
            )}
          </div>

          <p style={{ color: '#666', marginBottom: '20px' }}>
            Scan this QR code to start a WhatsApp chat with<br />
            <strong style={{ color: '#25D366', fontSize: '1.2rem' }}>+91 {phoneNumber}</strong>
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={downloadQR}>
              <Download size={18} /> Download QR
            </button>
            <button className="btn" onClick={copyLink}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Link Preview */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">WhatsApp Link</h3>
        </div>
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          wordBreak: 'break-all'
        }}>
          {getWhatsAppLink()}
        </div>
        <p style={{ color: '#666', marginTop: '10px', fontSize: '0.85rem' }}>
          Share this link on your website, social media, or business cards. When clicked, it opens WhatsApp with your number and pre-filled message.
        </p>
      </div>

      {/* Payment QR Upload Section */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Payment QR Code</h3>
          <p style={{ color: '#666', margin: '4px 0 0', fontSize: '0.85rem' }}>Upload your payment QR code to send with WhatsApp messages</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: paymentQRPreview ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Upload Section */}
          <div>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              background: '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#1976d2'; e.currentTarget.style.background = '#e3f2fd'; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = '#fafafa'; }}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = '#fafafa'; handlePaymentQRUpload({ target: { files: e.dataTransfer.files } }); }}
            onClick={() => document.getElementById('paymentQRInput').click()}
            >
              <Upload size={48} color="#1976d2" style={{ marginBottom: '15px' }} />
              <h4 style={{ margin: '0 0 8px', color: '#1e3a5f' }}>Upload Payment QR Code</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px' }}>
                Click to browse or drag and drop your payment QR image
              </p>
              <p style={{ color: '#999', fontSize: '0.8rem', margin: 0 }}>
                Supports: JPG, PNG, JPEG (Max 5MB)
              </p>
              <input
                id="paymentQRInput"
                type="file"
                accept="image/*"
                onChange={handlePaymentQRUpload}
                style={{ display: 'none' }}
              />
            </div>

            {paymentQRPreview && (
              <div style={{ marginTop: '15px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Check size={20} color="#4caf50" />
                  <strong style={{ color: '#2e7d32' }}>Payment QR Uploaded Successfully</strong>
                </div>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                  This QR code will be sent along with WhatsApp reminder messages to customers for payment.
                </p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {paymentQRPreview && (
            <div style={{ textAlign: 'center' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#1e3a5f' }}>Preview</label>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <button
                  onClick={removePaymentQR}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <X size={16} />
                </button>
                <img
                  src={paymentQRPreview}
                  alt="Payment QR Code"
                  style={{
                    maxWidth: '250px',
                    maxHeight: '250px',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={downloadPaymentQR}>
                  <Download size={18} /> Download
                </button>
                <button className="btn" onClick={() => document.getElementById('paymentQRInput').click()}>
                  <Upload size={18} /> Replace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">How to Use</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ color: '#1976d2', marginBottom: '8px' }}>Print & Display</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Download the QR code and print it. Display at your car wash shop, on flyers, or business cards.
            </p>
          </div>
          <div style={{ padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
            <h4 style={{ color: '#388e3c', marginBottom: '8px' }}>Share Online</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Share the WhatsApp link on your website, Facebook, Instagram, or Google Business profile.
            </p>
          </div>
          <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
            <h4 style={{ color: '#f57c00', marginBottom: '8px' }}>Customer Scan</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Customers scan the QR code with their phone camera and it opens WhatsApp chat with you directly.
            </p>
          </div>
          <div style={{ padding: '15px', background: '#f3e5f5', borderRadius: '8px' }}>
            <h4 style={{ color: '#7b1fa2', marginBottom: '8px' }}>Payment QR with Messages</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Upload your payment QR code. It will be automatically sent with WhatsApp reminder messages to customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator
