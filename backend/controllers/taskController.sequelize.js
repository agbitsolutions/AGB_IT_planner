import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { Op } from 'sequelize';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, priority, dueDate, estimatedHours, milestone, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignee: req.user?.id || null,
      priority,
      dueDate,
      estimatedHours,
      milestone,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { projectId, status, assignee } = req.query;
    const where = {};

    if (projectId) where.project = projectId;
    if (status) where.status = status;
    if (assignee) where.assignee = assignee;

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: 'taskProject', attributes: ['name'] }
      ],
      order: [
        ['priority', 'DESC'],
        ['dueDate', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'taskProject', attributes: ['name'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, actualHours, assignee, tags } = req.body;

    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) {
      updateData.status = status;
      if (status === 'done') {
        updateData.isCompleted = true;
        updateData.completedAt = new Date();
      }
    }
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate;
    if (actualHours !== undefined) updateData.actualHours = actualHours;
    if (assignee) updateData.assignee = assignee;
    if (tags) updateData.tags = tags;

    await task.update(updateData);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      status,
      isCompleted: status === 'done',
      completedAt: status === 'done' ? new Date() : task.completedAt
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const addTaskComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comments = task.comments || [];
    comments.push({
      author: req.user?.id || 'anonymous',
      content,
      createdAt: new Date(),
    });

    await task.update({ comments });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const addTaskAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const attachments = task.attachments || [];
    attachments.push({
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      uploadedBy: req.user?.id || 'anonymous',
    });

    await task.update({ attachments });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { project: req.params.projectId },
      order: [
        ['status', 'ASC'],
        ['priority', 'DESC']
      ]
    });

    // Group by status for Kanban view
    const tasksByStatus = {
      todo: tasks.filter(t => t.status === 'todo'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      in_review: tasks.filter(t => t.status === 'in_review'),
      done: tasks.filter(t => t.status === 'done'),
    };

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasksByStatus,
    });
  } catch (error) {
    next(error);
  }
};
