import Milestone from '../models/Milestone.js';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import { Op } from 'sequelize';

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
      owner: owner || req.user?.id || null,
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
    const where = {};

    if (teamId) where.team = teamId;
    if (projectId) where.project = projectId;
    if (status) where.status = status;

    const milestones = await Milestone.findAll({
      where,
      include: [
        { model: Team, as: 'milestoneTeam', attributes: ['name'] },
        { model: Project, as: 'milestoneProject', attributes: ['name'] }
      ],
      order: [['dueDate', 'ASC']]
    });

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
    const milestone = await Milestone.findByPk(req.params.id, {
      include: [
        { model: Team, as: 'milestoneTeam', attributes: ['name', 'members'] },
        { model: Project, as: 'milestoneProject', attributes: ['name'] }
      ]
    });

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Get associated tasks
    const tasks = await Task.findAll({
      where: { milestone: req.params.id }
    });

    const milestoneData = milestone.toJSON();
    milestoneData.tasks = tasks;

    res.status(200).json({
      success: true,
      data: milestoneData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const { title, description, status, progress, dueDate, owner } = req.body;

    let milestone = await Milestone.findByPk(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (dueDate) updateData.dueDate = dueDate;
    if (owner) updateData.owner = owner;

    await milestone.update(updateData);

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
    const milestone = await Milestone.findByPk(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Remove milestone reference from tasks
    await Task.update(
      { milestone: null },
      { where: { milestone: req.params.id } }
    );

    await milestone.destroy();

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

    const milestones = await Milestone.findAll({
      where: {
        team: teamId,
        status: { [Op.ne]: 'completed' }
      },
      include: [
        { model: Project, as: 'milestoneProject', attributes: ['name', 'color'] }
      ],
      order: [['startDate', 'ASC']]
    });

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
    const milestone = await Milestone.findByPk(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const tasks = await Task.findAll({
      where: { milestone: req.params.id }
    });
    
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const totalTasks = tasks.length;

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    await milestone.update({ progress });

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
