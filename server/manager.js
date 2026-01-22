import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

let whatsappProcess = null

// Start WhatsApp Server
app.post('/api/manager/start', (req, res) => {
  if (whatsappProcess) {
    return res.json({ success: false, message: 'Server already running' })
  }

  try {
    // Start the NEW Baileys WhatsApp server
    const serverPath = path.join(__dirname, 'index-baileys.js')
    console.log('DEBUG: __dirname =', __dirname)
    console.log('DEBUG: serverPath =', serverPath)
    whatsappProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      detached: false,
      stdio: 'inherit'
    })

    whatsappProcess.on('error', (error) => {
      console.error('Failed to start server:', error)
      whatsappProcess = null
    })

    whatsappProcess.on('exit', (code) => {
      console.log(`WhatsApp server exited with code ${code}`)
      whatsappProcess = null
    })

    res.json({ success: true, message: 'WhatsApp server started successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

// Stop WhatsApp Server
app.post('/api/manager/stop', (req, res) => {
  if (!whatsappProcess) {
    return res.json({ success: false, message: 'Server not running' })
  }

  try {
    whatsappProcess.kill()
    whatsappProcess = null
    res.json({ success: true, message: 'WhatsApp server stopped' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

// Check Manager Status
app.get('/api/manager/status', (req, res) => {
  res.json({
    managerRunning: true,
    whatsappServerRunning: whatsappProcess !== null
  })
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`🎛️  Server Manager running on http://localhost:${PORT}`)
  console.log(`📡 Endpoints:`)
  console.log(`   POST /api/manager/start  - Start WhatsApp server`)
  console.log(`   POST /api/manager/stop   - Stop WhatsApp server`)
  console.log(`   GET  /api/manager/status - Check status`)
})
