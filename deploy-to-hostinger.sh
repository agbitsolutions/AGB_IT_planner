#!/bin/bash
# Complete Deployment Script - Local to Hostinger
# This script uploads files and deploys your application

# SSH Configuration
SSH_HOST="89.117.157.109"
SSH_PORT="65002"
SSH_USER="u544547223"
REMOTE_DIR="~/public_html/admin.agbitsolutions.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "================================================"
echo "  🚀 AGB Planner - Complete Deployment"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the agb_planner directory${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Deployment Configuration:${NC}"
echo "  Local:  /home/user/agb_planner"
echo "  Remote: $SSH_USER@$SSH_HOST:$REMOTE_DIR"
echo "  Port:   $SSH_PORT"
echo ""

# Step 1: Create archive
echo -e "${YELLOW}🔄 Step 1: Creating deployment archive...${NC}"
tar -czf /tmp/agb_planner_deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='database.sqlite' \
    --exclude='.git' \
    --exclude='*.log' \
    backend/ frontend/ hostinger-*.sh

if [ $? -eq 0 ]; then
    SIZE=$(du -h /tmp/agb_planner_deploy.tar.gz | cut -f1)
    echo -e "${GREEN}✅ Archive created: $SIZE${NC}"
else
    echo -e "${RED}❌ Failed to create archive${NC}"
    exit 1
fi
echo ""

# Step 2: Upload to Hostinger
echo -e "${YELLOW}🔄 Step 2: Uploading to Hostinger...${NC}"
echo "Please enter your Hostinger password when prompted"
echo ""

scp -P $SSH_PORT /tmp/agb_planner_deploy.tar.gz $SSH_USER@$SSH_HOST:~/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi
echo ""

# Step 3: Deploy on server
echo -e "${YELLOW}🔄 Step 3: Deploying on Hostinger...${NC}"
echo "Please enter your password again when prompted"
echo ""

ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << 'ENDSSH'
    echo "🔧 Extracting files..."
    
    # Create directory if it doesn't exist
    mkdir -p ~/public_html/admin.agbitsolutions.com
    cd ~/public_html/admin.agbitsolutions.com
    
    # Extract archive
    tar -xzf ~/agb_planner_deploy.tar.gz
    
    # Clean up
    rm ~/agb_planner_deploy.tar.gz
    
    # Make scripts executable
    chmod +x hostinger-*.sh
    
    echo "✅ Files extracted"
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    cd backend
    npm install --production
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_IN_PRODUCTION
EOF
        echo "⚠️  IMPORTANT: Update JWT_SECRET in .env file!"
    fi
    
    # Initialize database
    echo "🔧 Initializing database..."
    node -e "import('./config/database.js').then(m => m.connectDB().then(() => { console.log('✅ Database ready'); process.exit(0); })).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
    
    # Setup PM2
    echo "🚀 Starting application with PM2..."
    
    # Stop existing process
    pm2 stop agb-planner 2>/dev/null || true
    pm2 delete agb-planner 2>/dev/null || true
    
    # Start new process
    pm2 start server.js --name agb-planner
    pm2 save
    
    # Show status
    echo ""
    echo "✅ Deployment complete!"
    pm2 status
    
    echo ""
    echo "🌐 Your application should be available at:"
    echo "   https://admin.agbitsolutions.com/api/health"
    echo ""
    echo "📊 View logs with: pm2 logs agb-planner"
ENDSSH

# Clean up local temp file
rm /tmp/agb_planner_deploy.tar.gz

echo ""
echo "================================================"
echo "  ✅ Deployment Complete!"
echo "================================================"
echo ""
echo -e "${GREEN}Your application is now deployed!${NC}"
echo ""
echo "Next steps:"
echo "1. Test API: curl https://admin.agbitsolutions.com/api/health"
echo "2. Update .env with secure JWT_SECRET"
echo "3. Configure SSL in Hostinger hPanel"
echo "4. Setup automated backups"
echo ""
echo "To connect to server:"
echo "  ./connect-hostinger.sh"
echo ""
echo "To view logs:"
echo "  ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
echo "  pm2 logs agb-planner"
echo ""
