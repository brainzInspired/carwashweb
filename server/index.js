import express from 'express';
import cors from 'cors';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const { Client, LocalAuth } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Message History File
const HISTORY_FILE = path.join(process.cwd(), 'message_history.json');

// Load existing history or create empty array
const loadHistory = () => {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
  return [];
};

// Save history to file
const saveHistory = (history) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Add message to history
const addToHistory = (messageData) => {
  const history = loadHistory();
  history.unshift({
    id: Date.now(),
    ...messageData,
    sentAt: new Date().toISOString()
  });
  saveHistory(history);
  return history;
};

// WhatsApp Client
let qrCodeData = null;
let isReady = false;
let clientInfo = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Suppress browser console errors (like markedUnread)
client.on('message', async (msg) => {
  // Do nothing, just prevent errors from being logged
});

// QR Code Event
client.on('qr', (qr) => {
  qrCodeData = qr;
  console.log('\n📱 Scan this QR code in WhatsApp:\n');
  qrcode.generate(qr, { small: true });
});

// Ready Event
client.on('ready', async () => {
  isReady = true;
  clientInfo = client.info;
  console.log('\n✅ WhatsApp is ready!');
  console.log(`📞 Connected as: ${client.info.pushname} (${client.info.wid.user})`);

  // Suppress page errors from Puppeteer
  try {
    const pages = await client.pupBrowser.pages();
    if (pages && pages[0]) {
      const page = pages[0];

      // Suppress console errors from the browser page
      page.on('console', msg => {
        const text = msg.text();
        // Only log errors that are NOT the markedUnread error
        if (msg.type() === 'error' && !text.includes('markedUnread') && !text.includes('static.whatsapp.net')) {
          console.log('Browser Error:', text);
        }
      });

      // Suppress page errors
      page.on('pageerror', error => {
        if (!error.message.includes('markedUnread') && !error.message.includes('static.whatsapp.net')) {
          console.log('Page Error:', error.message);
        }
      });
    }
  } catch (err) {
    // Ignore errors in error suppression
  }
});

// Disconnected Event
client.on('disconnected', (reason) => {
  isReady = false;
  qrCodeData = null;
  console.log('❌ WhatsApp disconnected:', reason);
});

// Authentication Failure
client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

// Suppress harmless WhatsApp Web errors
process.on('unhandledRejection', (reason, promise) => {
  // Suppress the markedUnread error - it's harmless
  if (reason && reason.toString().includes('markedUnread')) {
    return; // Silently ignore this error
  }
  // Log other unhandled rejections
  console.error('Unhandled Rejection:', reason);
});

// Initialize WhatsApp
console.log('🚀 Starting WhatsApp client...');
client.initialize();

// ============ API ENDPOINTS ============

// Get WhatsApp Status
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    isReady,
    qrCode: qrCodeData,
    user: clientInfo ? {
      name: clientInfo.pushname,
      number: clientInfo.wid.user
    } : null
  });
});

// QR Code Image
app.get('/api/whatsapp/qr', async (req, res) => {
  if (isReady) {
    return res.send('<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#e8f5e9;"><h1 style="color:#4caf50;">✅ WhatsApp Connected!</h1></body></html>');
  }

  if (!qrCodeData) {
    return res.send('<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><h1>Loading QR Code... Please refresh in 5 seconds</h1></body></html>');
  }

  try {
    const qrImage = await QRCode.toDataURL(qrCodeData, { width: 400, margin: 2 });
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp QR Code</title>
        <meta http-equiv="refresh" content="20">
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
          }
          h1 {
            color: #25D366;
            margin-bottom: 10px;
          }
          p {
            color: #666;
            margin-bottom: 20px;
          }
          img {
            border: 4px solid #25D366;
            border-radius: 10px;
          }
          .steps {
            text-align: left;
            background: #f5f5f5;
            padding: 15px 20px;
            border-radius: 10px;
            margin-top: 20px;
          }
          .steps li {
            margin: 8px 0;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📱 WhatsApp QR Code</h1>
          <p>Scan this with your WhatsApp app</p>
          <img src="${qrImage}" alt="QR Code" />
          <div class="steps">
            <strong>Steps:</strong>
            <ol>
              <li>Open <b>WhatsApp</b> on your phone</li>
              <li>Tap <b>Menu ⋮</b> → <b>Linked Devices</b></li>
              <li>Tap <b>Link a Device</b></li>
              <li>Point camera at this QR code</li>
            </ol>
          </div>
          <p style="font-size:12px;color:#999;margin-top:15px;">Page auto-refreshes every 20 seconds</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Error generating QR code');
  }
});

// Send Message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!isReady) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp is not connected. Please scan QR code first.'
      });
    }

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    // Format phone number (add country code if not present)
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone; // India country code
    }

    const chatId = formattedPhone + '@c.us';

    // Send message - simple approach
    const result = await client.sendMessage(chatId, message);

    console.log(`✅ Message sent to ${phone}`);

    const messageId = result.id._serialized;

    // Save to history
    const { customerName, customerCar, serviceTime, serviceDate } = req.body;
    addToHistory({
      phone,
      message,
      customerName: customerName || 'Unknown',
      customerCar: customerCar || 'N/A',
      serviceTime: serviceTime || 'N/A',
      serviceDate: serviceDate || 'N/A',
      status: 'sent',
      messageId: messageId
    });

    res.json({
      success: true,
      messageId: messageId,
      to: phone,
      message: message
    });

  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send Bulk Messages
app.post('/api/whatsapp/send-bulk', async (req, res) => {
  try {
    const { messages } = req.body; // Array of { phone, message }

    if (!isReady) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp is not connected'
      });
    }

    const results = [];

    for (const item of messages) {
      try {
        let formattedPhone = item.phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) {
          formattedPhone = '91' + formattedPhone;
        }

        const chatId = formattedPhone + '@c.us';
        await client.sendMessage(chatId, item.message);

        results.push({
          phone: item.phone,
          success: true
        });

        // Delay between messages to avoid spam detection
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        results.push({
          phone: item.phone,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send Image Message
app.post('/api/whatsapp/send-image', async (req, res) => {
  try {
    const { phone, imageUrl, caption } = req.body;

    if (!isReady) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp is not connected. Please scan QR code first.'
      });
    }

    if (!phone || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and image URL are required'
      });
    }

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }

    const chatId = formattedPhone + '@c.us';

    // Check if number exists on WhatsApp
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        error: 'This number is not registered on WhatsApp'
      });
    }

    // Send image using MessageMedia from URL
    const { MessageMedia } = pkg;
    const media = await MessageMedia.fromUrl(imageUrl);
    const result = await client.sendMessage(chatId, media, { caption: caption || '' });

    console.log(`✅ Image sent to ${phone}`);

    // Save to history
    addToHistory({
      phone,
      message: `[Image] ${caption || 'Payment QR Code'}`,
      customerName: 'Customer',
      status: 'sent',
      messageId: result.id._serialized
    });

    res.json({
      success: true,
      messageId: result.id._serialized,
      to: phone
    });

  } catch (error) {
    console.error('❌ Error sending image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Message History
app.get('/api/whatsapp/history', (req, res) => {
  const history = loadHistory();
  res.json({
    success: true,
    total: history.length,
    messages: history
  });
});

// Clear History
app.delete('/api/whatsapp/history', (req, res) => {
  saveHistory([]);
  res.json({ success: true, message: 'History cleared' });
});

// Logout
app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    await client.logout();
    isReady = false;
    qrCodeData = null;
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🖥️  Server running at http://localhost:${PORT}`);
  console.log('📡 API Endpoints:');
  console.log('   GET  /api/whatsapp/status  - Check connection status');
  console.log('   GET  /api/whatsapp/qr      - View QR code in browser');
  console.log('   POST /api/whatsapp/send    - Send single message');
  console.log('   POST /api/whatsapp/send-bulk - Send bulk messages');
  console.log('   POST /api/whatsapp/logout  - Logout from WhatsApp\n');
});
