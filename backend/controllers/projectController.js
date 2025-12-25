import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createProject = async (req, res, next) => {
  try {
    const { name, description, team } = req.body;

    const project = await Project.create({
      name,
      description,
      team,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ team: req.query.teamId })
      .populate('owner', 'name email')
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('team', 'name')
      .populate('tasks')
      .populate('milestones');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, color, endDate } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, color, endDate },
      { new: true, runValidators: true }
    );

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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndRemove(req.params.id);

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
    const project = await Project.findById(req.params.id).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = project.tasks;
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
