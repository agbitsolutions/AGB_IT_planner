#!/bin/bash
# Deployment Script for Hostinger
# Run this ON your Hostinger server after uploading files

echo "================================================"
echo "  AGB Planner - Hostinger Deployment"
echo "================================================"
echo ""

# Configuration
APP_DIR="/home/your_username/public_html/admin.agbitsolutions.com"
BACKEND_DIR="$APP_DIR/backend"
DB_PATH="$APP_DIR/database.sqlite"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to app directory
cd "$APP_DIR" || exit 1

echo "📁 Current directory: $(pwd)"
echo ""

# Step 1: Install dependencies
echo "🔄 Step 1: Installing Node.js dependencies..."
cd "$BACKEND_DIR" || exit 1
npm install --production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 2: Check/Create environment file
echo "🔄 Step 2: Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating .env file...${NC}"
    cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_IN_PRODUCTION
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Update JWT_SECRET in .env file!${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Step 3: Initialize database
echo "🔄 Step 3: Initializing database..."
node -e "
import { connectDB } from './config/database.js';
import './models/index.js';
connectDB().then(() => {
  console.log('✅ Database initialized successfully');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});
" 
echo ""

# Step 4: Set proper permissions
echo "🔄 Step 4: Setting file permissions..."
chmod 644 "$DB_PATH" 2>/dev/null || echo "Database file doesn't exist yet (will be created on first run)"
chmod -R 755 "$APP_DIR"
chmod 600 "$BACKEND_DIR/.env"
echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# Step 5: Stop existing PM2 process (if any)
echo "🔄 Step 5: Managing PM2 process..."
pm2 stop agb-planner 2>/dev/null || echo "No existing process to stop"
pm2 delete agb-planner 2>/dev/null || echo "No existing process to delete"

# Start application with PM2
pm2 start server.js --name agb-planner --env production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application started with PM2${NC}"
else
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi

# Save PM2 configuration
pm2 save
echo ""

# Step 6: Setup PM2 startup script
echo "🔄 Step 6: Configuring PM2 to start on reboot..."
pm2 startup | tail -1 | sh
echo -e "${GREEN}✅ PM2 startup configured${NC}"
echo ""

# Step 7: Test the application
echo "🔄 Step 7: Testing application..."
sleep 3
RESPONSE=$(curl -s http://localhost:5000/api/health)
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Application is responding correctly${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}❌ Application is not responding correctly${NC}"
    pm2 logs agb-planner --lines 20
fi
echo ""

# Step 8: Display status
echo "================================================"
echo "  Deployment Complete! 🎉"
echo "================================================"
echo ""
echo "Application Status:"
pm2 status agb-planner
echo ""
echo "Next Steps:"
echo "1. Update .env file with production values:"
echo "   nano $BACKEND_DIR/.env"
echo ""
echo "2. Test your API:"
echo "   curl https://admin.agbitsolutions.com/api/health"
echo ""
echo "3. View logs:"
echo "   pm2 logs agb-planner"
echo ""
echo "4. Setup backup cron job:"
echo "   crontab -e"
echo "   Add: 0 2 * * * /path/to/backup-script.sh"
echo ""
echo "5. Configure SSL in Hostinger control panel"
echo ""
echo "================================================"
