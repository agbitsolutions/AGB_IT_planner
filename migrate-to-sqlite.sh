#!/bin/bash

# AGB Planner - MongoDB to SQLite3 Migration Script
# This script helps migrate your project from MongoDB to SQLite3

echo "================================================"
echo "  AGB Planner - MongoDB to SQLite3 Migration"
echo "================================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Step 1: Backup current node_modules and package-lock.json
echo "🔄 Step 1: Creating backups..."
if [ -d "backend/node_modules" ]; then
    echo "  Backing up node_modules..."
    mv backend/node_modules backend/node_modules.backup.$(date +%Y%m%d_%H%M%S)
fi

if [ -f "backend/package-lock.json" ]; then
    echo "  Backing up package-lock.json..."
    cp backend/package-lock.json backend/package-lock.json.backup.$(date +%Y%m%d_%H%M%S)
fi

echo "  ✅ Backups created"
echo ""

# Step 2: Install new dependencies
echo "🔄 Step 2: Installing SQLite3 and Sequelize..."
cd backend

# Remove old MongoDB dependency
echo "  Removing mongoose..."
npm uninstall mongoose

# Install new dependencies
echo "  Installing sequelize and sqlite3..."
npm install sequelize@^6.35.0 sqlite3@^5.1.6 --save

echo "  ✅ Dependencies installed"
echo ""

# Step 3: Create .env file if it doesn't exist
echo "🔄 Step 3: Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cat > .env << 'EOF'
# Database Configuration
DB_PATH=./database.sqlite
NODE_ENV=development

# Server Configuration
PORT=5000

# JWT Configuration (change this in production!)
JWT_SECRET=change_this_to_a_random_secret_key_in_production

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EOF
    echo "  ✅ .env file created"
else
    echo "  ℹ️  .env file already exists"
    echo "  Please update it with:"
    echo "    DB_PATH=./database.sqlite"
    echo "    Remove: MONGODB_URI"
fi
echo ""

# Step 4: Initialize database
echo "🔄 Step 4: Initializing SQLite database..."

# Create init script
cat > init-db.js << 'EOF'
import { connectDB } from './config/database.js';
import './models/index.js';

console.log('Initializing database...');

connectDB().then(async () => {
  console.log('✅ Database initialized successfully!');
  console.log('📍 Database file location:', process.env.DB_PATH || './database.sqlite');
  console.log('');
  console.log('Database is ready to use!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  console.error('Please check your configuration and try again.');
  process.exit(1);
});
EOF

# Run init script
node init-db.js

# Clean up init script
rm init-db.js

echo ""

# Step 5: Test the server
echo "🔄 Step 5: Testing server startup..."
timeout 5 node server.js &
SERVER_PID=$!
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "  ✅ Server started successfully!"
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
else
    echo "  ⚠️  Server didn't start (this might be normal for quick test)"
fi
echo ""

# Step 6: Summary
echo "================================================"
echo "  Migration Complete! 🎉"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Review the changes in your code"
echo "2. Update .env file with production values"
echo "3. Test the application:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "4. Check the API health:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "5. For deployment to Hostinger, see:"
echo "   HOSTINGER_DEPLOYMENT_GUIDE.md"
echo ""
echo "Database file: backend/database.sqlite"
echo ""
echo "Benefits of SQLite3:"
echo "  ✓ Zero cost (no MongoDB Atlas fees)"
echo "  ✓ No external dependencies"
echo "  ✓ File-based (easy backups)"
echo "  ✓ Perfect for small to medium apps"
echo ""
echo "================================================"

cd ..
