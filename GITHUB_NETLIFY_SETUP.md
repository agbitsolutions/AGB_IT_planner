# GitHub & Netlify Setup Guide

## Complete Step-by-Step Guide for CI/CD Deployment

### Overview
This guide walks you through setting up GitHub, Netlify, and automating your frontend deployment with CI/CD.

---

## Part 1: GitHub Setup

### Step 1.1 - Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name:** `AGB_IT_Planner`
   - **Description:** "Full-stack project planning application with Kanban board"
   - **Visibility:** Public (recommended) or Private
   - **Don't** initialize with README (we already have one)

3. Click **Create repository**

### Step 1.2 - Push Local Code to GitHub

```bash
cd /home/user/agb_planner

# Check git status
git status

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/AGB_IT_Planner.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Output:**
```
Enumerating objects: 47, done.
Counting objects: 100% (47/47), done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Step 1.3 - Verify on GitHub

1. Go to https://github.com/YOUR-USERNAME/AGB_IT_Planner
2. Verify you see all files and folders
3. Check that `.github/workflows/` folder exists with `deploy.yml` and `backend.yml`

---

## Part 2: Netlify Setup

### Step 2.1 - Create Netlify Account

1. Go to https://app.netlify.com
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Netlify to access your GitHub account
5. Or use email: `agbitsolutions247@gmail.com`

### Step 2.2 - Create New Netlify Site

**Option A: Connect GitHub Repository (Recommended)**

1. In Netlify Dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Choose **"GitHub"**
4. Select repository: `AGB_IT_Planner`
5. Configure build settings:

```
Build command:    npm install && npm run build
Publish directory: frontend
```

6. Click **"Deploy site"**

**Option B: Manual Deployment**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login
# Browser opens for authentication

# Deploy
netlify deploy --prod --dir=frontend --site=YOUR_SITE_ID --auth=YOUR_TOKEN
```

### Step 2.3 - Get Netlify Credentials

```bash
# List your sites
netlify sites:list

# Output example:
# ┌─────────────────────────────────────────────────────────┐
# │ Your Netlify Sites:                                   │
# ├─────────────────────────────────────────────────────────┤
# │ AGB IT Planner                                        │
# │ URL: https://agb-it-planner.netlify.app              │
# │ Site ID: abc123def456                                │
# └─────────────────────────────────────────────────────────┘

# Create access token
netlify api createAccessToken --description "GitHub Actions"
# Copy the token from output
```

### Step 2.4 - Add Netlify Environment Variables

In Netlify Dashboard:

1. Select your site: **AGB IT Planner**
2. Go to **Site settings** → **Build & deploy** → **Environment**
3. Add environment variable:

```
Key:   REACT_APP_API_URL
Value: http://localhost:5000
```

(For production, change to your actual API URL)

---

## Part 3: GitHub Secrets Setup

### Step 3.1 - Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Create two secrets:**

**Secret 1:**
```
Name:  NETLIFY_SITE_ID
Value: abc123def456  (from netlify sites:list)
```

**Secret 2:**
```
Name:  NETLIFY_AUTH_TOKEN
Value: nfp_xxxxx...   (from netlify api createAccessToken)
```

### Step 3.2 - Verify Secrets

Go to **Settings** → **Secrets and variables** → **Actions**

You should see:
```
✓ NETLIFY_AUTH_TOKEN
✓ NETLIFY_SITE_ID
```

---

## Part 4: Start the Application

### Option A: Run Both Backend & Frontend

```bash
cd /home/user/agb_planner

# Make script executable
chmod +x start.sh

# Run
./start.sh
```

**Output:**
```
═══════════════════════════════════════════════════════════════
🚀 AGB IT Planner - Starting Backend & Frontend
═══════════════════════════════════════════════════════════════

📱 Frontend:  http://localhost:3000
⚙️  Backend:   http://localhost:5000
🏥 Health Check: http://localhost:5000/health
```

### Option B: Run Manually

**Terminal 1 - Backend:**
```bash
cd /home/user/agb_planner/backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/agb_planner/frontend
python3 -m http.server 3000
```

### Option C: Test Locally Before Push

```bash
# Test backend starts
cd backend && npm run dev &
sleep 2

# Test frontend build
cd ../frontend && npm run build
npm run dev &

# Test both
curl http://localhost:5000/health
curl http://localhost:3000
```

---

## Part 5: First Deployment

### Step 5.1 - Make a Test Commit

```bash
cd /home/user/agb_planner

# Make a small change (e.g., update README)
echo "## CI/CD Enabled" >> README.md

# Commit and push
git add README.md
git commit -m "docs: update README with CI/CD info"
git push origin main
```

### Step 5.2 - Monitor GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see workflow running:
   - `deploy.yml` - Frontend deployment
   - `backend.yml` - Backend tests

4. Click on the running workflow to view logs
5. Wait for ✅ **All checks passed**

### Step 5.3 - Check Netlify Deployment

1. Go to your Netlify site dashboard
2. Look for new deployment in **Deploys** tab
3. When status is **Published**, click the URL to view live frontend

---

## Part 6: Production Deployment

### Update Frontend Configuration

**Edit `frontend/js/config.js`:**

```javascript
API: {
  dev: {
    BASE_URL: 'http://localhost:5000',
  },
  production: {
    BASE_URL: 'https://your-api.com',  // ← Change this
  },
}
```

### Update Backend API URL

**Edit `netlify.toml`:**

```toml
[build.environment]
  REACT_APP_API_URL = "https://your-api.com"
```

### Commit and Deploy

```bash
git add .
git commit -m "prod: update API configuration for production"
git push origin main

# Automatic deployment to Netlify begins!
```

---

## Part 7: Ongoing Development

### Feature Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally with ./start.sh

# Commit
git add .
git commit -m "feat: add new feature"

# Push and create Pull Request
git push origin feature/new-feature

# On GitHub:
# 1. Create Pull Request
# 2. Workflows run automatically
# 3. Review changes
# 4. Merge to main
# 5. Netlify auto-deploys
```

### Working with Branches

```bash
# Main branch (production)
git checkout main
git pull origin main

# Develop branch (staging)
git checkout -b develop
git push -u origin develop

# Feature branch
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature
# Create PR to develop
```

---

## Part 8: Monitoring & Troubleshooting

### Check Deployment Status

**GitHub Actions:**
```bash
# View workflow status
git log --oneline --all --graph

# Check Actions page in GitHub
# https://github.com/YOUR-USERNAME/AGB_IT_Planner/actions
```

**Netlify:**
```bash
# Check deployment status
netlify status

# View deployment logs
netlify deploy --prod --dir=frontend --verbose
```

### Debug Common Issues

#### Issue: Deployment Failed

**Solution:**
```bash
# Check GitHub Actions logs
1. Go to Actions tab
2. Click failed workflow
3. Review error logs
4. Fix issue locally
5. Push again

# Or check Netlify logs
netlify logs
```

#### Issue: API URL Wrong

**Solution:**
```bash
# Update config.js
nano frontend/js/config.js

# Update netlify.toml
nano netlify.toml

# Verify and redeploy
git add .
git commit -m "fix: correct API URL"
git push origin main
```

#### Issue: Frontend Not Updating

**Solution:**
```bash
# Clear Netlify cache
netlify cache:clear

# Redeploy
netlify deploy --prod --dir=frontend --clear-cache

# Or push to GitHub (triggers auto-deployment)
git commit --allow-empty -m "trigger: rebuild"
git push origin main
```

---

## Part 9: Production Checklist

Before going live, ensure:

- ✅ GitHub repository created and pushed
- ✅ Netlify site connected to GitHub
- ✅ GitHub secrets configured (NETLIFY_SITE_ID, NETLIFY_AUTH_TOKEN)
- ✅ Backend API running and accessible
- ✅ Frontend loads from Netlify URL
- ✅ API endpoints responding correctly
- ✅ Email notifications configured
- ✅ File uploads working
- ✅ Offline mode tested and working
- ✅ All workflows passing (✅ status on GitHub Actions)

---

## Part 10: Useful Commands

### Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline -10

# Create new branch
git checkout -b feature/name

# Switch branches
git checkout main

# Push changes
git push origin branch-name

# Create Pull Request
# (On GitHub website)
```

### Netlify Commands

```bash
# Login to Netlify
netlify login

# List sites
netlify sites:list

# Deploy to production
netlify deploy --prod --dir=frontend

# View deployment status
netlify status

# Check logs
netlify logs

# Create access token
netlify api createAccessToken --description "description"
```

### Backend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Test endpoints
curl http://localhost:5000/health

# Check logs
tail -f backend.log
```

---

## Summary

You now have:

1. ✅ **GitHub Repository** - Source code management
2. ✅ **GitHub Actions** - Automated testing and validation
3. ✅ **Netlify Deployment** - Automatic frontend deployment
4. ✅ **CI/CD Pipeline** - Deploys on every push to main
5. ✅ **Offline Support** - Frontend works when backend is down
6. ✅ **Startup Script** - Single command to start everything

**Next Steps:**
1. Create GitHub repository
2. Set up Netlify account
3. Add GitHub secrets
4. Push code
5. Monitor first deployment
6. Share Netlify URL

---

## Support

For issues:
- Check GitHub Actions logs
- Check Netlify deployment logs
- Review `CI_CD_GUIDE.md` for detailed troubleshooting
- Check `DEPLOYMENT.md` for configuration details

