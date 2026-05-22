#!/bin/bash

# Gemini Clone Setup Script
# This script automates the initial setup process

echo "🚀 Starting Gemini Clone Setup..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
    echo "   - MONGODB_URI"
    echo "   - GEMINI_API_KEY"
    echo "   - JWT_SECRET"
fi

echo "📥 Installing backend dependencies..."
npm install

echo ""
echo "✅ Backend setup complete!"

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -f package.json ]; then
    echo "⚠️  package.json not found. Skipping npm install."
else
    echo "📥 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Frontend setup complete!"

# Summary
echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Update backend/.env with your configuration:"
echo "   - MongoDB URI"
echo "   - Gemini API Key"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start the frontend (in new terminal):"
echo "   cd frontend && npm start"
echo "   Or open frontend/login.html in your browser"
echo ""
echo "4. Create an account and start chatting!"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""
