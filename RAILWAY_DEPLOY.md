# Deploy to Railway

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## Manual Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Initialize Project
```bash
cd /path/to/agb_planner
railway init
```

### 4. Link to Project
```bash
railway link
```

### 5. Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set DB_PATH=./database.sqlite
railway variables set JWT_SECRET=your-random-secret
railway variables set EMAIL_HOST=smtp.gmail.com
railway variables set EMAIL_PORT=587
railway variables set EMAIL_USER=your_email@gmail.com
railway variables set EMAIL_PASS=your_app_password
```

### 6. Deploy
```bash
railway up
```

## Configuration

Railway automatically detects the `railway.json` configuration:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install --production"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Database Persistence

Railway provides persistent storage. Your SQLite database will be preserved across deployments.

## Environment Setup

### Via Dashboard

1. Go to Railway Dashboard
2. Select your project
3. Navigate to Variables tab
4. Add all required environment variables

### Via CLI

```bash
railway variables
```

## Verify Deployment

```bash
curl https://your-app.railway.app/api/health
```

## Logs

```bash
railway logs
```

## Notes

- Backend and frontend both deployed
- Persistent storage included
- Auto-deploy on git push (if connected to GitHub)
- No cold starts (always-on service)
- SQLite database persists across deployments
