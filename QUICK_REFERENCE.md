# 📝 Quick Reference Card

## 🚀 One-Command Deploy

```bash
# SSH into Hostinger
ssh your_username@admin.agbitsolutions.com

# Navigate and deploy
cd ~/public_html/admin.agbitsolutions.com && chmod +x hostinger-deploy.sh && ./hostinger-deploy.sh
```

## 📁 Important Paths

| What | Local | Hostinger |
|------|-------|-----------|
| Project Root | `/home/user/agb_planner` | `~/public_html/admin.agbitsolutions.com` |
| Backend | `/home/user/agb_planner/backend` | `~/public_html/admin.agbitsolutions.com/backend` |
| Database | `/home/user/agb_planner/database.sqlite` | `~/public_html/admin.agbitsolutions.com/database.sqlite` |
| Frontend | `/home/user/agb_planner/frontend` | `~/public_html/admin.agbitsolutions.com/frontend` |

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | https://admin.agbitsolutions.com |
| API | https://admin.agbitsolutions.com/api |
| Health Check | https://admin.agbitsolutions.com/api/health |
| Hostinger hPanel | https://hpanel.hostinger.com |

## 💻 Essential Commands

### Local Development
```bash
cd /home/user/agb_planner/backend
npm install                    # Install dependencies
npm start                      # Start server
curl http://localhost:5000/api/health  # Test API
```

### Hostinger Production
```bash
ssh user@admin.agbitsolutions.com      # Connect
cd ~/public_html/admin.agbitsolutions.com
pm2 status                             # Check status
pm2 restart agb-planner               # Restart app
pm2 logs agb-planner                  # View logs
./hostinger-backup.sh                 # Backup database
```

### Database Commands
```bash
# Local
sqlite3 database.sqlite
.tables                        # List tables
.schema teams                  # Show table structure
SELECT * FROM teams;           # Query data
.quit                          # Exit

# Production
cd ~/public_html/admin.agbitsolutions.com
sqlite3 database.sqlite "SELECT COUNT(*) FROM teams;"
sqlite3 database.sqlite "VACUUM;"  # Optimize
```

## 🔑 SSH Connection

```bash
# Connect
ssh your_username@admin.agbitsolutions.com

# With password authentication
ssh -o PreferredAuthentications=password user@admin.agbitsolutions.com

# Upload files
scp -r /home/user/agb_planner user@admin.agbitsolutions.com:~/public_html/
```

## 📊 PM2 Commands

```bash
pm2 start server.js --name agb-planner    # Start app
pm2 restart agb-planner                   # Restart
pm2 stop agb-planner                      # Stop
pm2 delete agb-planner                    # Remove
pm2 logs agb-planner                      # View logs
pm2 logs agb-planner --lines 100          # Last 100 lines
pm2 monit                                 # Monitor
pm2 status                                # Status
pm2 save                                  # Save config
pm2 startup                               # Auto-start on reboot
```

## 🗂️ File Operations

```bash
# View file
cat filename

# Edit file
nano filename
# Save: Ctrl+X, Y, Enter

# Copy file
cp source destination

# Move/Rename
mv old_name new_name

# Delete file
rm filename

# Delete directory
rm -rf directory

# Create directory
mkdir directory_name

# Change permissions
chmod 644 file.txt       # rw-r--r--
chmod 755 script.sh      # rwxr-xr-x
chmod +x script.sh       # Make executable
```

## 🔍 Troubleshooting

### API not responding
```bash
pm2 restart agb-planner
pm2 logs agb-planner --lines 50
curl http://localhost:5000/api/health
```

### Database issues
```bash
ls -lh database.sqlite           # Check file exists
chmod 644 database.sqlite        # Fix permissions
sqlite3 database.sqlite ".tables"  # Verify tables
```

### Port already in use
```bash
netstat -tulpn | grep 5000       # Find what's using port
pm2 delete all                   # Stop all PM2 processes
pm2 start server.js --name agb-planner
```

### Out of memory
```bash
free -h                          # Check memory
pm2 restart agb-planner         # Restart app
```

## 📦 Package Management

```bash
# Install dependencies
npm install

# Install production only
npm install --production

# Add new package
npm install package-name

# Update packages
npm update

# Check for updates
npm outdated
```

## 🔐 Security

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Secure .env file
chmod 600 .env

# Check file permissions
ls -la .env
```

## 📸 Backup Commands

```bash
# Manual backup
cp database.sqlite backup_$(date +%Y%m%d).sqlite

# Automated backup
./hostinger-backup.sh

# Restore backup
cp backup_20251229.sqlite database.sqlite
pm2 restart agb-planner

# List backups
ls -lh ~/backups/agb_planner/
```

## 🌐 Domain & SSL

### Check SSL status
```bash
curl -I https://admin.agbitsolutions.com
# Look for: HTTP/2 200
```

### Force HTTPS (.htaccess)
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 📧 Cron Jobs

```bash
# Edit crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/hostinger-backup.sh

# Restart server every Sunday at 3 AM
0 3 * * 0 pm2 restart agb-planner

# List cron jobs
crontab -l

# Remove all cron jobs
crontab -r
```

## 🆘 Emergency Commands

### Server not responding
```bash
pm2 kill                        # Kill PM2
pm2 start server.js --name agb-planner
```

### Database corrupted
```bash
cp database.sqlite database_backup.sqlite
sqlite3 database.sqlite "PRAGMA integrity_check;"
# If corrupted, restore from backup
```

### Out of disk space
```bash
df -h                           # Check disk usage
du -sh ~/public_html/*         # Check directory sizes
pm2 flush                       # Clear PM2 logs
find ~/logs -type f -mtime +7 -delete  # Delete old logs
```

## 📞 Quick Contacts

| Service | Contact |
|---------|---------|
| Hostinger Support | https://support.hostinger.com (Live Chat 24/7) |
| hPanel Login | https://hpanel.hostinger.com |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FINAL_SUMMARY.md` | Complete overview |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step deployment |
| `SSH_GUIDE.md` | SSH connection guide |
| `HOSTINGER_DEPLOYMENT_GUIDE.md` | Detailed Hostinger guide |
| `SQLITE_MIGRATION_SUMMARY.md` | Technical migration details |

## ⚡ Speed Commands

```bash
# Full deployment (run on Hostinger)
cd ~/public_html/admin.agbitsolutions.com && ./hostinger-deploy.sh

# Quick restart
pm2 restart agb-planner && pm2 logs agb-planner

# Status check
pm2 status && du -sh database.sqlite && curl -I https://admin.agbitsolutions.com/api/health

# Complete backup
cd ~/public_html/admin.agbitsolutions.com && ./hostinger-backup.sh && ls -lh ~/backups/agb_planner/
```

---

**Print this page and keep it handy!** 📄
