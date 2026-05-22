# Gemini Clone - Deployment Guide

## Quick Start for Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Or open `frontend/login.html` directly in browser after backend is running.

## Production Deployment

### 1. Heroku (Backend)

```bash
# Create Heroku app
heroku create gemini-clone-app

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_connection
heroku config:set JWT_SECRET=your_secret_key
heroku config:set GEMINI_API_KEY=your_api_key
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# Deploy
git push heroku main
```

### 2. Vercel/Netlify (Frontend)

Build the frontend as static files and deploy to Vercel or Netlify.

### 3. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]
```

### Key Files

- `.env` - Environment configuration (Backend)
- `.env.example` - Example environment file

## Monitoring

- Check logs: `heroku logs -t`
- Monitor performance: Heroku Dashboard
- Monitor API: Google Cloud Console

## Next Steps

1. Update FRONTEND_URL in backend .env
2. Configure CORS for your domain
3. Set up SSL certificates
4. Enable HTTPS
5. Configure monitoring and alerts
