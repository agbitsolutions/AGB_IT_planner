# Database Storage Solution for Vercel + Hostinger

## ❌ Why SQLite on Hostinger Won't Work

### The Problem
You asked: "Can we keep database.sqlite file on Hostinger (public_html/) but make it accessible to Vercel planner?"

**Answer: NO - This won't work because:**

1. **Vercel serverless functions have read-only filesystem**
   - Each function execution gets a fresh, isolated environment
   - Can only write to `/tmp` (temporary, lost after function ends)
   - Cannot maintain persistent connections to external SQLite files

2. **SQLite requires direct filesystem access**
   - SQLite needs to read/write directly to a file
   - HTTP access won't work (you'd need to download entire DB each time)
   - File locking would fail across networks

3. **Performance nightmare**
   - Would need to download entire .sqlite file on every request
   - Multiple concurrent requests would cause corruption
   - No connection pooling possible

4. **Security risks**
   - Exposing database file in public_html/ is dangerous
   - Anyone could download your entire database
   - No access control

## ✅ Recommended Solutions

### Option 1: PostgreSQL (RECOMMENDED)
**Use a proper database service that both Vercel and Hostinger can access**

#### A. Railway.app (Free tier available)
```bash
# 1. Create PostgreSQL database on Railway
# 2. Get connection string
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# 3. Update both Vercel and Hostinger to use it
```

**Pros:**
- ✅ Free tier: 500MB storage, $5 credit/month
- ✅ Both Vercel and Hostinger can connect
- ✅ Persistent, reliable storage
- ✅ Automatic backups
- ✅ Supports migrations

**Setup:**
1. Create account on railway.app
2. Deploy PostgreSQL service
3. Copy connection URL
4. Update `backend/config/database.js` to support PostgreSQL
5. Add DATABASE_URL to both Vercel and Hostinger env vars

#### B. Supabase (Free tier)
```bash
DATABASE_URL=postgresql://postgres:pass@db.supabase.co:5432/postgres
```

**Pros:**
- ✅ Free tier: 500MB storage
- ✅ Real-time subscriptions
- ✅ Built-in auth (optional)
- ✅ REST API included
- ✅ Good documentation

#### C. Neon (Serverless Postgres)
```bash
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/neondb
```

**Pros:**
- ✅ Free tier: 3GB storage
- ✅ Serverless (scales to zero)
- ✅ Fast cold starts
- ✅ Optimized for serverless

### Option 2: Keep Current Approach (Simplest)
**Different storage for each platform**

**Vercel:**
- Use demo storage (in-memory) - Already implemented
- For production: Use Vercel Postgres (paid) or Railway PostgreSQL (free)

**Hostinger:**
- Use SQLite file (local)
- Store in `/home/username/agb_planner/backend/database.sqlite`
- NOT in public_html/ (security!)

**Railway:**
- Use SQLite file (works fine for Railway)

**Pros:**
- ✅ No code changes needed
- ✅ Already working
- ✅ Free (except Vercel Postgres if needed)

**Cons:**
- ❌ Different data on each platform
- ❌ Not suitable for production

### Option 3: MySQL on Hostinger
**Use Hostinger's included MySQL database**

```javascript
// backend/config/database.js
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306
  }
);
```

**Environment variables:**
```bash
DB_HOST=mysql.hostinger.com
DB_NAME=u123456_agbplanner
DB_USER=u123456_admin
DB_PASSWORD=your_password
```

**Pros:**
- ✅ Included with Hostinger hosting
- ✅ Both Vercel and Hostinger can connect
- ✅ No additional cost
- ✅ phpMyAdmin for management

**Cons:**
- ❌ Requires code changes (add MySQL support)
- ❌ Need to expose MySQL port or use SSH tunnel
- ❌ May have connection limits on shared hosting

### Option 4: MongoDB Atlas (Free tier)
**Cloud MongoDB database**

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agbplanner
```

**Pros:**
- ✅ Free tier: 512MB
- ✅ Both platforms can connect
- ✅ Good for JSON data
- ✅ Easy setup

**Cons:**
- ❌ Would need to rewrite models (already have Sequelize)
- ❌ Different query syntax

## 🎯 My Recommendation

### For Testing/Demo:
**Keep current approach** - Different storage per platform
- ✅ Works now
- ✅ No changes needed
- ✅ Free

### For Production:
**Use Railway PostgreSQL (Free tier)**

#### Why?
1. **Free** - 500MB + $5 credit/month (enough for small projects)
2. **Reliable** - Professional database service
3. **Compatible** - Works with both Vercel and Hostinger
4. **Easy migration** - Sequelize already supports PostgreSQL
5. **Scalable** - Can upgrade as needed

#### Quick Setup:
```bash
# 1. Install PostgreSQL driver
npm install pg pg-hstore

# 2. Update database.js (see code below)

# 3. Set environment variable on all platforms
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## 📝 Implementation for Railway PostgreSQL

### Step 1: Update `backend/config/database.js`

```javascript
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === '1';
const dbPath = path.join(__dirname, '../../database.sqlite');

let sequelize;
let dbAvailable = false;

// Priority 1: Use PostgreSQL if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });
    console.log('🐘 Using PostgreSQL database');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    sequelize = null;
  }
}
// Priority 2: Use SQLite for local/Railway (if not Vercel and no DATABASE_URL)
else if (!isVercel) {
  try {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 3,
        min: 0,
        acquire: 10000,
        idle: 5000
      }
    });
    console.log('📦 Using SQLite database');
  } catch (error) {
    console.error('❌ SQLite connection failed:', error.message);
    sequelize = null;
  }
}
// Priority 3: Demo storage for Vercel (if no DATABASE_URL)
else {
  console.log('🔵 Using demo storage (in-memory)');
  sequelize = null;
}

const connectDB = async () => {
  if (!sequelize) {
    console.log('⚠️  Database unavailable, using demo storage mode');
    dbAvailable = false;
    return null;
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized');
    
    dbAvailable = true;
    return sequelize;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  Falling back to demo storage mode');
    dbAvailable = false;
    return null;
  }
};

const isDatabaseAvailable = () => dbAvailable;

export { sequelize, connectDB, isDatabaseAvailable, isVercel };
export default connectDB;
```

### Step 2: Install PostgreSQL driver

```bash
npm install pg pg-hstore
```

### Step 3: Create PostgreSQL database on Railway

1. Go to https://railway.app
2. Sign up (free)
3. Create new project
4. Add PostgreSQL service
5. Copy connection URL (DATABASE_URL)

### Step 4: Set environment variables

**Vercel:**
```bash
# Project Settings → Environment Variables
DATABASE_URL=postgresql://user:pass@host.railway.app:5432/railway
```

**Hostinger:**
```bash
# In .env file or server environment
DATABASE_URL=postgresql://user:pass@host.railway.app:5432/railway
```

**Railway:**
```bash
# Automatically set when you add PostgreSQL service
DATABASE_URL=postgresql://...
```

### Step 5: Migrate data (if needed)

```bash
# Export from SQLite
sqlite3 database.sqlite .dump > backup.sql

# Import to PostgreSQL (convert syntax first)
# Use online tools or pgloader
```

## 🚀 Deployment Strategy

### Phase 1: Testing (Current)
- ✅ Vercel: Demo storage
- ✅ Hostinger: SQLite
- ✅ Railway: SQLite

### Phase 2: Production (Recommended)
- ✅ All platforms: Railway PostgreSQL
- ✅ Single source of truth
- ✅ Consistent data everywhere

## 📊 Comparison Table

| Solution | Cost | Setup | Performance | Scalability | Shared Data |
|----------|------|-------|-------------|-------------|-------------|
| **SQLite on Hostinger** | ❌ Won't work | - | - | - | ❌ |
| **Railway PostgreSQL** | ✅ Free | Easy | Good | Excellent | ✅ |
| **Supabase** | ✅ Free | Easy | Excellent | Excellent | ✅ |
| **Neon** | ✅ Free | Easy | Excellent | Excellent | ✅ |
| **Hostinger MySQL** | ✅ Included | Medium | Good | Medium | ✅ |
| **Current approach** | ✅ Free | ✅ Done | Good | Limited | ❌ |

## 🎯 Action Plan

### Immediate (for testing):
1. ✅ Keep current setup
2. ✅ Deploy to Vercel with demo storage
3. ✅ Test thoroughly

### Next steps (for production):
1. Create Railway PostgreSQL database
2. Add `pg` and `pg-hstore` packages
3. Update `database.js` with PostgreSQL support
4. Set DATABASE_URL on all platforms
5. Migrate SQLite data to PostgreSQL
6. Test on all platforms
7. Go live!

## 🔒 Security Notes

**NEVER put database file in public_html/**
- ❌ Anyone can download it
- ❌ No authentication
- ❌ Exposes all data

**DO put database file in:**
- ✅ `/home/username/agb_planner/backend/`
- ✅ Outside web root
- ✅ Proper permissions (chmod 600)

**DO use proper database service:**
- ✅ Railway PostgreSQL
- ✅ Supabase
- ✅ Neon
- ✅ Hostinger MySQL (with proper security)

## 📞 Summary

**Your question:** Can we keep database.sqlite on Hostinger public_html/ accessible to Vercel?

**Answer:** ❌ **NO** - This won't work technically and is insecure.

**Best solution:** ✅ **Use Railway PostgreSQL (free tier)**
- Single database for all platforms
- Free, reliable, scalable
- 5-minute setup
- Professional solution

**Quick solution:** ✅ **Keep current approach**
- Different storage per platform
- Already working
- Good for testing
- Not for production

---

**Need help setting up Railway PostgreSQL?** Let me know and I'll guide you through it!
