#!/bin/bash

# AGB Planner - One-Command Full Stack Startup

set -e

echo "🚀 AGB Multi-Project Planner - Starting All Services"
echo "====================================================="
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally"
    echo "   Using MongoDB Atlas cloud database (if configured in .env)"
fi

# Setup Backend
echo ""
echo "📦 Setting up backend..."
cd "$PROJECT_ROOT/backend"

# Install backend dependencies
if [ ! -d node_modules ]; then
    echo "   Installing dependencies..."
    npm install --silent
fi

# Setup .env
if [ ! -f .env ]; then
    echo "   Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "   ⚠️  Edit backend/.env with your MongoDB URI and settings"
    fi
fi

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."
cd "$PROJECT_ROOT/frontend"

if [ ! -d node_modules ]; then
    echo "   Installing dependencies..."
    npm install --silent
fi

# Build frontend
if [ ! -d dist ] && [ -f package.json ]; then
    echo "   Building frontend..."
    npm run build 2>/dev/null || true
fi

# Start services
echo ""
echo "🔄 Starting services..."
echo "   - Backend will run on http://localhost:5000"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "   - Backend: tail -f $PROJECT_ROOT/backend/backend.log"
echo "   - Frontend: tail -f $PROJECT_ROOT/frontend/frontend.log"
echo ""
echo "⏹️  To stop: Press Ctrl+C"
echo ""
echo "═════════════════════════════════════════════════════"
echo ""

# Start MongoDB if available locally
if command -v mongod &> /dev/null; then
    # Check if MongoDB is already running
    if ! pgrep -x "mongod" > /dev/null 2>&1; then
        echo "🔧 Starting MongoDB..."
        mongod --logpath /dev/null --fork --dbpath "$PROJECT_ROOT/data/mongodb" > /dev/null 2>&1 &
        sleep 2
        echo "✅ MongoDB started"
    else
        echo "✅ MongoDB already running"
    fi
    echo ""
fi

# Create logs directory
mkdir -p "$PROJECT_ROOT/backend" "$PROJECT_ROOT/frontend"

# Start Backend in background
cd "$PROJECT_ROOT/backend"
echo "🚀 Starting Backend..."
npm run dev > "$PROJECT_ROOT/backend/backend.log" 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend/backend.log"
    tail -20 "$PROJECT_ROOT/backend/backend.log"
    exit 1
fi

# Start Frontend in background
cd "$PROJECT_ROOT/frontend"
echo "🚀 Starting Frontend..."

# Try npm start first, fallback to http-server
if grep -q '"start"' package.json 2>/dev/null; then
    npm start > "$PROJECT_ROOT/frontend/frontend.log" 2>&1 &
else
    # Use simple HTTP server for static files
    npx http-server -p 3000 -c-1 > "$PROJECT_ROOT/frontend/frontend.log" 2>&1 &
fi

FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
sleep 2

echo ""
echo "═════════════════════════════════════════════════════"
echo "✨ All services are running!"
echo "═════════════════════════════════════════════════════"
echo ""
echo "🌐 Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "📊 API Docs:"
echo "   http://localhost:5000/api"
echo ""
echo "🛑 To stop all services, press Ctrl+C"
echo ""

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ Services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show logs
wait
