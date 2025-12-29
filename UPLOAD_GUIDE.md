# 📤 Upload Code to Hostinger

You're already logged into Hostinger! Now you need to upload your code. Choose one method:

---

## 🚀 Method 1: SCP Upload (Recommended - Fast)

Open a **NEW terminal window** on your **local machine** (keep the SSH session open):

```bash
cd /home/user/agb_planner

# Upload backend and frontend
scp -P 65002 -r backend frontend u544547223@89.117.157.109:~/public_html/admin.agbitsolutions.com/

# Upload server setup script
scp -P 65002 server-setup.sh u544547223@89.117.157.109:~/
```

Password: `Agbitsolutions@143`

Then go back to your SSH session and run:
```bash
chmod +x ~/server-setup.sh
~/server-setup.sh
```

---

## 📁 Method 2: Create Archive & Upload

### On your local machine (new terminal):
```bash
cd /home/user/agb_planner
tar -czf agb_planner.tar.gz backend/ frontend/ server-setup.sh
scp -P 65002 agb_planner.tar.gz u544547223@89.117.157.109:~/
```

### Then in your SSH session:
```bash
cd ~/public_html
mkdir -p admin.agbitsolutions.com
cd admin.agbitsolutions.com
tar -xzf ~/agb_planner.tar.gz
chmod +x server-setup.sh
./server-setup.sh
```

---

## 🌐 Method 3: Git Clone (If you have a repo)

### In your SSH session:
```bash
cd ~/public_html
git clone <your-github-repo-url> admin.agbitsolutions.com
cd admin.agbitsolutions.com
./server-setup.sh
```

---

## 🖥️ Method 4: FileZilla (GUI)

1. Download FileZilla: https://filezilla-project.org/
2. Connect:
   - Host: `sftp://89.117.157.109`
   - Port: `65002`
   - Username: `u544547223`
   - Password: `Agbitsolutions@143`
3. Navigate to: `public_html/admin.agbitsolutions.com/`
4. Upload: `backend/` and `frontend/` folders
5. Upload: `server-setup.sh`
6. In SSH session: `chmod +x ~/server-setup.sh && ~/server-setup.sh`

---

## ✅ After Upload

Once files are uploaded, run in your SSH session:

```bash
chmod +x ~/server-setup.sh
~/server-setup.sh
```

The script will:
- ✅ Install dependencies
- ✅ Setup database
- ✅ Install PM2
- ✅ Start your application
- ✅ Test API

---

## 🔍 Verify Upload

To check if files uploaded correctly:

```bash
ls -la ~/public_html/admin.agbitsolutions.com/
```

You should see:
- `backend/` directory
- `frontend/` directory
- `server-setup.sh` script

---

## 💡 Quick Tip

**Fastest method**: Use Method 1 (SCP) - just one command and it's done!
