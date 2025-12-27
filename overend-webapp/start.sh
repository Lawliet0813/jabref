#!/bin/bash

# Overend Web App Startup Script

echo "🚀 Starting Overend Web App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "$1/node_modules" ]; then
        echo "📦 Installing dependencies for $2..."
        cd "$1" && npm install
        cd ..
    else
        echo "✓ Dependencies for $2 already installed"
    fi
}

# Check and install dependencies
check_dependencies "server" "backend"
check_dependencies "client" "frontend"

# Create .env file for server if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env from .env.example..."
    cp server/.env.example server/.env
fi

echo ""
echo "🎯 Starting services..."
echo ""

# Start backend
echo "🔧 Starting backend API server (port 5000)..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend dev server (port 3000)..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Overend Web App is starting!"
echo ""
echo "📚 Backend API: http://localhost:5000"
echo "🌐 Frontend UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Wait for processes
wait
