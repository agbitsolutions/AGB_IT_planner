# 🔐 SSH Connection Guide for Hostinger

## Step 1: Find Your SSH Credentials

### In Hostinger hPanel:

1. Log into your Hostinger account: https://hpanel.hostinger.com
2. Click on your hosting plan
3. Go to **"Advanced"** tab
4. Click **"SSH Access"**

You'll see:
```
SSH Access: Enabled ✓
System user: your_username
Hostname: your_server_ip or domain
Port: 22
Password: (use your Hostinger password)
```

## Step 2: Connect from Your Terminal

### On Linux/Mac (Your Current System):

Open terminal and run:

```bash
ssh your_username@admin.agbitsolutions.com
# or if that doesn't work:
ssh your_username@your_server_ip
```

**Example:**
```bash
ssh u123456789@admin.agbitsolutions.com
```

When prompted:
- Type `yes` to accept the fingerprint (first time only)
- Enter your Hostinger password

### First Connection:

```
$ ssh your_username@admin.agbitsolutions.com
The authenticity of host 'admin.agbitsolutions.com' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
your_username@admin.agbitsolutions.com's password: [enter password]

Welcome to Hostinger!
Last login: Sun Dec 29 10:00:00 2025

[your_username@host ~]$
```

## Step 3: Navigate to Your Web Directory

Once connected:

```bash
# Check current location
pwd

# Go to your web root
cd ~/public_html

# List contents
ls -la

# Create directory for your subdomain (if it doesn't exist)
mkdir -p admin.agbitsolutions.com
cd admin.agbitsolutions.com
```

## Step 4: Upload Files

### Option A: Using Git (Recommended)

**First, push your code to GitHub/GitLab:**

On your local machine:
```bash
cd /home/user/agb_planner

# If you haven't initialized git yet:
git init
git add .
git commit -m "SQLite3 migration complete"

# Create a repo on GitHub, then:
git remote add origin https://github.com/yourusername/agb-planner.git
git push -u origin main
```

**Then, on Hostinger server:**
```bash
cd ~/public_html
git clone https://github.com/yourusername/agb-planner.git admin.agbitsolutions.com
```

### Option B: Using SCP (From Your Local Terminal)

Open a **NEW terminal window** on your local machine (don't close SSH):

```bash
# Upload everything
cd /home/user
scp -r agb_planner your_username@admin.agbitsolutions.com:~/public_html/

# This will copy the entire folder
```

### Option C: Using SFTP/FileZilla

If you prefer a GUI:

1. **Download FileZilla**: https://filezilla-project.org/
2. **Connect:**
   - Protocol: SFTP
   - Host: admin.agbitsolutions.com
   - Username: your_hostinger_username
   - Password: your_hostinger_password
   - Port: 22
3. **Navigate** on right side to: `/public_html/`
4. **Upload** your `agb_planner` folder from left side

## Step 5: Install Dependencies

Back in your SSH terminal:

```bash
cd ~/public_html/admin.agbitsolutions.com/backend

# Install production dependencies
npm install --production

# This will take a few minutes
```

## Step 6: Create Environment File

```bash
# Create .env file
cd ~/public_html/admin.agbitsolutions.com/backend
cat > .env << 'EOF'
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECRET
EOF

# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and edit .env
nano .env
# Replace JWT_SECRET with the generated value
# Press Ctrl+X, then Y, then Enter to save
```

## Step 7: Run Deployment Script

```bash
cd ~/public_html/admin.agbitsolutions.com

# Make script executable
chmod +x hostinger-deploy.sh

# Run deployment
./hostinger-deploy.sh
```

The script will:
- ✅ Install dependencies
- ✅ Initialize database
- ✅ Set permissions
- ✅ Start PM2 process
- ✅ Test the application

## Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs agb-planner

# Test API locally
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"AGB Planner API is running",...}
```

## Step 9: Configure Domain in Hostinger

### In Hostinger hPanel:

1. Go to **"Domains"**
2. Click **"Manage"** on your domain
3. Click **"DNS / Nameservers"**
4. Add subdomain:
   - Type: A Record
   - Name: admin
   - Points to: Your server IP
   - TTL: 3600

Or simpler:

1. Go to **"Subdomains"**
2. Click **"Create Subdomain"**
3. Enter: `admin`
4. Document root: `/public_html/admin.agbitsolutions.com`
5. Click **"Create"**

## Step 10: Enable SSL

### In Hostinger hPanel:

1. Go to **"SSL"**
2. Find **admin.agbitsolutions.com**
3. Click **"Install SSL"**
4. Choose **"Let's Encrypt"** (Free)
5. Wait 5-10 minutes for installation
6. Enable **"Force HTTPS"**

## Step 11: Test Your Deployment

### From your local machine:

```bash
# Test API
curl https://admin.agbitsolutions.com/api/health

# Should return:
# {"success":true,"message":"AGB Planner API is running",...}
```

### In browser:
- Frontend: https://admin.agbitsolutions.com
- API: https://admin.agbitsolutions.com/api

## 🆘 Common Issues

### Issue: "Permission denied (publickey)"

**Solution:**
```bash
# Make sure you're using password authentication
ssh -o PreferredAuthentications=password your_username@admin.agbitsolutions.com
```

### Issue: "Connection refused"

**Solutions:**
1. Check if SSH is enabled in Hostinger hPanel
2. Try using the server IP instead of domain
3. Check if port 22 is correct (might be different)

### Issue: "npm: command not found"

**Solution:**
```bash
# Node.js needs to be set up in Hostinger hPanel first
# Go to: Advanced → Setup Node.js App
```

### Issue: "Database locked"

**Solution:**
```bash
# Stop PM2 process
pm2 stop agb-planner

# Wait a few seconds
sleep 5

# Start again
pm2 start agb-planner
```

## 📋 Useful SSH Commands

```bash
# Check your location
pwd

# List files
ls -la

# Change directory
cd path/to/directory

# Go back one level
cd ..

# Go to home directory
cd ~

# View file contents
cat filename

# Edit file
nano filename

# Check disk space
df -h

# Check directory size
du -sh *

# Find files
find . -name "*.js"

# Check running processes
ps aux | grep node

# Exit SSH
exit
```

## 🔒 Security Tips

1. **Change default passwords** after first login
2. **Use SSH keys** instead of passwords (more secure)
3. **Never share** your SSH credentials
4. **Keep .env file secure** (chmod 600)
5. **Regularly update** dependencies

## 💡 Pro Tips

1. **Use screen/tmux** for long-running commands:
```bash
# Install screen
# Hostinger usually has it pre-installed

# Start a screen session
screen -S deployment

# Run your commands
# Detach with: Ctrl+A, then D
# Reattach with: screen -r deployment
```

2. **Set up SSH key authentication** (more secure):
```bash
# On your local machine:
ssh-keygen -t rsa -b 4096
ssh-copy-id your_username@admin.agbitsolutions.com
```

3. **Create aliases** for easy access:
```bash
# On your local machine
nano ~/.bashrc

# Add:
alias hostinger="ssh your_username@admin.agbitsolutions.com"

# Now just type: hostinger
```

## ✅ Quick Deployment Checklist

- [ ] SSH credentials obtained from Hostinger
- [ ] Successfully connected via SSH
- [ ] Files uploaded to server
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with secure JWT_SECRET
- [ ] Deployment script executed
- [ ] PM2 process running
- [ ] Domain configured in hPanel
- [ ] SSL certificate installed
- [ ] API tested and responding
- [ ] Frontend accessible

## 🎉 You're Done!

Your application should now be live at:
- **https://admin.agbitsolutions.com**

---

**Need Help?**
- Check `DEPLOYMENT_CHECKLIST.md` for detailed steps
- Check `HOSTINGER_DEPLOYMENT_GUIDE.md` for troubleshooting
- Contact Hostinger support (24/7 live chat)
