# Gemini Clone - Complete Setup & Testing Guide

## 📋 Project Overview

Your Gemini Clone is now a **production-ready full-stack application** with:

✅ **Backend (Node.js + Express)**

- RESTful API with proper routing
- MongoDB database integration
- JWT authentication
- Gemini API integration
- Rate limiting & security headers
- Error handling & validation

✅ **Frontend (Modern JavaScript)**

- Responsive UI with Dark theme
- Chat interface with history sidebar
- Authentication pages (Login/Signup)
- Real-time message sending
- Persistent sessions with JWT tokens
- Mobile-friendly design

✅ **Database (MongoDB)**

- User accounts with secure password hashing
- Chat history with conversations
- Indexed queries for performance
- Soft deletion support

✅ **Security Features**

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS protection
- Rate limiting (100 req/15min)
- Environment variables for secrets
- Input validation

---

## 🚀 Installation & Setup

### Step 1: Backend Installation

```bash
cd backend
npm install
```

This installs:

- express (web framework)
- mongoose (database ORM)
- dotenv (environment variables)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- cors (cross-origin)
- helmet (security headers)
- morgan (logging)

### Step 2: Environment Configuration

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB - Choose one:

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/gemini-clone

# Option B: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gemini-clone?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Gemini API
GEMINI_API_KEY=your-google-gemini-api-key-from-aistudio.google.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Step 3: MongoDB Setup

**Option A: Local MongoDB**

```bash
# Windows/Mac/Linux
# Download and install from https://www.mongodb.com/try/download/community
mongod
```

**Option B: MongoDB Atlas (Recommended for testing)**

```
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster
4. Create database user
5. Get connection string (includes username and password)
6. Paste in MONGODB_URI
```

### Step 4: Get Gemini API Key

```
1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste in GEMINI_API_KEY
```

### Step 5: Start Backend

```bash
cd backend
npm run dev
```

Expected output:

```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
Environment: development
```

### Step 6: Frontend Setup

Open browser and navigate to:

```
file:///path/to/Gemini-Clone/frontend/login.html
```

Or use a development server:

```bash
cd frontend
npx http-server -p 3000
```

Then visit: `http://localhost:3000`

---

## ✅ Testing Checklist

### 1. Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. User Registration

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

Expected response (201):

```json
{
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### 3. User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for next requests.

### 4. Send Message (Core Feature)

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Gemini!"
  }'
```

Expected response (200):

```json
{
  "success": true,
  "conversationId": "conv-123...",
  "message": {
    "role": "assistant",
    "content": "Hello! I'm Gemini...",
    "timestamp": "..."
  }
}
```

### 5. Get Conversations

```bash
curl http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Frontend Testing

1. **Open login page**
   - Visit `http://localhost:3000` or `login.html`
   - Should see login/signup form

2. **Create account**
   - Fill in name, email, password
   - Click "Create Account"
   - Should redirect to chat page

3. **Send message**
   - Type "Hello"
   - Press Enter or click Send
   - Wait for AI response

4. **View chat history**
   - Check sidebar for recent chats
   - Click on previous chat to load it

5. **Test mobile**
   - Open on mobile browser
   - Should be responsive
   - Sidebar should collapse

---

## 🐛 Troubleshooting

### Backend Issues

**"MongoDB connection failed"**

```
Error: connect ECONNREFUSED
```

✓ Start MongoDB: `mongod`
✓ Check MONGODB_URI in .env
✓ For Atlas: ensure whitelist IP

**"No valid content received"**

```
Error: Empty API response
```

✓ Check GEMINI_API_KEY is correct
✓ Test API key at https://aistudio.google.com/app/apikey
✓ Check API quota/rate limits

**"Port already in use"**

```
Error: EADDRINUSE: address already in use :::5000
```

✓ Kill process: `lsof -ti:5000 | xargs kill -9`
✓ Change PORT in .env
✓ Use different port: `PORT=5001 npm run dev`

### Frontend Issues

**"API request failed"**
✓ Check backend is running
✓ Check CORS settings in backend
✓ Open browser console for detailed error

**"Login not working"**
✓ Check API endpoint URL in js/api.js
✓ Verify API_URL matches backend URL
✓ Check network requests in DevTools

**"Chat not sending messages"**
✓ Check token is being saved to localStorage
✓ Verify token in DevTools: `localStorage.getItem('token')`
✓ Check backend is receiving requests

### Database Issues

**"Cannot connect to MongoDB"**
✓ For local: Start mongod service
✓ For Atlas: Check connection string and IP whitelist
✓ For Atlas: Create database user if not exists

---

## 📂 Project Structure

```
Gemini-Clone/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema & methods
│   │   └── ChatHistory.js       # Chat & messages schema
│   ├── routes/
│   │   ├── auth.js              # /api/auth/* endpoints
│   │   ├── chat.js              # /api/chat/* endpoints
│   │   └── user.js              # /api/user/* endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── services/
│   │   └── geminiService.js     # Gemini API integration
│   ├── server.js                # Main Express app
│   ├── package.json             # Dependencies
│   └── .env                     # Configuration (create from .env.example)
│
├── frontend/
│   ├── index.html               # Chat page
│   ├── login.html               # Auth page
│   ├── js/
│   │   ├── app.js               # Chat logic & UI
│   │   ├── auth.js              # Auth page logic
│   │   └── api.js               # API client service
│   ├── css/
│   │   ├── main.css             # Chat page styles
│   │   └── auth.css             # Auth page styles
│   └── package.json             # Dev server config
│
├── README.md                    # Full documentation
├── QUICKSTART.md                # Quick setup guide
├── DEPLOYMENT.md                # Production deployment
├── API_DOCUMENTATION.md         # Complete API reference
├── .gitignore                   # Git ignore rules
├── setup.sh                     # Linux/Mac setup script
├── setup.bat                    # Windows setup script
└── TESTING.md                   # This file
```

---

## 🔧 Key Files Explained

### Backend

**server.js** - Main server

- Express setup
- Middleware configuration
- Route registration
- Error handling

**models/User.js** - User database model

- Name, email, password
- Avatar, preferences
- Password hashing & comparison
- Public profile method

**models/ChatHistory.js** - Chat database model

- User reference
- Conversation ID (unique per chat)
- Messages array with roles
- Timestamps

**services/geminiService.js** - Gemini API client

- callGeminiAPI() - Call Gemini API
- validateAPIResponse() - Validate response format
- Error handling

**routes/auth.js** - Authentication endpoints

- POST /signup
- POST /login
- POST /logout

**routes/chat.js** - Chat endpoints

- POST /message
- GET /conversations
- GET /conversations/:id
- DELETE /conversations/:id
- POST /conversations/:id/clear

**routes/user.js** - User endpoints

- GET /profile
- PUT /profile
- PUT /password

### Frontend

**js/api.js** - API client

- Handles all HTTP requests
- Token management
- Error handling
- Base URL configuration

**js/auth.js** - Authentication logic

- Login form handling
- Signup form handling
- Form validation
- Redirect after auth

**js/app.js** - Chat application

- Message display
- Conversation management
- Event listeners
- UI updates

---

## 🚀 Next Steps

### Immediate (Testing)

1. ✅ Run setup.sh or setup.bat
2. ✅ Configure .env file
3. ✅ Start backend: `npm run dev`
4. ✅ Open frontend in browser
5. ✅ Create account and test chat

### Short Term (Development)

1. Add image upload support
2. Implement voice input
3. Add code syntax highlighting
4. Export chat as PDF
5. Add more AI models

### Medium Term (Features)

1. Real-time notifications
2. Collaborative chats
3. Custom prompt templates
4. Chat search functionality
5. Analytics dashboard

### Long Term (Production)

1. Deploy to production servers
2. Set up CI/CD pipeline
3. Add monitoring & alerts
4. Scale database
5. Implement caching

---

## 📚 Documentation

| Document             | Purpose                           |
| -------------------- | --------------------------------- |
| README.md            | Complete project documentation    |
| QUICKSTART.md        | Quick setup in 5 minutes          |
| DEPLOYMENT.md        | Production deployment guide       |
| API_DOCUMENTATION.md | Complete API reference            |
| TESTING.md           | Setup & testing guide (this file) |

---

## 🎯 Success Criteria

Your setup is complete when you can:

✅ Start backend without errors
✅ See "Server is running on port 5000"
✅ Create a new user account
✅ Send a message to Gemini
✅ Receive AI response
✅ See message in chat history
✅ Logout and login again
✅ Access previous conversations

If all above work, you're ready to deploy! 🎉

---

## 💾 Database

### Collections Created

**users**

- Stores user accounts
- Indexed by email for fast lookup
- Passwords are hashed

**chathistories**

- Stores conversations
- Indexed by userId and createdAt for sorting
- Soft deletion support

### Sample Queries (MongoDB)

**View all users:**

```javascript
db.users.find();
```

**View user's conversations:**

```javascript
db.chathistories.find({ userId: ObjectId("...") });
```

**View conversation messages:**

```javascript
db.chathistories.findOne({ conversationId: "conv-123" });
```

---

## 🔐 Security Reminders

⚠️ **Important for Production:**

1. **Change JWT_SECRET**

   ```env
   JWT_SECRET=generate-a-long-random-string-here
   ```

2. **Enable HTTPS**
   - Use SSL certificates
   - Redirect HTTP to HTTPS

3. **Set NODE_ENV=production**
   - Enables optimizations
   - Hides error details

4. **Never commit .env**
   - Use .env.example for reference
   - Keep .env in .gitignore

5. **Rotate API Keys**
   - Regularly change Gemini API key
   - Regenerate JWT_SECRET

6. **Monitor Logs**
   - Check for suspicious activity
   - Set up alerts

---

## 📞 Support

If you encounter issues:

1. **Check logs**
   - Backend terminal output
   - Browser console (F12)
   - Network tab in DevTools

2. **Read error message**
   - Usually indicates the problem
   - Check corresponding section in troubleshooting

3. **Search documentation**
   - Check README.md
   - Check API_DOCUMENTATION.md
   - Check this guide

4. **Verify configuration**
   - Check .env file
   - Verify API keys
   - Check MongoDB connection

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Design](https://restfulapi.net/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

Ready to test? Start with Step 1 of Installation & Setup above! 🚀
