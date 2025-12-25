# CI/CD Pipeline & Deployment Guide

## Overview

This guide explains the complete CI/CD setup for AGB IT Planner with automated deployment to Netlify and GitHub Actions workflows.

## Table of Contents

1. [Quick Start](#quick-start)
2. [GitHub Setup](#github-setup)
3. [Netlify Configuration](#netlify-configuration)
4. [Workflows](#workflows)
5. [Local Testing](#local-testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Start Both Backend & Frontend with One Command

```bash
# Make script executable
chmod +x start.sh

# Run both servers
./start.sh
```

**Output:**
```
🚀 AGB IT Planner - Starting Backend & Frontend
✅ Both servers are running!

📱 Frontend:  http://localhost:3000
⚙️  Backend:   http://localhost:5000
🏥 Health Check: http://localhost:5000/health
```

---

## GitHub Setup

### 1. Create Repository

```bash
# Initialize repository (already done)
git init
git config user.email "agbitsolutions247@gmail.com"
git config user.name "AGB IT Solutions"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AGB IT Planner full-stack application"

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/agbitsolutions/AGB_IT_Planner.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Create GitHub Organization/Repository

1. Go to https://github.com/new
2. Repository name: `AGB_IT_Planner`
3. Description: "Full-stack project planning application"
4. Choose Public or Private
5. Initialize with `.gitignore` (already done locally)
6. Create repository

### 3. Connect Local Repository

```bash
git remote add origin https://github.com/YOUR-USERNAME/AGB_IT_Planner.git
git branch -M main
git push -u origin main
```

---

## Netlify Configuration

### 1. Connect Netlify Account

1. Go to https://app.netlify.com
2. Sign in or create account with `agbitsolutions247@gmail.com`
3. Click "Add new site" → "Import an existing project"
4. Select GitHub
5. Select `AGB_IT_Planner` repository
6. Configure build settings:
   - **Build command:** `npm install && npm run build` (or leave blank for static)
   - **Publish directory:** `frontend`
7. Click "Deploy site"

### 2. Get Netlify Credentials

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate with Netlify
netlify login
# Opens browser, authorize with agbitsolutions247@gmail.com

# Get Site ID
netlify sites:list
# Copy the Site ID from output
```

### 3. Set GitHub Secrets

1. Go to GitHub repository settings
2. Click "Secrets and variables" → "Actions"
3. Create new repository secrets:

```
NETLIFY_SITE_ID: <your-site-id>
NETLIFY_AUTH_TOKEN: <your-auth-token>
```

**Getting Auth Token:**
```bash
netlify api listAccessTokens
# Or generate new one:
netlify api createAccessToken --description "GitHub Actions"
```

### 4. Update netlify.toml

```toml
[build]
  command = "npm install && npm run build"
  publish = "frontend"

[build.environment]
  REACT_APP_API_URL = "https://your-backend-url.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Workflows

### Frontend Deployment Workflow

**Trigger:** Push to `main` or `develop` branch (changes in `frontend/` folder)

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Build frontend
5. ✅ Deploy to Netlify

**File:** `.github/workflows/deploy.yml`

### Backend Validation Workflow

**Trigger:** Push to `main` or `develop` branch (changes in `backend/` folder)

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Run linter
5. ✅ Run tests with MongoDB

**File:** `.github/workflows/backend.yml`

---

## Local Testing

### Test Frontend Build

```bash
cd frontend
npm install
npm run build
npm start
```

### Test Backend

```bash
cd backend
npm install
npm run dev
```

### Test Both Together

```bash
# Make script executable
chmod +x start.sh

# Run
./start.sh

# In another terminal, test
curl http://localhost:5000/health
curl http://localhost:3000
```

### Manual Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=frontend
```

---

## Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/agb_planner

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@agbplanner.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend (netlify.toml)

```toml
[build.environment]
  REACT_APP_API_URL = "http://localhost:5000"  # Local
  # or
  REACT_APP_API_URL = "https://api.yourdomain.com"  # Production
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│                   (AGB_IT_Planner)                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─────────────────────────────────────────┐
                   │                                         │
         ┌─────────▼──────────┐              ┌──────────────▼────┐
         │  Frontend Push     │              │  Backend Push      │
         │  (deploy.yml)      │              │  (backend.yml)     │
         └──────────┬─────────┘              └───────────────────┘
                    │
                    ├─ Test
                    ├─ Build
                    └─ Deploy to Netlify
                       │
                       └──► https://your-site.netlify.app
                            (Frontend)

┌────────────────────────────────────────────────────────────┐
│  Your Local Machine                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Backend (Node.js + Express)     Frontend (Static HTML)   │
│  http://localhost:5000            http://localhost:3000   │
│                                                            │
│  MongoDB Connection                Connected via API       │
│  Email Service (Nodemailer)       Show last cached status │
│  File Upload Service              when offline            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Feature: Offline Mode (Frontend Only)

When backend is offline:
- Frontend shows last cached status from localStorage
- Users can view completed tasks and milestones
- Real-time updates resume when backend is back online

**Implementation (in js/api.js):**

```javascript
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    localStorage.setItem(`cached_${url}`, JSON.stringify(data));
    return data;
  } catch (error) {
    // Return cached data if available
    const cached = localStorage.getItem(`cached_${url}`);
    if (cached) {
      console.warn('Using cached data:', cached);
      return JSON.parse(cached);
    }
    throw error;
  }
}
```

---

## Monitoring & Logs

### GitHub Actions Logs

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select workflow run
4. View detailed logs for each step

### Netlify Logs

1. Go to https://app.netlify.com
2. Select your site
3. Click "Deploys"
4. Select a deployment
5. View build and deploy logs

### Local Logs

```bash
# Backend logs
tail -f backend/backend.log

# Frontend logs
tail -f frontend/frontend.log
```

---

## Git Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/kanban-improvements

# Make changes
# Commit
git add .
git commit -m "feat: add drag-drop animations"

# Push
git push origin feature/kanban-improvements

# Create Pull Request on GitHub
# PR triggers workflows for testing
# Review and merge to main
```

### Release Process

```bash
# Create release branch
git checkout -b release/v2.0.0

# Update version numbers
# Test thoroughly
git add .
git commit -m "chore: release v2.0.0"

# Push and merge to main
git push origin release/v2.0.0

# On GitHub:
# 1. Create Pull Request
# 2. Workflows run automatically
# 3. Merge to main
# 4. Frontend auto-deploys to Netlify
# 5. Create GitHub Release tag
```

---

## Troubleshooting

### Netlify Deployment Fails

**Error:** `Deploy failed - Command failed`

**Solutions:**
```bash
# Check Netlify logs
netlify deploy --prod --dir=frontend --verbose

# Verify site ID and auth token
netlify sites:list

# Test locally first
cd frontend && npm run build
```

### GitHub Actions Timeout

**Error:** `Job exceeded maximum execution time`

**Solutions:**
- Increase node_modules cache
- Optimize backend tests
- Run tests in parallel
- Skip tests for documentation changes

### MongoDB Connection Error

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solutions:**
```bash
# Check if MongoDB is running
mongosh

# Verify connection string in .env
cat backend/.env | grep MONGODB_URI

# Test connection
mongosh "mongodb://localhost:27017/agb_planner"
```

### Frontend Not Deploying

**Error:** `Build failed` on Netlify

**Solutions:**
1. Check `netlify.toml` exists in root
2. Verify `frontend` folder contains `index.html`
3. Check build logs on Netlify dashboard
4. Test build locally: `cd frontend && npm run build`

### API Endpoint Not Accessible

**Error:** `Cannot reach backend from frontend`

**Solutions:**
```bash
# Test backend health
curl http://localhost:5000/health

# Check CORS headers
curl -H "Origin: http://localhost:3000" http://localhost:5000/health -v

# Verify backend is running on port 5000
lsof -i :5000
```

---

## Best Practices

✅ **Always:**
- Test locally before pushing
- Write clear commit messages
- Create feature branches
- Review PRs before merging
- Keep `.env` secure (never commit)

❌ **Never:**
- Commit sensitive data
- Push directly to main
- Ignore workflow failures
- Delete GitHub secrets
- Share authentication tokens

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Connect to GitHub Actions
3. ✅ Set up Netlify account
4. ✅ Configure GitHub secrets
5. ✅ Push to main branch
6. ✅ Monitor first deployment
7. ✅ Test frontend and backend
8. ✅ Share Netlify URL with team

---

## Support

For issues or questions:
1. Check workflow logs on GitHub Actions
2. Review Netlify build logs
3. Check backend server logs
4. Test using API examples in `API_TESTING.md`

