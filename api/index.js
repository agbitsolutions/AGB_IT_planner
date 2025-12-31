/**
 * Vercel Serverless API Entry Point
 * Uses demo storage since SQLite doesn't work on Vercel
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import only the demo storage utilities (no Sequelize/SQLite)
import demoStorage from './utils/demoStorage.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://agb-planner.vercel.app',
    /\.vercel\.app$/,
    'https://admin.agbitsolutions.com',
    /\.ngrok-free\.dev$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

console.log('🔵 Running on Vercel - Using demo storage (in-memory)');

// Teams API
app.get('/api/teams/public', (req, res) => {
  try {
    const teams = demoStorage.getTeams().filter(t => t.isPublic);
    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/teams', (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }
    
    const teamData = {
      name: name.trim(),
      description,
      owner: 'demo_user',
      isPublic: isPublic !== undefined ? isPublic : true,
      members: [],
      projects: []
    };
    
    const team = demoStorage.createTeam(teamData);
    console.log(`✅ Team created: ${team.name}`);
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/teams', (req, res) => {
  try {
    const teams = demoStorage.getTeams();
    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Projects API
app.get('/api/projects', (req, res) => {
  try {
    const projects = demoStorage.getProjects();
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const { name, description, team } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }
    
    const projectData = {
      name: name.trim(),
      description,
      team,
      status: 'planning',
      priority: 'medium'
    };
    
    const project = demoStorage.createProject(projectData);
    console.log(`✅ Project created: ${project.name}`);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Tasks API
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = demoStorage.getTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Milestones API
app.get('/api/milestones', (req, res) => {
  try {
    const milestones = demoStorage.getMilestones();
    res.json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: 'vercel',
    storage: 'demo (in-memory)',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AGB Planner API - Vercel Deployment',
    version: '1.0.0',
    storage: 'Demo Storage (In-Memory)',
    endpoints: {
      health: '/api/health',
      teams: '/api/teams',
      projects: '/api/projects',
      tasks: '/api/tasks',
      milestones: '/api/milestones',
    },
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
