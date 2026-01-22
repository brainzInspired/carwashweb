import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, delay } from '@whiskeysockets/baileys';
import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Message History File
const HISTORY_FILE = path.join(process.cwd(), 'message_history.json');

// Load existing history
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

// Save history
const saveHistory = (history) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Add to history
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

// WhatsApp State
let sock = null;
let qrCodeData = null;
let isReady = false;
let clientInfo = null;

// Logger - suppress most logs
const logger = pino({ level: 'silent' });

// Connect to WhatsApp
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./baileys_auth');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger
  });

  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // QR Code
    if (qr) {
      qrCodeData = qr;
      console.log('\n📱 Scan this QR code in WhatsApp:\n');
      qrcode.generate(qr, { small: true });
    }

    // Connection status
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Connection closed. Reconnecting...', shouldReconnect);
      isReady = false;
      qrCodeData = null;

      if (shouldReconnect) {
        await delay(3000);
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      isReady = true;
      qrCodeData = null;

      // Get user info
      if (sock.user) {
        clientInfo = {
          name: sock.user.name || 'Unknown',
          number: sock.user.id.split(':')[0]
        };
        console.log('\n✅ WhatsApp is ready!');
        console.log(`📞 Connected as: ${clientInfo.name} (${clientInfo.number})`);
      }
    }
  });

  // Save credentials when updated
  sock.ev.on('creds.update', saveCreds);
}

// Start WhatsApp connection
console.log('🚀 Starting WhatsApp client with Baileys...');
connectToWhatsApp();

// ============ API ENDPOINTS ============

// Get WhatsApp Status
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    isReady,
    qrCode: qrCodeData,
    user: clientInfo
  });
});

// Get QR Code as Image (for browser viewing)
app.get('/api/whatsapp/qr', async (req, res) => {
  if (!qrCodeData) {
    return res.send('<html><body><h2>No QR code available. WhatsApp may already be connected.</h2><p><a href="/api/whatsapp/status">Check Status</a></p></body></html>');
  }

  try {
    const qrImage = await QRCode.toDataURL(qrCodeData);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp QR Code</title>
        <meta http-equiv="refresh" content="20">
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
          .card { background: white; padding: 40px; border-radius: 20px; display: inline-block; box-shadow: 0 5px 30px rgba(0,0,0,0.1); }
          h1 { color: #25D366; margin: 0; }
          img { margin: 30px 0; border-radius: 10px; }
          .steps { text-align: left; display: inline-block; margin-top: 20px; }
          ol { padding-left: 20px; }
          li { margin: 10px 0; }
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

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }

    const jid = formattedPhone + '@s.whatsapp.net';

    // Send message using Baileys
    const result = await sock.sendMessage(jid, { text: message });

    console.log(`✅ Message sent successfully to ${phone}`);

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
      messageId: result.key.id
    });

    res.json({
      success: true,
      messageId: result.key.id,
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
    const { messages } = req.body;

    if (!isReady) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp is not connected'
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    const results = [];

    for (const msg of messages) {
      try {
        let formattedPhone = msg.phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) {
          formattedPhone = '91' + formattedPhone;
        }

        const jid = formattedPhone + '@s.whatsapp.net';
        const result = await sock.sendMessage(jid, { text: msg.message });

        results.push({
          phone: msg.phone,
          success: true,
          messageId: result.key.id
        });

        console.log(`✅ Bulk message sent to ${msg.phone}`);

        // Save to history
        addToHistory({
          phone: msg.phone,
          message: msg.message,
          customerName: msg.customerName || 'Unknown',
          customerCar: msg.customerCar || 'N/A',
          serviceTime: msg.serviceTime || 'N/A',
          serviceDate: msg.serviceDate || 'N/A',
          status: 'sent',
          messageId: result.key.id
        });

        // Delay between messages
        await delay(1000);

      } catch (error) {
        results.push({
          phone: msg.phone,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('❌ Error sending bulk messages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Message History
app.get('/api/whatsapp/history', (req, res) => {
  const history = loadHistory();
  res.json(history);
});

// Logout
app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }

    // Delete auth folder
    const authPath = path.join(process.cwd(), 'baileys_auth');
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
    }

    isReady = false;
    qrCodeData = null;
    clientInfo = null;

    console.log('🔓 Logged out successfully');

    res.json({ success: true, message: 'Logged out successfully' });

    // Reconnect after logout
    setTimeout(() => {
      connectToWhatsApp();
    }, 2000);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🖥️  Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET  /api/whatsapp/status  - Check connection status`);
  console.log(`   GET  /api/whatsapp/qr      - View QR code in browser`);
  console.log(`   POST /api/whatsapp/send    - Send single message`);
  console.log(`   POST /api/whatsapp/send-bulk - Send bulk messages`);
  console.log(`   POST /api/whatsapp/logout  - Logout from WhatsApp`);
  console.log('');
});
