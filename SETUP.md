# Setup Guide - AGB Multi-Project Planner

## 🔧 Complete Installation & Configuration

### Step 1: MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community
brew services start mongodb-community

# Install MongoDB (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Install MongoDB (Windows)
# Download from https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### Step 2: Backend Configuration

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agb_planner

JWT_SECRET=your_super_secret_key_change_this_in_production_$(openssl rand -hex 16)
JWT_EXPIRE=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

NOTIFICATION_FROM_EMAIL=noreply@agbplanner.com
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

FRONTEND_URL=http://localhost:3000
EOF

# Start development server
npm run dev
```

### Step 3: Gmail Setup (for Email Notifications)

1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate [App Password](https://myaccount.google.com/apppasswords)
4. Copy the 16-character password
5. Add to `.env`:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=xxxxxxxxxxxxxxxx
   ```

### Step 4: Frontend Setup

```bash
cd frontend

# Option 1: Using Python's built-in server
python -m http.server 3000

# Option 2: Using Node.js http-server
npm install -g http-server
http-server -p 3000

# Option 3: Using Live Server (VS Code Extension)
# Install "Live Server" extension and click "Go Live"
```

### Step 5: Access the Application

```
http://localhost:3000
```

## 🗂️ Initial Data Setup

The application comes with demo data. To reset and populate with fresh data:

```bash
cd backend

# Create a seed file (seed.js)
node seed.js
```

Example seed.js:
```javascript
import mongoose from 'mongoose';
import User from './models/User.js';
import Team from './models/Team.js';
import Project from './models/Project.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    // Create demo team
    const team = await Team.create({
      name: 'Engineering',
      description: 'Engineering team',
      owner: user._id,
      isPublic: true,
      members: [{
        userId: user._id,
        role: 'lead'
      }]
    });
    
    console.log('✅ Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
```

## 🔐 Environment Variables Reference

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/agb_planner` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | Required if sending emails |
| `SMTP_PASS` | SMTP password | Required if sending emails |
| `NOTIFICATION_FROM_EMAIL` | Email sender address | `noreply@agbplanner.com` |
| `FILE_UPLOAD_PATH` | File upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max file upload size (bytes) | `10485760` (10MB) |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

## 📦 Dependencies Overview

### Backend
```json
{
  "express": "REST API framework",
  "mongoose": "MongoDB ODM",
  "dotenv": "Environment variables",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "nodemailer": "Email sending",
  "multer": "File uploads",
  "cors": "CORS handling",
  "express-validator": "Input validation",
  "helmet": "Security headers"
}
```

## 🔄 Development Workflow

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
# Choose one of the methods from Step 4
python -m http.server 3000
```

### 4. Test API
```bash
curl -X GET http://localhost:5000/api/health
```

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  teams: [ObjectId],
  role: String (user|admin|manager),
  avatar: String (URL),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Teams
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  owner: ObjectId (ref User),
  members: [{
    userId: ObjectId (ref User),
    role: String (lead|member|viewer),
    joinedAt: Date
  }],
  projects: [ObjectId],
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  team: ObjectId (ref Team),
  owner: ObjectId (ref User),
  tasks: [ObjectId],
  milestones: [ObjectId],
  status: String (planning|active|paused|completed|archived),
  startDate: Date,
  endDate: Date,
  color: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (ref Project),
  assignee: ObjectId (ref User),
  priority: String (low|medium|high|critical),
  status: String (todo|in_progress|in_review|done),
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  milestone: ObjectId (ref Milestone),
  attachments: [{
    filename: String,
    url: String,
    fileSize: Number,
    uploadedBy: ObjectId (ref User)
  }],
  comments: [{
    author: ObjectId (ref User),
    content: String,
    createdAt: Date
  }],
  tags: [String],
  isCompleted: Boolean,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Milestones
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (ref Project),
  team: ObjectId (ref Team),
  startDate: Date,
  dueDate: Date,
  tasks: [ObjectId],
  status: String (not_started|in_progress|at_risk|completed),
  progress: Number (0-100),
  owner: ObjectId (ref User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### API Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get teams (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/teams

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test Description",
    "team": "team_id"
  }'
```

### Postman Collection

Create a Postman collection with these endpoints and import authentication tokens for easier testing.

## 🚨 Common Issues & Solutions

### 1. MongoDB Connection Failed
```
Error: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb
```

### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### 3. CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure FRONTEND_URL is set correctly in .env
- Check CORS settings in server.js

### 4. Email Not Sending
```
Error: 403 Authentication failed
```
**Solution:**
- Verify SMTP credentials
- For Gmail: Use [App Password](https://myaccount.google.com/apppasswords)
- Check firewall/antivirus blocking SMTP port 587

## 📝 Environment Setup Checklist

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created with all required variables
- [ ] JWT_SECRET generated
- [ ] SMTP credentials configured
- [ ] Frontend server running
- [ ] API health check passes
- [ ] Frontend loads at http://localhost:3000
- [ ] Can create teams
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Kanban board functional
- [ ] Timeline view working

## 🎯 Next Steps

1. Read the [README.md](../README.md) for feature overview
2. Check [API Documentation](../CONTRIBUTING.md) for detailed endpoints
3. Explore the codebase structure
4. Create your first project
5. Customize for your needs

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Happy coding! 🚀**
