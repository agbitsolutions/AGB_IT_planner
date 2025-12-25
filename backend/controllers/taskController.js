import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, priority, dueDate, estimatedHours, milestone, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignee: req.user.id,
      priority,
      dueDate,
      estimatedHours,
      milestone,
      tags,
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
    const filter = {};

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name')
      .populate('milestone', 'title')
      .sort({ priority: -1, dueDate: 1 });

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
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name')
      .populate('milestone', 'title')
      .populate('comments.author', 'name avatar');

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

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (actualHours !== undefined) task.actualHours = actualHours;
    if (assignee) task.assignee = assignee;
    if (tags) task.tags = tags;

    task = await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        isCompleted: true,
        completedAt: new Date(),
        status: 'done',
      },
      { new: true }
    );

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

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndRemove(req.params.id);

    // Remove task from project's tasks array
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: req.params.id },
    });

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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

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

export const assignTask = async (req, res, next) => {
  try {
    const { assignee } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignee },
      { new: true }
    ).populate('assignee', 'name email avatar');

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

export const addAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          attachments: {
            filename: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            fileSize: req.file.size,
            uploadedBy: req.user.id,
          },
        },
      },
      { new: true }
    );

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

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            author: req.user.id,
            content,
          },
        },
      },
      { new: true }
    ).populate('comments.author', 'name avatar');

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
