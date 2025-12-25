# MongoDB Atlas Setup - 5 Minute Quick Start

## Problem
Your frontend "Create Team" button doesn't work because the backend can't connect to MongoDB.

## Solution: Free MongoDB in the Cloud

MongoDB Atlas is completely FREE and takes 5 minutes to set up.

---

## STEP 1: Create MongoDB Atlas Account (2 minutes)

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Use email: **agbitsolutions247@gmail.com**
4. Create a strong password
5. Click **"Create account"**
6. Verify your email
7. Log in

---

## STEP 2: Create Free Cluster (1 minute)

1. You'll see a welcome screen
2. Click **"Create"** (or **"Build a Database"**)
3. Choose **M0 Cluster** (FREE - highlighted in blue)
4. Click **"Create"**
5. Choose region closest to you
6. Click **"Create Cluster"**
7. **Wait 5-10 minutes** for cluster to set up (go make coffee ☕)

---

## STEP 3: Create Database User (1 minute)

1. Once cluster is ready, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Fill in:
   - **Username**: `agbplanner`
   - **Password**: Create strong password (save it!)
   - Example: `MySecurePass123!`
4. Click **"Add User"**

---

## STEP 4: Get Connection String (1 minute)

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"** (first option)
4. Select **"Node.js"** and version **5.x**
5. You'll see a connection string like:

```
mongodb+srv://agbplanner:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Copy this entire string**

---

## STEP 5: Update Your Backend (.env) (1 minute)

1. Open: `/home/user/agb_planner/backend/.env`
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/agb_planner`
3. Replace it with your connection string:

```
MONGODB_URI=mongodb+srv://agbplanner:MySecurePass123!@cluster0.xxxxx.mongodb.net/agb_planner?retryWrites=true&w=majority
```

**Important:** Replace `<password>` with your actual password from Step 3

---

## STEP 6: Test It! (1 minute)

```bash
cd /home/user/agb_planner
./start.sh
```

Open browser: **http://localhost:3000**

Try clicking **"Create Team"** - it should work now! ✅

---

## If Connection String Has Special Characters

If your password has: `@` or `#` or `%` or other special characters

Use this site to encode it: https://www.urlencoder.org/

For example:
- `MyPass@123` → encode to `MyPass%40123`
- `MyPass#456` → encode to `MyPass%23456`

Then put the encoded version in your connection string.

---

## Quick Reference

**Your MongoDB Setup:**
```
Email: agbitsolutions247@gmail.com
Username: agbplanner
Database: agb_planner
Atlas Cluster: (created above)
```

**Connection string format:**
```
mongodb+srv://agbplanner:PASSWORD@CLUSTER.mongodb.net/agb_planner?retryWrites=true&w=majority
```

---

## Troubleshooting

### "authentication failed"
- Check username/password spelling
- Make sure you're using the DATABASE user, not account password
- Verify in Atlas → Database Access

### "ECONNREFUSED" or timeout
- Cluster still setting up? Wait more minutes
- Check if IP is whitelisted:
  - Go to Atlas → Network Access
  - Click "Add IP Address"
  - Choose "Allow access from anywhere" (0.0.0.0/0) for development
  - Click "Confirm"

### "Cannot connect to database"
- Make sure full connection string is in .env
- Connection string should start with `mongodb+srv://`
- Not `mongodb://` (that's for local)

---

## Done! 🎉

Your app is now connected to MongoDB!

- Frontend buttons work ✅
- Backend saves data ✅
- Data persists ✅
- 24/7 cloud database ✅

**Next steps:**
1. Create teams, projects, tasks in your app
2. Deploy backend to cloud (optional, for Netlify site to access)
3. Share app with your team!

---

## Useful Commands

After setting up MongoDB:

```bash
# Start your app
./start.sh

# View backend logs
tail -f backend/backend.log

# View API docs
curl http://localhost:5000/api

# Test creating a team
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name":"My Team","description":"Test"}'
```

---

Need help? Check:
- MongoDB Atlas docs: https://docs.mongodb.com/atlas/
- Connection troubleshooting: https://docs.mongodb.com/atlas/troubleshoot-connection/
