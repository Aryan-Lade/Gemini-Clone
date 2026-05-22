@echo off
REM Gemini Clone Setup Script for Windows

echo 🚀 Starting Gemini Clone Setup...

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✅ Node.js detected: %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
echo ✅ npm detected: %NPM_VERSION%

REM Backend setup
echo.
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration
    echo    - MONGODB_URI
    echo    - GEMINI_API_KEY
    echo    - JWT_SECRET
)

echo 📥 Installing backend dependencies...
call npm install

echo.
echo ✅ Backend setup complete!

REM Frontend setup
echo.
echo 📦 Setting up Frontend...
cd ..\frontend

if exist package.json (
    echo 📥 Installing frontend dependencies...
    call npm install
) else (
    echo ⚠️  package.json not found. Skipping npm install.
)

echo.
echo ✅ Frontend setup complete!

REM Summary
echo.
echo ==========================================
echo ✅ Setup Complete!
echo ==========================================
echo.
echo 📚 Next steps:
echo.
echo 1. Update backend\.env with your configuration:
echo    - MongoDB URI
echo    - Gemini API Key
echo.
echo 2. Start the backend:
echo    cd backend && npm run dev
echo.
echo 3. Start the frontend (in new terminal):
echo    cd frontend && npm start
echo    Or open frontend/login.html in your browser
echo.
echo 4. Create an account and start chatting!
echo.
echo 📖 For detailed instructions, see README.md
echo.
pause
