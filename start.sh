#!/bin/bash

# AGB Planner - Quick Start Script

echo "🚀 AGB Multi-Project Planner - Quick Start"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB from https://www.mongodb.com"
    echo "   Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env with your configuration:"
    echo "   1. MongoDB URI"
    echo "   2. JWT_SECRET"
    echo "   3. SMTP settings (Gmail App Password)"
    echo ""
    echo "   Edit now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        code .env 2>/dev/null || nano .env
    fi
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Ensure MongoDB is running:"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   npm run dev"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   cd frontend"
echo "   python -m http.server 3000"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"
echo ""
