#!/bin/bash

###############################################################################
# AUTOMATED VERCEL & RAILWAY DEPLOYMENT
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 Deploying to Vercel & Railway                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

cd /home/user/agb_planner

# Check if CLIs are installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found"
    exit 1
fi

echo "📦 DEPLOYMENT PLAN:"
echo ""
echo "Vercel:  Frontend + Serverless Backend"
echo "Railway: Full Stack (recommended for SQLite persistence)"
echo ""

# ============================================================================
# VERCEL DEPLOYMENT
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔵 VERCEL DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "To deploy to Vercel:"
echo ""
echo "1. Login to Vercel:"
echo "   npx vercel login"
echo ""
echo "2. Deploy (development):"
echo "   npx vercel"
echo ""
echo "3. Deploy (production):"
echo "   npx vercel --prod"
echo ""
echo "4. Set environment variables in Vercel dashboard:"
echo "   https://vercel.com/dashboard"
echo ""
echo "   Required variables:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=agb_it_solutions_secure_jwt_key_2025"
echo "   - EMAIL_HOST=smtp.gmail.com"
echo "   - EMAIL_PORT=587"
echo "   - EMAIL_USER=(your email)"
echo "   - EMAIL_PASS=(your app password)"
echo ""

read -p "Deploy to Vercel now? (y/N): " deploy_vercel

if [[ "$deploy_vercel" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting Vercel deployment..."
    npx vercel --prod
    echo ""
    echo "✅ Vercel deployment complete!"
    echo "🌐 Your app is live at the URL shown above"
    echo ""
fi

# ============================================================================
# RAILWAY DEPLOYMENT
# ============================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🟣 RAILWAY DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "To deploy to Railway:"
echo ""
echo "1. Login to Railway:"
echo "   npx railway login"
echo ""
echo "2. Initialize project:"
echo "   npx railway init"
echo ""
echo "3. Set environment variables:"
echo "   npx railway variables set NODE_ENV=production"
echo "   npx railway variables set JWT_SECRET=agb_it_solutions_secure_jwt_key_2025"
echo "   (and others...)"
echo ""
echo "4. Deploy:"
echo "   npx railway up"
echo ""

read -p "Deploy to Railway now? (y/N): " deploy_railway

if [[ "$deploy_railway" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting Railway deployment..."
    
    # Login
    echo "Logging in to Railway..."
    npx railway login
    
    # Check if already initialized
    if [ ! -f ".railway/railway.toml" ]; then
        echo "Initializing Railway project..."
        npx railway init
    fi
    
    # Set environment variables
    echo "Setting environment variables..."
    npx railway variables set NODE_ENV=production
    npx railway variables set DB_PATH=./database.sqlite
    npx railway variables set JWT_SECRET=agb_it_solutions_secure_jwt_key_2025
    npx railway variables set EMAIL_HOST=smtp.gmail.com
    npx railway variables set EMAIL_PORT=587
    npx railway variables set EMAIL_USER=admin@agbitsolutions.com
    npx railway variables set EMAIL_PASS=temp_password_change_later
    
    # Deploy
    echo "Deploying to Railway..."
    npx railway up
    
    echo ""
    echo "✅ Railway deployment complete!"
    echo "🌐 Get your URL: npx railway domain"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Hostinger: Files uploaded to ~/domains/agbitsolutions.com/public_html/admin"
echo "           Complete setup in hPanel (see HOSTINGER_PANEL_SETUP.sh)"
echo ""
echo "Vercel:    Run 'npx vercel --prod' when ready"
echo "           Add env vars in dashboard"
echo ""
echo "Railway:   Run 'npx railway up' when ready"
echo "           Includes persistent storage for SQLite"
echo ""
echo "⚠️  Remember to update EMAIL_USER and EMAIL_PASS with real credentials!"
echo ""
