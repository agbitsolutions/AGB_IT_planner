# AGB IT Planner - Deployment Configuration

This directory contains deployment scripts and configurations.

## Scripts

### start.sh
Single command to start both backend and frontend servers locally.

```bash
chmod +x ../start.sh
./start.sh
```

## Configuration Files

### Netlify Configuration
- **Location:** `netlify.toml`
- **Purpose:** Configure Netlify build and deployment
- **Deployment:** Static frontend deployment

### GitHub Actions Workflows
- **Location:** `.github/workflows/`
- **Files:**
  - `deploy.yml` - Frontend deployment to Netlify
  - `backend.yml` - Backend validation and testing

## Deployment Process

### Frontend (Netlify)
1. Code pushed to GitHub
2. GitHub Actions runs build test
3. Automatic deployment to Netlify
4. Live on `https://your-site.netlify.app`

### Backend (Your Server)
1. Code pushed to GitHub
2. GitHub Actions runs tests and linting
3. Manual deployment to your server
4. Keep running on localhost or cloud provider

## Environment Setup

### Required for CI/CD

**GitHub Secrets:**
```
NETLIFY_SITE_ID
NETLIFY_AUTH_TOKEN
```

**Netlify Environment Variables:**
```
REACT_APP_API_URL=http://localhost:5000
```

### Required for Local Development

**Backend .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agb_planner
JWT_SECRET=your-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

## Monitoring

### GitHub Actions
Dashboard: https://github.com/agbitsolutions/AGB_IT_Planner/actions

### Netlify
Dashboard: https://app.netlify.com

## Offline Mode

Frontend can display cached data when backend is offline:
- Last synchronization stored in localStorage
- Real-time updates resume when backend is online
- Users can view historical data

