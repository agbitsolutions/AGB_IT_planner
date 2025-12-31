import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import demoStorage from '../utils/demoStorage.js';
import { Op } from 'sequelize';

let useDemo = false;

export const setDemoMode = (isDemo) => {
  useDemo = isDemo;
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, team } = req.body;

    const projectData = {
      name,
      description,
      team,
      owner: req.user?.id || 'demo_user',
      tasks: [],
      milestones: [],
    };

    // Use demo storage if needed
    if (useDemo) {
      const project = demoStorage.createProject(projectData);
      return res.status(201).json({
        success: true,
        data: project,
      });
    }

    // Create project with Sequelize
    const project = await Project.create(projectData);
    console.log(`✅ Project created successfully in database: ID ${project.id}, Name: ${project.name}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    // Fall back to demo storage
    if (!useDemo) {
      console.warn('⚠️  Database error, falling back to demo storage:', error.message);
      setDemoMode(true);
      const projectData = {
        name: req.body.name,
        description: req.body.description,
        team: req.body.team,
        owner: req.user?.id || 'demo_user',
        tasks: [],
        milestones: [],
      };
      const project = demoStorage.createProject(projectData);
      return res.status(201).json({
        success: true,
        data: project,
      });
    }
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    let projects;

    if (useDemo) {
      projects = demoStorage.getProjectsByTeam(req.query.teamId);
    } else {
      projects = await Project.findAll({
        where: { team: req.query.teamId },
        include: [
          { model: Team, as: 'teamData', attributes: ['name'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    // Fall back to demo
    const projects = demoStorage.getProjectsByTeam(req.query.teamId);
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Team, as: 'teamData', attributes: ['name'] }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get associated tasks
    const tasks = await Task.findAll({
      where: { project: req.params.id }
    });
    
    const projectData = project.toJSON();
    projectData.tasks = tasks;

    res.status(200).json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, color, endDate } = req.body;

    let project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    await project.update({
      name: name || project.name,
      description: description !== undefined ? description : project.description,
      status: status || project.status,
      color: color || project.color,
      endDate: endDate || project.endDate,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete all tasks associated with this project
    await Task.destroy({ where: { project: req.params.id } });

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.findAll({
      where: { project: req.params.id }
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter((t) => !t.isCompleted && t.priority === 'critical').length;

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};