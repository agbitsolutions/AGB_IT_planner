# 🚀 AGB Multi-Project Planner

A comprehensive, full-stack project planning application with team collaboration, Kanban boards, timeline milestones, and email notifications.

## ✨ Features

### 📊 Core Features
- **Team Management** - Create public teams with default access for all members
- **Project Management** - Organize multiple projects within teams
- **Kanban Board** - Drag-and-drop task management with 4 status columns (To Do, In Progress, In Review, Done)
- **Timeline/Milestones** - Visual timeline for managing 10+ projects with progress tracking
- **Task Management** - Create, assign, and track tasks with priorities and due dates
- **File Attachments** - Upload and attach files to tasks
- **Comments** - Add comments and notes to tasks for collaboration

### 🔔 Notifications
- **Due Task Alerts** - Email notifications for tasks due tomorrow
- **Overdue Reminders** - Alerts for overdue tasks
- **Milestone Alerts** - Notifications for approaching milestones
- **Team Invitations** - Email invites for team members

### 🎨 UI/UX
- Modern, responsive design with smooth animations
- Drag-and-drop Kanban board
- Interactive timeline visualization
- Real-time stat cards and progress tracking
- Intuitive sidebar navigation

## 🛠️ Tech Stack

### Backend
- **Node.js** + Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Nodemailer** for email notifications
- **Multer** for file uploads

### Frontend
- **Vanilla JavaScript** (no framework dependencies)
- **HTML5 + CSS3** with CSS Grid and Flexbox
- **Drag-and-drop APIs**
- **Responsive Design**

## 📁 Project Structure

```
agb_planner/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Milestone.js
│   ├── controllers/
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── milestoneController.js
│   │   └── teamController.js
│   ├── routes/
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── milestones.js
│   │   └── teams.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── notificationService.js
│   │   └── fileService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── kanban.js
│   │   └── milestones.js
│   └── assets/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+ (local or cloud)
- Git

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

Environment variables needed:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agb_planner

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

NOTIFICATION_FROM_EMAIL=noreply@agbplanner.com
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

FRONTEND_URL=http://localhost:3000
```

3. **Start MongoDB:**
```bash
# Using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

4. **Start the backend server:**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Start a simple HTTP server:**
```bash
cd frontend
python -m http.server 3000
# Or use any other simple server
```

2. **Access the application:**
```
http://localhost:3000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Teams

#### Create Team
```bash
POST /teams
{
  "name": "Engineering",
  "description": "Engineering team",
  "isPublic": true
}
```

#### Get User Teams
```bash
GET /teams
```

#### Get Public Teams
```bash
GET /teams/public
```

#### Add Team Member
```bash
POST /teams/:id/members
{
  "userId": "user_id",
  "role": "member"
}
```

### Projects

#### Create Project
```bash
POST /projects
{
  "name": "Website Redesign",
  "description": "Project description",
  "team": "team_id"
}
```

#### Get Projects
```bash
GET /projects?teamId=team_id
```

#### Get Project Stats
```bash
GET /projects/:id/stats
```

### Tasks

#### Create Task
```bash
POST /tasks
{
  "title": "Design homepage",
  "description": "Task description",
  "project": "project_id",
  "priority": "high",
  "dueDate": "2025-12-31",
  "estimatedHours": 8
}
```

#### Update Task Status (Kanban)
```bash
PATCH /tasks/:id/status
{
  "status": "in_progress"
}
```

Task statuses: `todo`, `in_progress`, `in_review`, `done`

#### Add Task Attachment
```bash
POST /tasks/:id/attachments
Content-Type: multipart/form-data
file: <file>
```

#### Add Task Comment
```bash
POST /tasks/:id/comments
{
  "content": "This task looks good!"
}
```

### Milestones

#### Create Milestone
```bash
POST /milestones
{
  "title": "Phase 1 Complete",
  "description": "Complete initial design phase",
  "project": "project_id",
  "team": "team_id",
  "startDate": "2025-01-01",
  "dueDate": "2025-03-31"
}
```

#### Get Timeline
```bash
GET /milestones/timeline?teamId=team_id
```

#### Update Milestone Progress
```bash
PUT /milestones/:id
{
  "status": "in_progress",
  "progress": 50
}
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. In a production environment, you would need to implement:

1. User registration endpoint
2. Login endpoint that returns a JWT token
3. Store token in localStorage or sessionStorage
4. Include token in all API requests

## 📧 Email Notifications

Email notifications are sent automatically for:
- Tasks due tomorrow
- Overdue tasks
- Milestones approaching (within 30 days)
- Team invitations

**To enable email notifications:**

1. Set up SMTP credentials in `.env`:
   - For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833)
   - For other providers: Use appropriate SMTP settings

2. The notification service runs automatically every hour
3. Customize email templates in `services/emailService.js`

## 🎯 SOLID Principles Implementation

### Single Responsibility
- Each controller handles one resource type
- Services are focused on specific functionality (email, files, notifications)
- Models define schema and validation only

### Open/Closed
- Services can be extended without modifying core logic
- Middleware pattern allows adding functionality without changing routes

### Liskov Substitution
- Consistent error handling across all controllers
- Standardized response format for all endpoints

### Interface Segregation
- API routes only expose needed endpoints
- Models don't expose internal methods

### Dependency Inversion
- Services are imported as dependencies
- Controllers depend on abstractions (service interfaces)

## 🚀 Performance Optimizations

- Database indexes on frequently queried fields
- Pagination ready (can be added to controllers)
- Async/await for non-blocking operations
- Multer for efficient file upload handling
- CSS Grid for optimal layout performance

## 🔒 Security Features

- JWT authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet.js for header security
- Input validation with express-validator
- File upload restrictions
- Environment variables for sensitive data

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly UI elements
- Adaptive grid layouts

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: MongoNetworkError
Solution: Ensure MongoDB is running and MONGODB_URI is correct in .env
```

### Email Not Sending
```
Error: SMTP Authentication failed
Solution: Check SMTP credentials, enable "Less secure apps" (Gmail), or use App Password
```

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS
Solution: Ensure CORS is enabled in server.js and frontend URL is in .env
```

## 📈 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Gantt chart view
- [ ] Resource allocation and workload tracking
- [ ] Time tracking integration
- [ ] Reporting and analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Custom workflows
- [ ] Integration with third-party tools

## 📄 License

MIT License - Feel free to use for personal and commercial projects

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for better project management**
