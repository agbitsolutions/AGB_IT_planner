import Team from '../models/Team.js';
import User from '../models/User.js';

export const createTeam = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    // For demo/testing mode without authentication
    const ownerId = req.user?.id || 'demo_user';
    
    const team = await Team.create({
      name,
      description,
      owner: ownerId,
      isPublic: isPublic !== undefined ? isPublic : true,
      members: req.user ? [
        {
          userId: req.user.id,
          role: 'lead',
        },
      ] : [],
    });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('owner', 'name email')
      .populate('members.userId', 'name email avatar')
      .populate('projects', 'name');

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
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email avatar')
      .populate('projects', 'name description');

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

    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }

    if (name) team.name = name;
    if (description) team.description = description;
    if (isPublic !== undefined) team.isPublic = isPublic;

    team = await team.save();

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
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this team' });
    }

    await Team.findByIdAndRemove(req.params.id);

    // Remove team from all users
    await User.updateMany(
      { teams: req.params.id },
      { $pull: { teams: req.params.id } }
    );

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

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is already a member
    const isMember = team.members.some((m) => m.userId.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    team.members.push({
      userId,
      role: role || 'member',
    });

    await team.save();

    // Add team to user's teams array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { teams: req.params.id },
    });

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

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { members: { userId } },
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove team from user's teams array
    await User.findByIdAndUpdate(userId, {
      $pull: { teams: req.params.id },
    });

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
    const userId = req.user.id;

    const teams = await Team.find({ 'members.userId': userId })
      .populate('owner', 'name email')
      .populate('members.userId', 'name email avatar')
      .populate('projects', 'name');

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ isPublic: true })
      .populate('owner', 'name email')
      .populate('members.userId', 'name email avatar')
      .populate('projects', 'name');

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};
