#!/bin/bash
# Server-Side Setup Script for Hostinger
# Run this AFTER uploading your code to the server

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "================================================"
echo "  🚀 AGB Planner - Server Setup"
echo "================================================"
echo ""

# Configuration
APP_DIR="$HOME/public_html/admin.agbitsolutions.com"
APP_NAME="agb-planner"

# Step 1: Check Node.js
echo -e "${YELLOW}🔍 Step 1: Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js from Hostinger hPanel or contact support"
    exit 1
fi
echo ""

# Step 2: Check/Install PM2
echo -e "${YELLOW}🔍 Step 2: Checking PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 already installed${NC}"
else
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    npm install -g pm2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 installed${NC}"
    else
        echo -e "${RED}❌ Failed to install PM2${NC}"
        exit 1
    fi
fi
echo ""

# Step 3: Create directory structure
echo -e "${YELLOW}📁 Step 3: Setting up directories...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR
echo -e "${GREEN}✅ Directory ready: $APP_DIR${NC}"
echo ""

# Step 4: Check if files exist
echo -e "${YELLOW}📦 Step 4: Checking application files...${NC}"
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    echo ""
    echo "Please upload your code first using ONE of these methods:"
    echo ""
    echo "Method 1 - From another terminal on your local machine:"
    echo "  cd /home/user/agb_planner"
    echo "  scp -P 65002 -r backend frontend u544547223@89.117.157.109:~/public_html/admin.agbitsolutions.com/"
    echo ""
    echo "Method 2 - Using Git (if you have a repo):"
    echo "  git clone <your-repo-url> $APP_DIR"
    echo ""
    echo "Method 3 - Using FileZilla/SFTP:"
    echo "  Host: 89.117.157.109"
    echo "  Port: 65002"
    echo "  Upload to: ~/public_html/admin.agbitsolutions.com/"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Application files found${NC}"
echo ""

# Step 5: Install dependencies
echo -e "${YELLOW}📦 Step 5: Installing dependencies...${NC}"
cd backend
npm install --production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 6: Create .env file
echo -e "${YELLOW}📝 Step 6: Setting up environment...${NC}"
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_IN_PRODUCTION
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Update JWT_SECRET in .env file!${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Step 7: Initialize database
echo -e "${YELLOW}🔧 Step 7: Initializing database...${NC}"
node -e "import('./config/database.js').then(m => m.connectDB().then(() => { console.log('✅ Database initialized'); process.exit(0); })).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database ready${NC}"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi
echo ""

# Step 8: Stop existing process
echo -e "${YELLOW}🛑 Step 8: Stopping old processes...${NC}"
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
echo -e "${GREEN}✅ Old processes cleared${NC}"
echo ""

# Step 9: Start application
echo -e "${YELLOW}🚀 Step 9: Starting application...${NC}"
pm2 start server.js --name $APP_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application started${NC}"
    pm2 save
else
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi
echo ""

# Step 10: Show status
echo -e "${BLUE}📊 Current Status:${NC}"
pm2 status
echo ""

# Step 11: Test API
echo -e "${YELLOW}🧪 Testing API...${NC}"
sleep 2
curl -s http://localhost:5000/api/health | head -20
echo ""
echo ""

echo "================================================"
echo "  ✅ Deployment Complete!"
echo "================================================"
echo ""
echo -e "${GREEN}Your API is now running!${NC}"
echo ""
echo "🌐 Test externally:"
echo "   curl https://admin.agbitsolutions.com/api/health"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs $APP_NAME      - View logs"
echo "   pm2 restart $APP_NAME   - Restart app"
echo "   pm2 stop $APP_NAME      - Stop app"
echo ""
echo "📁 Application directory:"
echo "   $APP_DIR"
echo ""
echo "⚠️  Next steps:"
echo "   1. Configure subdomain in Hostinger hPanel"
echo "   2. Enable SSL certificate"
echo "   3. Update JWT_SECRET in .env"
echo "   4. Setup automated backups"
echo ""
