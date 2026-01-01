/**
 * In-Memory Demo Storage
 * Used when MongoDB is not available for demo/testing
 * Pre-populated with test data for Vercel deployment
 */

const storage = {
  teams: [
    {
      _id: 'team_1',
      id: 1,
      name: 'Shubham Team',
      description: 'Team led by Shubham',
      owner: 'shubham1',
      isPublic: true,
      members: [
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780',
          role: 'Project Lead',
          joinedAt: '2026-01-01'
        }
      ],
      projects: [],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'team_2',
      id: 2,
      name: 'Mehul Team',
      description: 'Team led by Mehul',
      owner: 'mehul1',
      isPublic: true,
      members: [
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504',
          role: 'Technical Lead',
          joinedAt: '2026-01-01'
        }
      ],
      projects: [],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'team_3',
      id: 3,
      name: 'Mahesh Team',
      description: 'Team led by Mahesh',
      owner: 'mahesh1',
      isPublic: true,
      members: [
        {
          userId: 'mahesh1',
          name: 'Mahesh',
          whatsappNumber: '917887868580',
          role: 'Development Lead',
          joinedAt: '2026-01-01'
        }
      ],
      projects: [],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    }
  ],
  projects: [
    {
      _id: 'project_1',
      id: 1,
      name: 'AGB IT',
      description: 'This is a parent site',
      team: 1,
      teamObj: { id: 1, name: 'Shubham Team' },
      status: 'active',
      priority: 'high',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      owner: 'shubham1',
      isPublic: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'project_2',
      id: 2,
      name: 'Market Mantra',
      description: 'Automated futuristic algo trading',
      team: 2,
      teamObj: { id: 2, name: 'Mehul Team' },
      status: 'active',
      priority: 'high',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      owner: 'mehul1',
      isPublic: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'project_3',
      id: 3,
      name: 'Rathi',
      description: 'Futuristic, private but local first travel experience. Book a rathi travel Guide',
      team: 3,
      teamObj: { id: 3, name: 'Mahesh Team' },
      status: 'active',
      priority: 'medium',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-09-30'),
      owner: 'mahesh1',
      isPublic: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    }
  ],
  tasks: [
    {
      _id: 'task_1',
      id: 1,
      title: 'Setup project architecture',
      description: 'Define the overall architecture for AGB IT parent site including microservices structure',
      project: 1,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2026-01-15'),
      tags: ['architecture', 'planning'],
      mentionedMembers: [
        { userId: 'shubham1', name: 'Shubham', whatsappNumber: '919049874780' },
        { userId: 'mehul1', name: 'Mehul', whatsappNumber: '918830451504' }
      ],
      notificationsSent: [],
      attachments: [],
      comments: [],
      estimatedHours: 0,
      actualHours: 0,
      isCompleted: false,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'task_2',
      id: 2,
      title: 'Implement trading algorithm',
      description: 'Develop the core trading algorithm with ML-based predictions',
      project: 2,
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2026-01-20'),
      tags: ['algorithm', 'ml', 'trading'],
      mentionedMembers: [
        { userId: 'mehul1', name: 'Mehul', whatsappNumber: '918830451504' },
        { userId: 'shubham1', name: 'Shubham', whatsappNumber: '919049874780' }
      ],
      notificationsSent: [],
      attachments: [],
      comments: [],
      estimatedHours: 0,
      actualHours: 0,
      isCompleted: false,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      _id: 'task_3',
      id: 3,
      title: 'Design travel guide booking interface',
      description: 'Create a user-friendly interface for booking local travel guides with real-time availability',
      project: 3,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date('2026-01-25'),
      tags: ['ui', 'design', 'booking'],
      mentionedMembers: [
        { userId: 'mahesh1', name: 'Mahesh', whatsappNumber: '917887868580' },
        { userId: 'shubham1', name: 'Shubham', whatsappNumber: '919049874780' }
      ],
      notificationsSent: [],
      attachments: [],
      comments: [],
      estimatedHours: 0,
      actualHours: 0,
      isCompleted: false,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    }
  ],
  milestones: [],
};

let teamId = 4;  // Start from 4 (we have 3 teams)
let projectId = 4; // Start from 4 (we have 3 projects)
let taskId = 4; // Start from 4 (we have 3 tasks)
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
