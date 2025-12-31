# Deploy to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/agbitsolutions/AGB_IT_planner)

## Manual Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
# From project root
vercel

# For production
vercel --prod
```

### 4. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
NODE_ENV=production
DB_PATH=/tmp/database.sqlite
JWT_SECRET=<your-random-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Important:** SQLite files in `/tmp` are ephemeral. For persistent storage, consider:
- Vercel Postgres
- External database (PlanetScale, Railway, etc.)
- Or deploy backend separately on Railway/Render

## Verify Deployment

```bash
curl https://your-app.vercel.app/api/health
```

## Notes

- Frontend served as static files
- Backend runs as serverless functions
- Cold starts may occur (~1-2 seconds)
- No persistent SQLite storage (use external DB or deploy backend elsewhere)
