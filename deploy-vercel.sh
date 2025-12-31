#!/bin/bash
cd /home/user/agb_planner

echo "Step 1: Login to Vercel..."
npx vercel login

echo ""
echo "Step 2: Deploying..."
npx vercel --prod

echo ""
echo "Step 3: Set environment variables in Vercel dashboard:"
echo "https://vercel.com/dashboard"
echo ""
echo "Go to: Project Settings → Environment Variables"
echo ""
echo "Add these:"
echo "NODE_ENV=production"
echo "JWT_SECRET=agb_it_solutions_secure_jwt_key_2025"
echo "EMAIL_HOST=smtp.gmail.com"
echo "EMAIL_PORT=587"
echo "EMAIL_USER=admin@agbitsolutions.com"
echo "EMAIL_PASS=temp_password_change_later"
echo ""
echo "Then redeploy: npx vercel --prod"
