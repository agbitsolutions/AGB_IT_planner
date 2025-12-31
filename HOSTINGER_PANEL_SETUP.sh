#!/bin/bash

###############################################################################
# HOSTINGER DEPLOYMENT - COMPLETE SETUP
# Follow these steps IN ORDER
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 Hostinger Deployment - Complete Setup Guide               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo "✅ FILES UPLOADED TO SERVER!"
echo ""
echo "📍 Location: ~/domains/agbitsolutions.com/public_html/admin"
echo ""

echo "🔧 NOW DO THIS IN HOSTINGER PANEL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣  Go to hPanel: https://hpanel.hostinger.com/"
echo ""

echo "2️⃣  Navigate to: Advanced → Node.js"
echo ""

echo "3️⃣  Click 'CREATE APPLICATION'"
echo ""

echo "4️⃣  Fill in these details:"
echo "   • Application name: admin-planner"
echo "   • Domain: admin.agbitsolutions.com"
echo "   • Application root: /public_html/admin"
echo "   • Application URL: admin.agbitsolutions.com"
echo "   • Application startup file: backend/server.js"
echo "   • Node.js version: 18.x or higher"
echo ""

echo "5️⃣  Click 'CREATE'"
echo ""

echo "6️⃣  After creation, click 'EDIT' on your app"
echo ""

echo "7️⃣  In 'Environment Variables' section, add:"
echo ""
cat << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=agb_it_solutions_secure_jwt_key_2025
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admin@agbitsolutions.com
EMAIL_PASS=temp_password_change_later
EOF
echo ""

echo "8️⃣  Click 'SAVE' for environment variables"
echo ""

echo "9️⃣  In the Node.js app panel, click:"
echo "   • 'RUN NPM INSTALL' (installs dependencies)"
echo "   • Wait for it to complete"
echo "   • Then click 'START APPLICATION'"
echo ""

echo "🔟  Your admin site should now be live at:"
echo "    https://admin.agbitsolutions.com"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⚠️  IMPORTANT: Update email settings later:"
echo "   EMAIL_USER=your_real_email@gmail.com"
echo "   EMAIL_PASS=your_app_specific_password"
echo ""

echo "✅ Once done, test at:"
echo "   https://admin.agbitsolutions.com"
echo ""
