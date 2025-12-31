# 🚀 AGB IT Solutions - Admin Planner Complete Guide

> **Last Updated:** December 31, 2025  
> **Project:** Multi-Project Planner Admin Module  
> **Main Site:** https://agbitsolutions.com  
> **Admin Module:** https://admin.agbitsolutions.com

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Setup & Installation](#setup--installation)
5. [Deployment](#deployment)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is this?
A comprehensive, full-stack project planning application for AGB IT Solutions with:
- **Team Management** - Public teams with default access
- **Project Management** - Multiple projects per team
- **Kanban Board** - Drag-and-drop task management
- **Timeline/Milestones** - Visual timeline for 10+ projects
- **Email Notifications** - Due tasks, overdue reminders, milestone alerts

### Tech Stack
- **Backend:** Node.js + Express + SQLite3
- **Frontend:** Vanilla JavaScript + HTML5 + CSS3
- **Auth:** JWT tokens
- **Email:** Nodemailer

### Important Notes
⚠️ **This is the ADMIN module** - separate from the main agbitsolutions.com website  
⚠️ **Uses SQLite** - no MongoDB required  
⚠️ **Subdomain deployment** - runs on admin.agbitsolutions.com

---

## ⚡ Quick Start

### Prerequisites
- Node.js 14+ (check: `node --version`)
- npm or yarn
- Git

### 1-Minute Setup

```bash
# Clone repository
git clone https://github.com/agbitsolutions/AGB_IT_planner.git
cd AGB_IT_planner

# Run quick setup
./scripts/setup.sh

# Start server
cd backend && npm start
```

### First Time Access
1. Open http://localhost:5000
2. Register a new account
3. Create your first team
4. Start adding projects!

---

## 🏗️ Architecture

### Directory Structure
```
agb_planner/
├── backend/           # Node.js API server
│   ├── config/       # Database, email config
│   ├── controllers/  # Business logic
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth, error handling
│   └── server.js     # Entry point
├── frontend/         # Static files
│   ├── css/         # Stylesheets
│   ├── js/          # JavaScript modules
│   └── index.html   # Main page
├── docs/            # Documentation (this file)
├── scripts/         # Deployment & utility scripts
└── database.sqlite  # SQLite database
```

### Database Schema
- **Users:** Authentication & profiles
- **Teams:** Team management
- **Projects:** Project tracking
- **Tasks:** Kanban tasks
- **Milestones:** Timeline events
- **Comments:** Task discussions

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/teams` - List teams
- `GET /api/projects` - List projects
- `GET /api/tasks` - List tasks
- See [API Documentation](#api-documentation) for full list

---

## 🛠️ Setup & Installation

### Local Development

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Configure Environment
Create `backend/.env`:
```env
DB_PATH=./database.sqlite
NODE_ENV=development
PORT=5000
JWT_SECRET=your_random_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### 3. Initialize Database
```bash
npm start  # Database auto-creates on first run
```

#### 4. Test Connection
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"healthy","database":"connected"}
```

### Production Setup (Hostinger)

See [Deployment](#deployment) section below.

---

## 🚀 Deployment

### Deployment Options

#### 1. Hostinger (Recommended)
```bash
# Use unified deployment script
./scripts/deploy.sh hostinger

# Or manual deployment:
./scripts/deploy.sh hostinger --manual
```

#### 2. Netlify/Vercel (Frontend only)
```bash
./scripts/deploy.sh netlify
```

#### 3. Railway/Render (Full-stack)
```bash
./scripts/deploy.sh railway
```

### Hostinger Deployment Steps

#### Prerequisites
- SSH access to Hostinger
- Node.js 14+ on server
- Domain: admin.agbitsolutions.com configured

#### Automated Deployment
```bash
# From local machine
./scripts/deploy.sh hostinger

# The script will:
# 1. Build & package application
# 2. Upload via SSH
# 3. Install dependencies on server
# 4. Setup environment
# 5. Start application
# 6. Run health checks
```

#### Manual Deployment
```bash
# 1. SSH to server
ssh u544547223@89.117.157.109 -p 65002

# 2. Navigate to directory
cd ~/domains/agbitsolutions.com/public_html/admin

# 3. Clone/update repository
git pull origin main

# 4. Install dependencies
cd backend && npm install --production

# 5. Setup environment
cp .env.example .env
nano .env  # Edit configuration

# 6. Start application
npm start
```

#### Server Configuration

**App Setup** (via Hostinger panel):
- **Application root:** /public_html/admin
- **Application URL:** admin.agbitsolutions.com
- **Application startup file:** backend/server.js
- **Node.js version:** 14.x or higher

**Environment Variables** (set in Hostinger):
```
DB_PATH=./database.sqlite
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-random-secret>
```

#### Troubleshooting Deployment

**Issue: Original site broke after deployment**
- **Cause:** Uploaded admin files to root domain
- **Fix:**
  ```bash
  # Move admin files to subdomain
  ./scripts/deploy.sh hostinger --fix-subdomain
  ```

**Issue: Module not found errors**
- **Fix:** Ensure all dependencies installed
  ```bash
  ssh server "cd ~/public_html/admin/backend && npm ci"
  ```

**Issue: Database connection failed**
- **Fix:** Check DB_PATH in .env points to writable location
  ```bash
  DB_PATH=/home/u544547223/admin_data/database.sqlite
  ```

---

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Teams

#### Create Team
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Main dev team"
}
```

#### List Teams
```http
GET /api/teams
Authorization: Bearer <token>
```

### Projects

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Q1 2025 website overhaul",
  "teamId": 1,
  "status": "active"
}
```

### Tasks

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create mockups",
  "projectId": 1,
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-02-01"
}
```

#### Update Task Status
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

### Full API Reference
See generated API documentation: http://localhost:5000/api-docs (when running)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

#### 2. Database Locked
```bash
# SQLite is locked - close other connections
# Restart the server
npm restart
```

#### 3. Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. JWT Token Invalid
- Token expired (24hr default)
- Login again to get new token
- Check JWT_SECRET matches in .env

#### 5. Email Notifications Not Sending
```bash
# Check SMTP settings in .env
# For Gmail, enable "Less secure app access"
# Or use App Password

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

#### 6. Deployment Issues

**Site broken after deployment:**
```bash
# Restore from backup
./scripts/deploy.sh rollback

# Or move admin to correct location
./scripts/deploy.sh fix-subdomain
```

**Permission errors on server:**
```bash
# Fix permissions
chmod 755 ~/public_html/admin
chmod 644 ~/public_html/admin/backend/.env
```

**Node.js version mismatch:**
```bash
# On Hostinger, set Node version in panel
# Or use nvm
nvm use 14
```

### Health Checks

```bash
# Check server health
curl http://localhost:5000/api/health

# Check database
curl http://localhost:5000/api/health/db

# View logs
tail -f backend/logs/app.log
```

### Getting Help

1. **Check logs:** `backend/logs/error.log`
2. **Enable debug:** `DEBUG=* npm start`
3. **Test API:** Use Postman collection in `/docs/postman/`
4. **Contact:** support@agbitsolutions.com

---

## 📝 Development Guidelines

### Code Style
- Use ES6+ features
- Follow Airbnb JavaScript style guide
- Use async/await over promises
- Add JSDoc comments for functions

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Commit
git commit -m "feat: add new feature"

# Push & create PR
git push origin feature/new-feature
```

### Testing
```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

---

## 🔐 Security

### Best Practices
- ✅ Always use HTTPS in production
- ✅ Rotate JWT secrets regularly
- ✅ Use strong passwords (min 8 chars)
- ✅ Enable rate limiting
- ✅ Validate all inputs
- ✅ Keep dependencies updated

### Environment Security
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use different secrets per environment
JWT_SECRET_DEV=...
JWT_SECRET_PROD=...
```

---

## 📞 Support

### Resources
- **Documentation:** This file
- **API Docs:** http://localhost:5000/api-docs
- **Main Website:** https://agbitsolutions.com
- **GitHub:** https://github.com/agbitsolutions/AGB_IT_planner

### Contact
- **Email:** support@agbitsolutions.com
- **Issues:** GitHub Issues
- **Updates:** Check CHANGELOG.md

---

## ✅ Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Email service configured

### Post-Deployment
- [ ] Health check passes
- [ ] Can register/login
- [ ] Can create team
- [ ] Can create project
- [ ] Email notifications work
- [ ] All pages load correctly

---

**Version:** 1.0.0  
**Last Updated:** December 31, 2025  
**Maintained by:** AGB IT Solutions Team
