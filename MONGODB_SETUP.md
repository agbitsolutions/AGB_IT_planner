# MongoDB Atlas Setup Guide

## Problem
Backend is trying to connect to MongoDB at `mongodb://localhost:27017/agb_planner` but it's not running locally.

## Solution: Use MongoDB Atlas (Cloud)

MongoDB Atlas is FREE for development and comes with:
- 512MB storage (free tier)
- Full MongoDB features
- Always online (no need to keep your computer on)
- Perfect for development and small projects

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Sign Up"
- Use email: agbitsolutions247@gmail.com
- Create password and verify email

### 2. Create Free Cluster
- Click "Create" (green button)
- Choose **M0 Cluster** (Free)
- Select region closest to you
- Click "Create Cluster"
- Wait 5-10 minutes for cluster to deploy

### 3. Create Database User
- Go to "Database Access" (left sidebar)
- Click "Add New Database User"
- Username: `agbplanner`
- Password: Create a strong password (save it!)
- Click "Add User"

### 4. Get Connection String
- Go to "Database" (left sidebar)
- Click "Connect" on your cluster
- Choose "Drivers" → "Node.js"
- Copy the connection string
- It looks like: `mongodb+srv://agbplanner:PASSWORD@cluster0.xxxxx.mongodb.net/agb_planner?retryWrites=true&w=majority`

### 5. Update Your .env File
Replace the MONGODB_URI in `/home/user/agb_planner/backend/.env`:

**OLD:**
```
MONGODB_URI=mongodb://localhost:27017/agb_planner
```

**NEW (from Atlas):**
```
MONGODB_URI=mongodb+srv://agbplanner:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agb_planner?retryWrites=true&w=majority
```

### 6. Test Connection
```bash
cd /home/user/agb_planner
./start.sh
```

You should see:
```
✅ Backend started
✅ Server running on port 5000
```

## Quick Commands

### Check Connection
```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "status": "ok",
  "timestamp": "2025-12-26T01:15:00.000Z"
}
```

### View Logs
```bash
tail -f backend/backend.log
```

## If Still Getting MongoDB Errors

### Check Your Connection String
- Is it `mongodb+srv://` (not `mongodb://`)?
- Is the password URL-encoded?
  - If password has `@`, replace with `%40`
  - If password has `#`, replace with `%23`
  - Use https://www.urlencoder.org/ to encode special chars

### Check IP Whitelist
- Go to MongoDB Atlas → Network Access
- Make sure your IP is whitelisted
- Or use `0.0.0.0/0` for development (all IPs)

### Check Database Name
- Make sure the database exists
- In Atlas, go to Collections → Create Database → Database: `agb_planner`

## Alternative: Local MongoDB

If you want to use MongoDB locally (not recommended for cloud deployment):

```bash
# Install MongoDB Community Edition
# Ubuntu:
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb

# Update .env to use local connection
MONGODB_URI=mongodb://localhost:27017/agb_planner

# Start your app
./start.sh
```

## Troubleshooting

### "buffering timed out after 10000ms"
- MongoDB connection string is wrong
- IP whitelist not configured
- Network connectivity issue

### "ECONNREFUSED 127.0.0.1:27017"
- You're trying to use local MongoDB but it's not running
- Use MongoDB Atlas instead (recommended)

### "Authentication failed"
- Username/password incorrect
- Check MongoDB Atlas → Database Access
- Verify password in connection string

## MongoDB Atlas Free Tier Limits

- ✅ 512MB storage (plenty for development)
- ✅ 3 nodes (replication)
- ✅ No credit card required
- ✅ Always online
- ✅ Full MongoDB features

## Once Everything Works

You're now ready to:
1. Run `./start.sh` to start both frontend and backend
2. Access http://localhost:3000
3. Deploy to production

---

**Need Help?**
Check the connection string in `backend/.env` first!
It should match exactly what MongoDB Atlas gives you.
