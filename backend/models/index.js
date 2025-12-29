import { sequelize } from '../config/database.js';
import Team from './Team.js';
import Project from './Project.js';
import Task from './Task.js';
import Milestone from './Milestone.js';
import User from './User.js';

// Define associations
Team.hasMany(Project, {
  foreignKey: 'team',
  as: 'teamProjects'
});

Project.belongsTo(Team, {
  foreignKey: 'team',
  as: 'teamData'
});

Project.hasMany(Task, {
  foreignKey: 'project',
  as: 'projectTasks'
});

Task.belongsTo(Project, {
  foreignKey: 'project',
  as: 'taskProject'
});

Project.hasMany(Milestone, {
  foreignKey: 'project',
  as: 'projectMilestones'
});

Milestone.belongsTo(Project, {
  foreignKey: 'project',
  as: 'milestoneProject'
});

Team.hasMany(Milestone, {
  foreignKey: 'team',
  as: 'teamMilestones'
});

Milestone.belongsTo(Team, {
  foreignKey: 'team',
  as: 'milestoneTeam'
});

Milestone.hasMany(Task, {
  foreignKey: 'milestone',
  as: 'milestoneTasks'
});

Task.belongsTo(Milestone, {
  foreignKey: 'milestone',
  as: 'taskMilestone'
});

export {
  sequelize,
  Team,
  Project,
  Task,
  Milestone,
  User
};
