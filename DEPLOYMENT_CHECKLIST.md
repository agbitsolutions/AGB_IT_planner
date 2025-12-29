# 🚀 AGB Planner - Complete Deployment Checklist

## ✅ Pre-Deployment (Local - COMPLETED)

- [x] SQLite3 migration complete
- [x] All models converted to Sequelize
- [x] All controllers updated
- [x] Server tested locally
- [x] API endpoints responding
- [x] Database file created and working

## 📦 Package for Deployment

### Files to Upload to Hostinger:

```
agb_planner/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env (create on server)
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
└── uploads/ (create on server)
```

### Files NOT to Upload:
- `node_modules/` (will install on server)
- `database.sqlite` (will be created on server)
- `.git/` (optional)
- `*.log` files

## 🌐 Hostinger Deployment Steps

### Step 1: Prepare SSH Access

1. **Get SSH credentials from Hostinger:**
   - Log into Hostinger hPanel
   - Go to "Advanced" → "SSH Access"
   - Note your SSH details:
     - Host: Usually `your_domain.com` or an IP
     - Username: Your Hostinger username
     - Password: Your Hostinger password
     - Port: Usually 22

2. **Test SSH connection from your local machine:**
```bash
ssh your_username@admin.agbitsolutions.com
# or
ssh your_username@your_server_ip
```

### Step 2: Upload Files to Hostinger

**Option A: Using Git (Recommended)**

On your local machine:
```bash
# Initialize git repo if not already
cd /home/user/agb_planner
git init
git add .
git commit -m "Initial commit - SQLite3 migration"

# Push to your repository (GitHub, GitLab, etc.)
git remote add origin YOUR_GIT_REPO_URL
git push -u origin main
```

On Hostinger server (via SSH):
```bash
cd ~/public_html
git clone YOUR_GIT_REPO_URL admin.agbitsolutions.com
```

**Option B: Using SCP (From Local Machine)**

```bash
# Upload entire directory
scp -r /home/user/agb_planner your_username@admin.agbitsolutions.com:~/public_html/
```

**Option C: Using FileZilla/FTP**

1. Open FileZilla
2. Connect to your Hostinger server:
   - Host: `sftp://admin.agbitsolutions.com`
   - Username: Your Hostinger username
   - Password: Your Hostinger password
   - Port: 22
3. Upload the `agb_planner` folder to `/public_html/`

### Step 3: Configure Node.js on Hostinger

1. **Log into Hostinger hPanel**
2. **Navigate to**: Advanced → Setup Node.js App
3. **Click "CREATE APPLICATION"**
4. **Configure:**
   - Node.js version: `18.x` or `20.x`
   - Application mode: `Production`
   - Application root: `/public_html/admin.agbitsolutions.com/backend`
   - Application URL: `admin.agbitsolutions.com`
   - Application startup file: `server.js`
   - Port: `5000` (or assigned by Hostinger)
   - Environment variables:
     ```
     NODE_ENV=production
     DB_PATH=/home/your_username/public_html/admin.agbitsolutions.com/database.sqlite
     PORT=5000
     JWT_SECRET=change_to_random_secret_key_production
     ```
5. **Click "CREATE"**

### Step 4: Deploy via SSH

SSH into your server:

```bash
ssh your_username@admin.agbitsolutions.com
```

Then run:

```bash
cd ~/public_html/admin.agbitsolutions.com
chmod +x hostinger-deploy.sh
./hostinger-deploy.sh
```

This will:
- Install dependencies
- Create .env file
- Initialize database
- Set permissions
- Start PM2 process
- Test the application

### Step 5: Configure Domain & SSL

1. **In Hostinger hPanel:**
   - Go to "Domains"
   - Add subdomain: `admin.agbitsolutions.com`
   - Point to: `/public_html/admin.agbitsolutions.com`

2. **Enable SSL:**
   - Go to "SSL"
   - Select `admin.agbitsolutions.com`
   - Click "Install SSL" (Let's Encrypt - Free)
   - Enable "Force HTTPS"

3. **Configure .htaccess** (in subdomain root):

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy API requests to Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Serve frontend files
DirectoryIndex index.html
```

### Step 6: Update Frontend Configuration

SSH to server and edit:

```bash
cd ~/public_html/admin.agbitsolutions.com/frontend/js
nano config.js
```

Update to:
```javascript
const API_BASE_URL = 'https://admin.agbitsolutions.com/api';
export { API_BASE_URL };
```

### Step 7: Setup Automated Backups

```bash
cd ~/public_html/admin.agbitsolutions.com
chmod +x hostinger-backup.sh

# Edit the backup script to update paths
nano hostinger-backup.sh
# Update: your_username to your actual username

# Make backup directory
mkdir -p ~/backups/agb_planner

# Test backup script
./hostinger-backup.sh

# Setup cron job for daily backups at 2 AM
crontab -e
# Add this line:
0 2 * * * /home/your_username/public_html/admin.agbitsolutions.com/hostinger-backup.sh >> /home/your_username/backups/agb_planner/cron.log 2>&1
```

### Step 8: Verify Deployment

1. **Test API:**
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

2. **Test Frontend:**
Open browser: `https://admin.agbitsolutions.com`

3. **Check PM2 Status:**
```bash
pm2 status
pm2 logs agb-planner
```

4. **Check Database:**
```bash
ls -lh ~/public_html/admin.agbitsolutions.com/database.sqlite
```

## 🔧 Post-Deployment Configuration

### Update Environment Variables

```bash
cd ~/public_html/admin.agbitsolutions.com/backend
nano .env
```

Update:
```env
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=YOUR_SUPER_RANDOM_SECRET_KEY_HERE_CHANGE_THIS
```

Generate strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Restart after changes:
```bash
pm2 restart agb-planner
```

### Setup Monitoring

```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate

# View real-time logs
pm2 logs agb-planner --lines 100

# Monitor resources
pm2 monit
```

## 🆘 Troubleshooting

### Issue: Application not starting

```bash
# Check PM2 logs
pm2 logs agb-planner --lines 50

# Check Node.js errors
cd ~/public_html/admin.agbitsolutions.com/backend
node server.js
```

### Issue: Database errors

```bash
# Check database file
ls -lh database.sqlite

# Check permissions
chmod 644 database.sqlite

# Recreate database
rm database.sqlite
node -e "import('./config/database.js').then(m => m.connectDB())"
```

### Issue: Cannot access API

```bash
# Check if app is running
pm2 status

# Check port
netstat -tulpn | grep 5000

# Test locally
curl http://localhost:5000/api/health
```

### Issue: SSL not working

1. In Hostinger hPanel, reinstall SSL certificate
2. Check `.htaccess` has HTTPS redirect
3. Clear browser cache
4. Wait 5-10 minutes for SSL to propagate

## 📊 Maintenance Commands

```bash
# View application status
pm2 status agb-planner

# Restart application
pm2 restart agb-planner

# Stop application
pm2 stop agb-planner

# View logs
pm2 logs agb-planner

# Clear logs
pm2 flush

# Database backup
./hostinger-backup.sh

# Database optimization
sqlite3 database.sqlite "VACUUM;"

# Update application
cd ~/public_html/admin.agbitsolutions.com
git pull  # if using git
npm install
pm2 restart agb-planner
```

## 📞 Support Contacts

- **Hostinger Support**: https://support.hostinger.com (24/7 live chat)
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Sequelize Documentation**: https://sequelize.org/docs/

## ✅ Deployment Complete Checklist

- [ ] Files uploaded to Hostinger
- [ ] Node.js app configured in hPanel
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with production values
- [ ] Database initialized
- [ ] PM2 process running
- [ ] Domain configured (admin.agbitsolutions.com)
- [ ] SSL certificate installed and working
- [ ] API responding (test /api/health)
- [ ] Frontend loading correctly
- [ ] Automated backups configured
- [ ] Monitoring setup (PM2)
- [ ] Documentation reviewed

## 🎉 You're Live!

Your application should now be running at:
- **Frontend**: https://admin.agbitsolutions.com
- **API**: https://admin.agbitsolutions.com/api
- **Health Check**: https://admin.agbitsolutions.com/api/health

---

**Deployment Date**: 2025-12-29  
**Database**: SQLite3  
**Hosting**: Hostinger  
**Domain**: admin.agbitsolutions.com

**Monthly Cost**: $0 for database! 🎉
