# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Google Gemini API Key

### Step 1: Backend Setup

```bash
cd backend
npm install
```

### Step 2: Configure Environment

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gemini-clone
JWT_SECRET=dev-secret-key-change-in-production
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Backend

```bash
npm run dev
```

### Step 4: Open Frontend

Open `frontend/login.html` in your browser or use a development server:

```bash
cd frontend
npx http-server -p 3000
```

### Step 5: Create Account

1. Click "Create New Account"
2. Fill in your details
3. Start chatting!

## 🔧 Configuration

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Google Gemini API

1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Paste in GEMINI_API_KEY

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Auth middleware
├── services/          # Business logic
└── package.json       # Dependencies

frontend/
├── index.html         # Main chat page
├── login.html         # Auth page
├── js/
│   ├── app.js         # Chat logic
│   ├── auth.js        # Auth logic
│   └── api.js         # API client
└── css/               # Styling
```

## ✅ Verification

### Backend Check

- Backend running on http://localhost:5000
- Health check: `curl http://localhost:5000/api/health`

### Frontend Check

- Frontend running on http://localhost:3000
- Can open login page
- Can create account
- Can send messages

## 🐛 Common Issues

**MongoDB Connection Failed**

```
Error: connect ECONNREFUSED
```

→ Start MongoDB: `mongod`

**API Key Invalid**

```
Error: No valid content received
```

→ Check GEMINI_API_KEY in .env

**Port Already in Use**

```
Error: EADDRINUSE
```

→ Kill process or change PORT in .env

## 📚 Next Steps

1. Deploy backend to Heroku
2. Deploy frontend to Vercel
3. Set up custom domain
4. Enable production mode
5. Add more features!

## 🎯 Features Included

✅ User authentication with JWT
✅ MongoDB integration
✅ AI chat with Gemini API
✅ Chat history storage
✅ Responsive design
✅ Error handling
✅ Rate limiting
✅ Security headers

## 🚀 Deployment Checklist

- [ ] Configure production MONGODB_URI
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up monitoring
- [ ] Test all features
- [ ] Backup database

Need help? Check the main README.md for detailed documentation!
