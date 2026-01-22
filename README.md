# CarWash Admin Panel

A car wash management system with WhatsApp integration for sending reminders.

## Deploy to Render

Click the button below to deploy both frontend and backend to Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/brainzInspired/carwashweb)

## After Deployment

1. Once deployed, go to your Render dashboard
2. Find your `carwash-api` service and copy its URL (e.g., `https://carwash-api-xxxx.onrender.com`)
3. Go to `carwash-frontend` service → Environment → Add:
   - `VITE_API_URL` = `https://carwash-api-xxxx.onrender.com/api/whatsapp`
4. Redeploy the frontend

## Features

- Dashboard with service statistics
- Customer management
- Staff attendance tracking
- WhatsApp reminder system
- Booking slot management
- QR code generator for payments

## Local Development

```bash
# Install frontend dependencies
npm install

# Start frontend
npm run dev

# In another terminal, start backend
cd server
npm install
npm start
```

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL for WhatsApp service

### Backend
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (default: 3001)
