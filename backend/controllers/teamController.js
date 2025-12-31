import Team from '../models/Team.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import demoStorage from '../utils/demoStorage.js';
import { Op } from 'sequelize';
import { isDatabaseAvailable, isVercel } from '../config/database.js';

// Check if database is available - auto-detect on Vercel
let useDemo = isVercel;

export const setDemoMode = (isDemo) => {
  useDemo = isDemo;
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    // For demo/testing mode without authentication
    const ownerId = req.user?.id || 'demo_user';
    
    const teamData = {
      name: name.trim(),
      description,
      owner: ownerId,
      isPublic: isPublic !== undefined ? isPublic : true,
      members: req.user ? [
        {
          userId: req.user.id,
          role: 'lead',
          joinedAt: new Date(),
        },
      ] : [],
    };

    // Use demo storage if database is not available
    if (useDemo) {
      const team = demoStorage.createTeam(teamData);
      return res.status(201).json({
        success: true,
        data: team,
      });
    }

    // Create with Sequelize
    const team = await Team.create(teamData);
    console.log(`✅ Team created successfully in database: ID ${team.id}, Name: ${team.name}`);

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team,
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A team with this name already exists',
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    
    // Fall back to demo storage on error
    if (!useDemo) {
      console.warn('⚠️  Database error, falling back to demo storage:', error.message);
      setDemoMode(true);
      const teamData = {
        name: req.body.name,
        description: req.body.description,
        owner: req.user?.id || 'demo_user',
        isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
        members: req.user ? [{ userId: req.user.id, role: 'lead', joinedAt: new Date() }] : [],
      };
      const team = demoStorage.createTeam(teamData);
      return res.status(201).json({
        success: true,
        data: team,
      });
    }
    next(error);
  }
};

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: Project, as: 'teamProjects', attributes: ['name'] }
      ]
    });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'teamProjects', attributes: ['name', 'description'] }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    let team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await team.update(updateData);

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this team' });
    }

    await team.destroy();

    res.status(200).json({
      success: true,
      message: 'Team deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get current members
    const members = team.members || [];
    
    // Check if user is already a member
    const isMember = members.some((m) => m.userId === userId);
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    // Add new member
    members.push({
      userId,
      role: role || 'member',
      joinedAt: new Date(),
    });

    await team.update({ members });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Filter out the member
    const members = (team.members || []).filter(m => m.userId !== userId);
    
    await team.update({ members });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTeams = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const teams = await Team.findAll({
      include: [
        { model: Project, as: 'teamProjects', attributes: ['name'] }
      ]
    });

    // Filter teams where user is a member
    const userTeams = teams.filter(team => {
      const members = team.members || [];
      return members.some(m => m.userId === userId) || team.owner === userId;
    });

    res.status(200).json({
      success: true,
      count: userTeams.length,
      data: userTeams,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTeams = async (req, res, next) => {
  try {
    let teams;

    if (useDemo) {
      teams = demoStorage.getTeams().filter((t) => t.isPublic);
    } else {
      teams = await Team.findAll({
        where: { isPublic: true },
        include: [
          { model: Project, as: 'teamProjects', attributes: ['name'] }
        ]
      });
    }

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    // Fall back to demo storage
    const teams = demoStorage.getTeams().filter((t) => t.isPublic);
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  }
};
