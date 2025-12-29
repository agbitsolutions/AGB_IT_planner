# Hostinger Deployment Guide for AGB Planner

## Overview
This guide will help you deploy the AGB Planner application to your Hostinger subdomain **admin.agbitsolutions.com** using SQLite3 database.

## Prerequisites
- Hostinger account with SSH access
- Domain/subdomain configured: admin.agbitsolutions.com
- Node.js installed on Hostinger server (usually available)

## Step 1: Prepare Your Local Application

### 1.1 Install New Dependencies
```bash
cd /home/user/agb_planner/backend
npm install
```

This will install:
- `sequelize`: ^6.35.0
- `sqlite3`: ^5.1.6

### 1.2 Create Production Environment File
Create `.env` file in backend folder:

```bash
# Database
DB_PATH=./database.sqlite
NODE_ENV=production

# Server
PORT=5000

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Optional: Email service (if using notifications)
EMAIL_HOST=smtp.your-email.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Step 2: Connect to Hostinger via SSH

### 2.1 SSH Login
```bash
ssh your_username@your_server_ip
# or
ssh your_username@admin.agbitsolutions.com
```

You'll be prompted for your password.

### 2.2 Navigate to Web Directory
```bash
cd ~/public_html
# or if you have a specific directory for subdomain:
cd ~/public_html/admin.agbitsolutions.com
```

## Step 3: Upload Your Application

### Option A: Using Git (Recommended)

1. **On Hostinger Server:**
```bash
cd ~/public_html/admin.agbitsolutions.com
git clone <your-git-repository-url> .
cd backend
npm install --production
```

### Option B: Using FTP/SFTP

1. Use FileZilla or any SFTP client
2. Connect to your Hostinger server
3. Upload the entire `agb_planner` folder to `~/public_html/admin.agbitsolutions.com/`
4. Then SSH in and run:
```bash
cd ~/public_html/admin.agbitsolutions.com/backend
npm install --production
```

### Option C: Using SCP (from your local machine)

```bash
# From your local machine
cd /home/user
scp -r agb_planner your_username@your_server_ip:~/public_html/admin.agbitsolutions.com/
```

## Step 4: Configure Node.js Application on Hostinger

### 4.1 Create or Edit .htaccess
In your subdomain root directory, create/edit `.htaccess`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy API requests to Node.js backend
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Serve static frontend files
DirectoryIndex index.html
```

### 4.2 Setup Node.js Application via Hostinger Panel

1. Log in to **Hostinger Control Panel (hPanel)**
2. Navigate to **Advanced → Setup Node.js App**
3. Click **CREATE APPLICATION**
4. Configure:
   - **Node.js version**: 18.x or later
   - **Application mode**: Production
   - **Application root**: `/public_html/admin.agbitsolutions.com/backend`
   - **Application URL**: `admin.agbitsolutions.com`
   - **Application startup file**: `server.js`
   - **Port**: 5000 (or whatever port Hostinger assigns)

5. Click **CREATE**

### 4.3 Set Environment Variables in Hostinger Panel

In the Node.js application settings, add environment variables:
```
NODE_ENV=production
PORT=5000
DB_PATH=/home/your_username/public_html/admin.agbitsolutions.com/database.sqlite
JWT_SECRET=your_super_secret_jwt_key_here
```

## Step 5: Setup Process Manager (PM2)

SSH into your server and install PM2 to keep your app running:

```bash
npm install -g pm2

# Navigate to your backend directory
cd ~/public_html/admin.agbitsolutions.com/backend

# Start your application with PM2
pm2 start server.js --name agb-planner

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup

# Check status
pm2 status
pm2 logs agb-planner
```

### PM2 Useful Commands
```bash
pm2 restart agb-planner  # Restart app
pm2 stop agb-planner     # Stop app
pm2 delete agb-planner   # Remove app from PM2
pm2 logs agb-planner     # View logs
pm2 monit                # Monitor all apps
```

## Step 6: Configure Frontend

### 6.1 Update API Configuration
Edit `/home/user/agb_planner/frontend/js/config.js`:

```javascript
const API_BASE_URL = 'https://admin.agbitsolutions.com/api';

export { API_BASE_URL };
```

### 6.2 Upload Frontend Files
Copy frontend files to the public root:

```bash
# On Hostinger server
cd ~/public_html/admin.agbitsolutions.com
cp -r frontend/* .
```

Or organize it better:
```bash
mkdir -p ~/public_html/admin.agbitsolutions.com
# Upload frontend to root
# Backend runs as separate service
```

## Step 7: Setup Database

The SQLite database will be created automatically on first run. To initialize with test data:

```bash
cd ~/public_html/admin.agbitsolutions.com/backend
node -e "
import { connectDB } from './config/database.js';
import './models/index.js';
connectDB().then(() => {
  console.log('Database initialized!');
  process.exit(0);
});
"
```

Or create a simple init script `init-db.js`:

```javascript
import { connectDB } from './config/database.js';
import './models/index.js';

connectDB().then(async () => {
  console.log('✅ Database initialized successfully!');
  console.log('Database file location:', process.env.DB_PATH || './database.sqlite');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});
```

Run it:
```bash
node init-db.js
```

## Step 8: Test Your Deployment

### 8.1 Test API
```bash
curl https://admin.agbitsolutions.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "AGB Planner API is running",
  "timestamp": "2025-12-29T..."
}
```

### 8.2 Test Frontend
Open browser and navigate to:
```
https://admin.agbitsolutions.com
```

## Step 9: SSL/HTTPS Configuration

Hostinger usually provides free SSL certificates. To enable:

1. Go to **Hostinger Control Panel**
2. Navigate to **SSL**
3. Select your subdomain: **admin.agbitsolutions.com**
4. Install free Let's Encrypt SSL certificate
5. Force HTTPS (usually automatic)

## Step 10: Backup Strategy

### 10.1 Database Backups
Create a backup script `/home/your_username/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/your_username/backups"
DB_PATH="/home/your_username/public_html/admin.agbitsolutions.com/database.sqlite"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH "$BACKUP_DIR/database_$DATE.sqlite"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "database_*.sqlite" -mtime +7 -delete

echo "Backup completed: database_$DATE.sqlite"
```

Make it executable and add to cron:
```bash
chmod +x ~/backup-db.sh

# Add to crontab (daily backup at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/your_username/backup-db.sh
```

## Troubleshooting

### Issue: Node.js app not starting

**Check logs:**
```bash
pm2 logs agb-planner
```

**Common fixes:**
- Ensure all dependencies are installed: `npm install`
- Check file permissions: `chmod -R 755 ~/public_html/admin.agbitsolutions.com`
- Verify environment variables are set correctly

### Issue: Cannot connect to database

**Check:**
```bash
# Verify database file exists and is writable
ls -la ~/public_html/admin.agbitsolutions.com/database.sqlite
```

**Fix permissions:**
```bash
chmod 644 ~/public_html/admin.agbitsolutions.com/database.sqlite
```

### Issue: API returns 502/504 errors

**Check if app is running:**
```bash
pm2 status
```

**Restart app:**
```bash
pm2 restart agb-planner
```

### Issue: CORS errors

Add to `backend/server.js` before other middleware:
```javascript
app.use(cors({
  origin: 'https://admin.agbitsolutions.com',
  credentials: true
}));
```

## Migration from MongoDB

Since we've already converted the codebase to use SQLite3:

1. ✅ Models converted from Mongoose to Sequelize
2. ✅ Database config updated to SQLite3
3. ✅ Package.json dependencies updated
4. ⚠️ Controllers need to be updated (in progress)

### To complete migration:
```bash
cd /home/user/agb_planner/backend
npm uninstall mongoose
npm install sequelize sqlite3
```

## Performance Tips

1. **Enable Gzip Compression** - Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

2. **Cache Static Assets** - Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

3. **Database Optimization**:
```bash
# Periodically vacuum the SQLite database
sqlite3 database.sqlite "VACUUM;"
```

## Security Checklist

- [ ] Change default JWT_SECRET in .env
- [ ] Enable HTTPS/SSL
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Keep Node.js and dependencies updated
- [ ] Regular database backups
- [ ] Use strong passwords for SSH access
- [ ] Consider using environment-specific configs
- [ ] Add rate limiting to API endpoints (optional)

## Support

For Hostinger-specific issues:
- Hostinger Knowledge Base: https://support.hostinger.com
- Live Chat Support (available in hPanel)

For application issues:
- Check PM2 logs: `pm2 logs agb-planner`
- Check server logs: Usually in `~/logs/` or via hPanel

## Next Steps

1. Install dependencies locally and test
2. Update remaining controllers (I can help with this)
3. Push code to Git repository
4. Deploy to Hostinger following this guide
5. Test thoroughly
6. Setup monitoring and backups

---

**Note**: SQLite3 is perfect for small to medium applications. If you expect very high traffic or concurrent users, consider PostgreSQL or MySQL in the future.
