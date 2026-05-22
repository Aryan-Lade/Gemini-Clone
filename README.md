# Gemini Clone - Production Ready Application

A full-stack AI chatbot application built with Node.js, Express, MongoDB, and modern frontend technologies.

## Features

✨ **Core Features:**

- User authentication with JWT
- AI-powered chat with Google Gemini API
- Chat history storage and retrieval
- User profile management
- Responsive design for all devices
- Dark modern UI/UX

🔒 **Security:**

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS protection
- Rate limiting
- Environment variable management
- Secure API key handling

🗄️ **Database:**

- MongoDB integration
- User model with authentication
- Chat history with conversations
- Indexed queries for performance

## Project Structure

```
Gemini-Clone/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── ChatHistory.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── user.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── geminiService.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html (main chat page)
│   ├── login.html (auth page)
│   ├── js/
│   │   ├── app.js
│   │   ├── auth.js
│   │   └── api.js
│   ├── css/
│   │   ├── main.css
│   │   └── auth.css
│   └── package.json (for development server)
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gemini API Key (from Google AI Studio)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gemini-clone

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-from-google

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Update MONGODB_URI in .env

### 4. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `.env` as `GEMINI_API_KEY`

### 5. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 6. Frontend Setup

#### Option A: Direct File Access

Open `frontend/login.html` in your browser

#### Option B: Using Development Server

```bash
cd frontend

# Using Python
python -m http.server 3000

# Using Node.js
npx http-server -p 3000
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout user

### Chat

- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:conversationId` - Get specific conversation
- `DELETE /api/chat/conversations/:conversationId` - Delete conversation
- `POST /api/chat/conversations/:conversationId/clear` - Clear messages

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

## Default Test Credentials

After setup, you can create a new account via the signup page.

## Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED
```

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity for Atlas

### Gemini API Errors

```
Error: No valid content received
```

- Verify API key is correct
- Check API key is enabled
- Ensure you have sufficient API quota

### CORS Issues

```
Error: CORS policy
```

- Update FRONTEND_URL in .env to match your frontend URL
- Ensure backend is running

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

- Change PORT in .env
- Kill existing process: `lsof -ti:5000 | xargs kill -9`

## Performance Tips

1. **Database Indexing**: Collections are indexed for fast queries
2. **Rate Limiting**: API endpoints are rate-limited to prevent abuse
3. **Caching**: Consider caching frequently asked questions
4. **Compression**: Enable gzip compression in production
5. **CDN**: Serve frontend assets from CDN in production

## Security Best Practices

✓ Never commit .env files
✓ Use strong JWT_SECRET in production
✓ Enable HTTPS in production
✓ Use environment-specific configurations
✓ Keep dependencies updated
✓ Implement proper error handling
✓ Validate all user inputs
✓ Use prepared statements (MongoDB does this by default)

## Deployment

### Backend (Heroku)

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
# Using Vercel
vercel

# Using Netlify
netlify deploy
```

## Environment Variables Reference

| Variable       | Description           | Example                                |
| -------------- | --------------------- | -------------------------------------- |
| PORT           | Server port           | 5000                                   |
| NODE_ENV       | Environment           | development/production                 |
| MONGODB_URI    | Database connection   | mongodb://localhost:27017/gemini-clone |
| JWT_SECRET     | JWT signing key       | super-secret-key                       |
| JWT_EXPIRE     | Token expiration      | 7d                                     |
| GEMINI_API_KEY | Google Gemini API key | AIza...                                |
| FRONTEND_URL   | Frontend base URL     | http://localhost:3000                  |

## Available Scripts

### Backend

```bash
npm start      # Run production server
npm run dev    # Run development server with auto-reload
npm run test   # Run tests (configure in package.json)
```

### Frontend

```bash
npm start      # Start development server
npm run build  # Build for production
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please follow the existing code style and create a pull request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Open an issue with detailed description

## Future Enhancements

- [ ] Image upload and analysis
- [ ] Voice input/output
- [ ] Code syntax highlighting
- [ ] Export conversations as PDF
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Real-time collaboration
- [ ] Custom AI models
- [ ] API rate increase
- [ ] Analytics dashboard

---

Built with ❤️ for AI enthusiasts
