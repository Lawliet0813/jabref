@echo off
REM Overend Web App Startup Script for Windows

echo Starting Overend Web App...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo Node.js is installed
node --version

REM Check and install dependencies
if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
) else (
    echo Backend dependencies already installed
)

if not exist "client\node_modules" (
    echo Installing frontend dependencies...
    cd client
    call npm install
    cd ..
) else (
    echo Frontend dependencies already installed
)

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo Creating server\.env from .env.example...
    copy server\.env.example server\.env
)

echo.
echo Starting services...
echo.

REM Start backend in new window
echo Starting backend API server (port 5000)...
start "Overend Backend" cmd /k "cd server && npm run dev"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend dev server (port 3000)...
start "Overend Frontend" cmd /k "cd client && npm run dev"

echo.
echo Overend Web App is starting!
echo.
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:3000
echo.
echo Close the terminal windows to stop the services
echo.

pause
