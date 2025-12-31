#!/bin/bash

echo "=========================================="
echo "  AGB Planner - Database Test & Verify"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
SERVER_PID=$(lsof -ti:5000)
if [ -z "$SERVER_PID" ]; then
    echo -e "${YELLOW}⚠️  Server not running on port 5000${NC}"
    echo "Starting server..."
    cd backend && NODE_ENV=test node server.js > /tmp/server.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✅ Server started${NC}"
else
    echo -e "${GREEN}✅ Server already running (PID: $SERVER_PID)${NC}"
fi

echo ""
echo "=========================================="
echo "  Running Playwright Tests"
echo "=========================================="
echo ""

npx playwright test --reporter=list

echo ""
echo "=========================================="
echo "  Database Entries"
echo "=========================================="
echo ""

node -e "
const {sequelize} = require('./backend/config/database.js');
(async () => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT id, name, owner, isPublic, createdAt FROM teams ORDER BY id');
    console.log('📊 Teams in Database:');
    console.table(results);
    
    const [count] = await sequelize.query('SELECT COUNT(*) as count FROM teams');
    console.log(\`\\n✅ Total Teams: \${count[0].count}\`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
})();
"

echo ""
echo "=========================================="
echo "  Test Complete!"
echo "=========================================="
echo ""
echo "View full HTML report: npx playwright show-report"
echo ""
