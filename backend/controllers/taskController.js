import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import { Op } from 'sequelize';
import whatsappService from '../services/whatsappService.js';

export const createTask = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      project, 
      priority, 
      dueDate, 
      estimatedHours, 
      milestone, 
      tags,
      mentionedMembers 
    } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Project is required',
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      project,
      assignee: req.user?.id || null,
      priority: priority || 'medium',
      dueDate,
      estimatedHours,
      milestone,
      tags: tags || [],
      mentionedMembers: mentionedMembers || [],
      notificationsSent: []
    });

    console.log(`✅ Task created: ${task.title} (ID: ${task.id})`);

    // Fetch project details for notification
    const projectDetails = await Project.findByPk(project);

    // Prepare WhatsApp notifications if members are mentioned
    let notifications = [];
    if (mentionedMembers && mentionedMembers.length > 0) {
      notifications = whatsappService.prepareNotifications(
        task,
        projectDetails,
        mentionedMembers,
        'created'
      );

      // Update task with notification records
      const notificationRecords = notifications.map(n => ({
        userId: n.userId,
        sentAt: n.sentAt,
        method: 'whatsapp'
      }));

      await task.update({
        notificationsSent: notificationRecords
      });

      console.log(`📱 ${notifications.length} WhatsApp notifications prepared`);
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
      notifications: notifications.map(n => ({
        userId: n.userId,
        name: n.name,
        whatsappLink: n.link
      }))
    });
  } catch (error) {
    console.error('❌ Error creating task:', error);
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
    const { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      actualHours, 
      assignee, 
      tags,
      updateDetails,
      notifyMembers 
    } = req.body;

    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Store previous status for notification
    const previousStatus = task.status;

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

    console.log(`✅ Task updated: ${task.title} (ID: ${task.id})`);

    // Send progress notifications if requested and status changed
    let notifications = [];
    if (notifyMembers && status && status !== previousStatus && task.mentionedMembers?.length > 0) {
      const projectDetails = await Project.findByPk(task.project);
      
      // Add update context to task for notification
      task.previousStatus = previousStatus;
      task.updateDetails = updateDetails;
      
      notifications = whatsappService.prepareNotifications(
        task,
        projectDetails,
        task.mentionedMembers,
        'updated'
      );

      // Update notification records
      const existingNotifications = task.notificationsSent || [];
      const newNotifications = notifications.map(n => ({
        userId: n.userId,
        sentAt: n.sentAt,
        method: 'whatsapp'
      }));

      await task.update({
        notificationsSent: [...existingNotifications, ...newNotifications]
      });

      console.log(`📱 ${notifications.length} WhatsApp progress notifications prepared`);
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
      notifications: notifications.map(n => ({
        userId: n.userId,
        name: n.name,
        whatsappLink: n.link
      }))
    });
  } catch (error) {
    console.error('❌ Error updating task:', error);
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      isCompleted: true,
      completedAt: new Date(),
      status: 'done',
    });

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

export const assignTask = async (req, res, next) => {
  try {
    const { assignee } = req.body;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ assignee });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const addAttachment = async (req, res, next) => {
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

export const addComment = async (req, res, next) => {
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
