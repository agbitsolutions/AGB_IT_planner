#!/bin/bash

# AGB IT Planner - Automated GitHub & Netlify Setup Script

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   AGB IT Planner - GitHub & Netlify Automated Setup           ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: GitHub Setup
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 1: GitHub Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${YELLOW}GitHub username is required${NC}"
    exit 1
fi

GITHUB_URL="https://github.com/${GITHUB_USERNAME}/AGB_IT_Planner.git"

echo -e "${GREEN}✓ GitHub URL: $GITHUB_URL${NC}\n"

# Step 2: Netlify Credentials
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 2: Netlify Credentials${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}To get your Netlify credentials:${NC}"
echo ""
echo "1. Run: npx netlify sites:list"
echo "   → Copy the Site ID"
echo ""
echo "2. Run: npx netlify api createAccessToken --description 'GitHub Actions'"
echo "   → Copy the Auth Token"
echo ""

read -p "Enter your Netlify Site ID: " NETLIFY_SITE_ID
read -sp "Enter your Netlify Auth Token: " NETLIFY_AUTH_TOKEN
echo ""

if [ -z "$NETLIFY_SITE_ID" ] || [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo -e "${YELLOW}Netlify credentials are required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Netlify credentials provided${NC}\n"

# Step 3: GitHub Login
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 3: GitHub CLI Login${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

if gh auth status >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Already authenticated with GitHub${NC}\n"
else
    echo -e "${YELLOW}Authenticating with GitHub...${NC}"
    gh auth login
fi

# Step 4: Create Repository Secret (if needed)
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 4: Adding GitHub Secrets${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Adding NETLIFY_SITE_ID...${NC}"
gh secret set NETLIFY_SITE_ID --body "$NETLIFY_SITE_ID" 2>/dev/null || echo -e "${YELLOW}(Note: This requires authenticated access to your repo)${NC}"

echo -e "${YELLOW}Adding NETLIFY_AUTH_TOKEN...${NC}"
gh secret set NETLIFY_AUTH_TOKEN --body "$NETLIFY_AUTH_TOKEN" 2>/dev/null || echo -e "${YELLOW}(Note: This requires authenticated access to your repo)${NC}"

# Step 5: Add Remote and Push
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 5: Push to GitHub${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

cd /home/user/agb_planner

echo -e "${YELLOW}Adding GitHub remote...${NC}"
git remote add origin "$GITHUB_URL" 2>/dev/null || git remote set-url origin "$GITHUB_URL"
echo -e "${GREEN}✓ Remote added${NC}"

echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main 2>&1 | tail -5

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/AGB_IT_Planner"
echo "2. Go to: https://app.netlify.com"
echo "3. Connect your GitHub repo to Netlify"
echo "4. Verify GitHub Secrets are set"
echo ""
echo -e "${GREEN}Your application is ready to deploy!${NC}"
