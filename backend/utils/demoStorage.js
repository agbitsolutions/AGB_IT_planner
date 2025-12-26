/**
 * In-Memory Demo Storage
 * Used when MongoDB is not available for demo/testing
 */

const storage = {
  teams: [],
  projects: [],
  tasks: [],
  milestones: [],
};

let teamId = 1;
let projectId = 1;
let taskId = 1;
let milestoneId = 1;

export const demoStorage = {
  // Teams
  createTeam: (data) => {
    const team = {
      _id: `team_${teamId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.teams.push(team);
    return team;
  },

  getTeams: () => storage.teams,

  getTeamById: (id) => storage.teams.find((t) => t._id === id || t._id === id.toString()),

  updateTeam: (id, data) => {
    const team = demoStorage.getTeamById(id);
    if (team) {
      Object.assign(team, data, { updatedAt: new Date() });
    }
    return team;
  },

  deleteTeam: (id) => {
    const index = storage.teams.findIndex((t) => t._id === id || t._id === id.toString());
    if (index > -1) {
      storage.teams.splice(index, 1);
      return true;
    }
    return false;
  },

  // Projects
  createProject: (data) => {
    const project = {
      _id: `project_${projectId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.projects.push(project);
    return project;
  },

  getProjects: () => storage.projects,

  getProjectsByTeam: (teamId) =>
    storage.projects.filter((p) => p.team === teamId || p.team === teamId.toString()),

  // Tasks
  createTask: (data) => {
    const task = {
      _id: `task_${taskId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.tasks.push(task);
    return task;
  },

  getTasks: () => storage.tasks,

  getTasksByProject: (projectId) =>
    storage.tasks.filter((t) => t.project === projectId || t.project === projectId.toString()),

  // Milestones
  createMilestone: (data) => {
    const milestone = {
      _id: `milestone_${milestoneId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.milestones.push(milestone);
    return milestone;
  },

  getMilestones: () => storage.milestones,

  getMilestonesByProject: (projectId) =>
    storage.milestones.filter((m) => m.project === projectId || m.project === projectId.toString()),
};

export default demoStorage;
