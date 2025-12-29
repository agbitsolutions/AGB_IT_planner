#!/bin/bash

# Quick Setup Script for SQLite3 Migration
echo "🚀 AGB Planner - Quick Setup"
echo "================================"

cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    exit 1
fi

cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=development
PORT=5000
JWT_SECRET=change_this_in_production_to_random_secret
EOF
    echo "✅ .env created"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create simple test script
cat > test-db.js << 'EOF'
import { connectDB } from './config/database.js';
import './models/index.js';

connectDB().then(() => {
  console.log('✅ Database connection successful!');
  console.log('📍 Database file: ' + (process.env.DB_PATH || './database.sqlite'));
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
EOF

# Test database connection
echo "🔍 Testing database connection..."
node test-db.js
TEST_RESULT=$?

rm test-db.js

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start the server: npm start"
    echo "2. Test API: curl http://localhost:5000/api/health"
    echo "3. Deploy: See HOSTINGER_DEPLOYMENT_GUIDE.md"
else
    echo ""
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi
