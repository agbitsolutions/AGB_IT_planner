# Netlify Site URL Guide

## Your Current Setup

You have a Netlify site with ID: **8d715c81-b9d6-4ea6-9c4f-ae1489fe1702**

Site name: **agbitsolutions**

## Why You're Seeing 404

The URL you visited: `https://agbitsolutions.netlify.app/`

This is showing 404 because:
1. The repository hasn't been connected to this Netlify site yet, OR
2. No code has been deployed yet

## Next Steps to Fix It

### Option 1: Connect GitHub Repo to Netlify (Recommended)

1. **Open Netlify Dashboard**
   - Go to https://app.netlify.com
   - Sign in with agbitsolutions247@gmail.com

2. **Add Your GitHub Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Search for: `AGB_IT_Planner`
   - Select: `agbitsolutions/AGB_IT_Planner`

3. **Configure Build Settings**
   - Build command: `npm install && npm run build` (or leave default)
   - Publish directory: `frontend`
   - Click "Deploy site"

4. **Wait for Deployment**
   - GitHub Actions will trigger automatically
   - Netlify will build and deploy
   - Takes about 2-3 minutes

5. **Access Your Site**
   - Once deployed, you'll get a unique URL
   - Or use: https://agbitsolutions.netlify.app/

### Option 2: Manual Deploy (Quick Test)

1. **Build Frontend**
   ```bash
   cd /home/user/agb_planner/frontend
   npm run build
   ```

2. **Deploy with Netlify CLI**
   ```bash
   npx netlify deploy --prod --dir=frontend
   ```

3. **Your Site is Live!**
   - URL: https://agbitsolutions.netlify.app/

## Important: Backend Integration

Your frontend is deployed on Netlify (CDN), but backend stays on your machine.

**Frontend** → Netlify CDN (always online)
**Backend** → Your localhost:5000 (needs MongoDB connection)

This is configured in `frontend/js/config.js`:
```javascript
const API_URL = 'http://localhost:5000';
```

### For Production:
You need to deploy backend to a cloud server too (Heroku, Railway, AWS, etc.)

## Current Site Status

- ✅ Site ID created: 8d715c81-b9d6-4ea6-9c4f-ae1489fe1702
- ✅ GitHub Secrets configured
- ⏳ Repository connected (waiting for you to link)
- ⏳ Code deployed (will happen after you connect repo)

## Checklist

- [ ] Read MONGODB_SETUP.md (fix MongoDB first!)
- [ ] Configure MongoDB Atlas connection
- [ ] Run `./start.sh` and verify it works
- [ ] Visit Netlify dashboard: https://app.netlify.com
- [ ] Connect GitHub repository
- [ ] Monitor first deployment
- [ ] Test at https://agbitsolutions.netlify.app/

## If Deployment Still Fails

Check GitHub Actions:
1. Go to https://github.com/agbitsolutions/AGB_IT_Planner
2. Click "Actions" tab
3. View workflow logs
4. Fix any errors and push again

---

**TL;DR:** You need to connect your GitHub repo to this Netlify site in the Netlify dashboard.
