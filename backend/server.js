import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import './models/index.js'; // Import models to set up associations
import { errorHandler } from './middleware/auth.js';
import notificationService from './services/notificationService.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import milestoneRoutes from './routes/milestones.js';
import teamRoutes from './routes/teams.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to Database (non-blocking, graceful failure)
connectDB().then((db) => {
  if (db) {
    console.log('✅ Database ready');
  } else {
    console.log('🔵 Using demo storage (in-memory)');
  }
}).catch(err => {
  console.warn('⚠️  Database unavailable, using demo storage:', err.message);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://agb-planner.vercel.app',
    'https://agb-planner-5c553fa13-agb-its-projects.vercel.app',
    'https://admin.agbitsolutions.com',
    /\.vercel\.app$/,
    /\.ngrok-free\.dev$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/teams', teamRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AGB Planner API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AGB Planner API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      tasks: '/api/tasks',
      milestones: '/api/milestones',
      teams: '/api/teams',
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);

  // Start notification scheduler (runs every hour)
  const scheduleNotifications = () => {
    setInterval(() => {
      console.log('🔔 Running notification checks...');
      Promise.all([
        notificationService.checkDueTasks().catch(err => {
          console.error('❌ Error checking due tasks:', err.message);
        }),
        notificationService.checkOverdueTasks().catch(err => {
          console.error('❌ Error checking overdue tasks:', err.message);
        }),
        notificationService.checkMilestoneAlerts().catch(err => {
          console.error('❌ Error checking milestone alerts:', err.message);
        }),
      ]);
    }, 3600000); // 1 hour
  };

  // Run once on startup (don't crash if MongoDB unavailable)
  Promise.all([
    notificationService.checkDueTasks().catch(err => {
      console.warn('⚠️  Notification service unavailable (MongoDB connection issue)');
    }),
    notificationService.checkOverdueTasks().catch(err => {}),
    notificationService.checkMilestoneAlerts().catch(err => {}),
  ]).then(() => {
    scheduleNotifications();
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
