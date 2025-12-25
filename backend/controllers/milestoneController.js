import Milestone from '../models/Milestone.js';
import Task from '../models/Task.js';

export const createMilestone = async (req, res, next) => {
  try {
    const { title, description, project, team, startDate, dueDate, owner } = req.body;

    const milestone = await Milestone.create({
      title,
      description,
      project,
      team,
      startDate,
      dueDate,
      owner: owner || req.user.id,
    });

    res.status(201).json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMilestones = async (req, res, next) => {
  try {
    const { teamId, projectId, status } = req.query;
    const filter = {};

    if (teamId) filter.team = teamId;
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;

    const milestones = await Milestone.find(filter)
      .populate('team', 'name')
      .populate('project', 'name')
      .populate('owner', 'name email')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    next(error);
  }
};

export const getMilestoneById = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id)
      .populate('team', 'name members')
      .populate('project', 'name')
      .populate('owner', 'name email')
      .populate('tasks');

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    res.status(200).json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const { title, description, status, progress, dueDate, owner } = req.body;

    let milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    if (title) milestone.title = title;
    if (description) milestone.description = description;
    if (status) milestone.status = status;
    if (progress !== undefined) milestone.progress = progress;
    if (dueDate) milestone.dueDate = dueDate;
    if (owner) milestone.owner = owner;

    milestone = await milestone.save();

    res.status(200).json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Remove milestone reference from tasks
    await Task.updateMany(
      { milestone: req.params.id },
      { $unset: { milestone: 1 } }
    );

    await Milestone.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Milestone deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const getMilestoneTimeline = async (req, res, next) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: 'teamId is required' });
    }

    const milestones = await Milestone.find({ team: teamId, status: { $ne: 'completed' } })
      .populate('project', 'name color')
      .populate('owner', 'name email')
      .sort({ startDate: 1 });

    // Group milestones by month for timeline view
    const timeline = {};
    milestones.forEach((milestone) => {
      const monthKey = new Date(milestone.startDate).toISOString().substring(0, 7); // YYYY-MM
      if (!timeline[monthKey]) {
        timeline[monthKey] = [];
      }
      timeline[monthKey].push(milestone);
    });

    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

export const calculateMilestoneProgress = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('tasks');

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const tasks = await Task.find({ milestone: req.params.id });
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const totalTasks = tasks.length;

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    milestone.progress = progress;
    await milestone.save();

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};
