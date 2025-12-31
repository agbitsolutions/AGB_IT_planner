#!/bin/bash
cd /home/user/agb_planner
echo "Installing new Railway CLI..."
npm install -D @railway/cli

echo "Deploying to Railway..."
npx @railway/cli login
npx @railway/cli init
npx @railway/cli up

echo ""
echo "Set environment variables in Railway dashboard:"
echo "https://railway.app/dashboard"
echo ""
echo "Required variables:"
echo "NODE_ENV=production"
echo "DB_PATH=./database.sqlite"
echo "JWT_SECRET=agb_it_solutions_secure_jwt_key_2025"
echo "EMAIL_HOST=smtp.gmail.com"
echo "EMAIL_PORT=587"
echo "EMAIL_USER=admin@agbitsolutions.com"
echo "EMAIL_PASS=temp_password_change_later"
