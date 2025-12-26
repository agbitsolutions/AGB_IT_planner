/**
 * Main Application Module
 * Core app logic and state management
 */

// State
let appState = {
  currentTeamId: null,
  currentProjectId: null,
  teams: [],
  projects: [],
  tasks: [],
  milestones: [],
  currentView: 'board',
};

// Initialize app
async function init() {
  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    
    // Load teams
    const teamsResponse = await fetch(`${baseUrl}/api/teams`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      appState.teams = teamsData.data || [];
    }

    if (appState.teams.length === 0) {
      // Load public teams if no user teams
      const publicResponse = await fetch(`${baseUrl}/api/teams/public`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
      });
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        appState.teams = publicData.data || [];
      }
    }

    if (appState.teams.length > 0) {
      appState.currentTeamId = appState.teams[0].id || appState.teams[0]._id;
      await loadProjectsForTeam(appState.currentTeamId);
    }

    render();
  } catch (error) {
    console.error('Error initializing app:', error);
    renderDefaultState();
  }
}

async function loadProjectsForTeam(teamId) {
  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/projects?teamId=${teamId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      appState.projects = data.data || [];

      if (appState.projects.length > 0) {
        appState.currentProjectId = appState.projects[0].id || appState.projects[0]._id;
        await loadProjectData(appState.currentProjectId);
      } else {
        appState.currentProjectId = null;
        appState.tasks = [];
        appState.milestones = [];
      }
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function loadProjectData(projectId) {
  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const project = data.data;
      appState.tasks = project.tasks || [];
      appState.milestones = project.milestones || [];
    }
  } catch (error) {
    console.error('Error loading project data:', error);
  }
}

function renderDefaultState() {
  appState.teams = [];
  appState.projects = [];
  appState.tasks = [];
  appState.milestones = [];
  render();
}

// Modal Management
function showAddTeamModal() {
  document.getElementById('addTeamModal').classList.add('active');
  document.getElementById('teamName').focus();
}

function showAddProjectModal() {
  const teamSelect = document.getElementById('projectTeam');
  teamSelect.innerHTML = '<option value="">Select a team</option>';
  appState.teams.forEach((team) => {
    const option = document.createElement('option');
    option.value = team._id || team.id;
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });

  document.getElementById('addProjectModal').classList.add('active');
  document.getElementById('projectName').focus();
}

function showAddTaskModal() {
  document.getElementById('addTaskModal').classList.add('active');
  document.getElementById('taskTitle').focus();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  // Reset forms
  const form = document.querySelector(`#${modalId} form`);
  if (form) form.reset();
}

// Create Handlers
async function createTeam(event) {
  event.preventDefault();
  const name = document.getElementById('teamName').value;
  const description = document.getElementById('teamDescription').value;

  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/teams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, isPublic: true }),
    });

    if (response.ok) {
      const data = await response.json();
      appState.teams.push(data.data);
      closeModal('addTeamModal');
      render();
    }
  } catch (error) {
    console.error('Error creating team:', error);
  }
}

async function createProject(event) {
  event.preventDefault();
  const name = document.getElementById('projectName').value;
  const description = document.getElementById('projectDescription').value;
  const team = document.getElementById('projectTeam').value;

  if (!team) {
    alert('Please select a team');
    return;
  }

  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, team }),
    });

    if (response.ok) {
      const data = await response.json();
      appState.projects.push(data.data);
      appState.currentProjectId = data.data._id || data.data.id;
      closeModal('addProjectModal');
      render();
    }
  } catch (error) {
    console.error('Error creating project:', error);
  }
}

async function createTask(event) {
  event.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;

  if (!appState.currentProjectId) {
    alert('Please select a project first');
    return;
  }

  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate: dueDate || null,
        project: appState.currentProjectId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      appState.tasks.push(data.data);
      closeModal('addTaskModal');
      render();
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

// Selection Handlers
async function selectTeam(teamId) {
  appState.currentTeamId = teamId;
  await loadProjectsForTeam(teamId);
  render();
}

async function selectProject(projectId) {
  appState.currentProjectId = projectId;
  await loadProjectData(projectId);
  render();
}

// View Management
function switchView(view) {
  appState.currentView = view;

  // Update button states
  document.querySelectorAll('.view-toggle button').forEach((btn) => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update view containers
  document.querySelectorAll('.view-container').forEach((container) => {
    container.classList.remove('active');
  });

  if (view === 'board') {
    document.getElementById('boardView').classList.add('active');
    renderKanbanBoard();
  } else if (view === 'timeline') {
    document.getElementById('timelineView').classList.add('active');
    renderTimeline();
  }
}

// Render Functions
function render() {
  renderTeamsList();
  renderProjectsList();
  renderStats();

  if (appState.currentView === 'board') {
    renderKanbanBoard();
  } else if (appState.currentView === 'timeline') {
    renderTimeline();
  }

  // Update page title
  const currentProject = appState.projects.find(
    (p) => (p._id || p.id) === appState.currentProjectId
  );
  document.getElementById('currentProjectName').textContent = currentProject
    ? currentProject.name
    : 'Dashboard';

  // Show/hide empty state
  const emptyState = document.getElementById('emptyState');
  if (appState.projects.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('boardView').style.display = 'none';
    document.getElementById('timelineView').style.display = 'none';
  } else {
    emptyState.style.display = 'none';
  }
}

function renderTeamsList() {
  const list = document.getElementById('teamsList');
  list.innerHTML = appState.teams
    .map(
      (team) =>
        `<li class="team-item ${(team._id || team.id) === appState.currentTeamId ? 'active' : ''}" 
             onclick="selectTeam('${team._id || team.id}')">
          ${team.name}
          <small>${team.members?.length || 0} members</small>
        </li>`
    )
    .join('');
}

function renderProjectsList() {
  const list = document.getElementById('projectsList');
  list.innerHTML = appState.projects
    .map(
      (project) =>
        `<li class="project-item ${(project._id || project.id) === appState.currentProjectId ? 'active' : ''}" 
             onclick="selectProject('${project._id || project.id}')">
          ${project.name}
          <small>${project.tasks?.length || 0} tasks</small>
        </li>`
    )
    .join('');
}

async function renderStats() {
  const container = document.getElementById('statsContainer');

  if (!appState.currentProjectId || appState.projects.length === 0) {
    container.innerHTML = '';
    return;
  }

  const totalTasks = appState.tasks.length;
  const completedTasks = appState.tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = appState.tasks.filter(
    (t) => !t.isCompleted && (t.priority === 'high' || t.priority === 'critical')
  ).length;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  container.innerHTML = `
    <div class="stat-card">
      <h4>Total Tasks</h4>
      <div class="value">${totalTasks}</div>
    </div>
    <div class="stat-card success">
      <h4>Completed</h4>
      <div class="value">${completedTasks}</div>
    </div>
    <div class="stat-card warning">
      <h4>Pending</h4>
      <div class="value">${pendingTasks}</div>
    </div>
    <div class="stat-card danger">
      <h4>High Priority</h4>
      <div class="value">${highPriorityTasks}</div>
    </div>
  `;
}

function renderKanbanBoard() {
  const board = document.getElementById('kanbanBoard');

  if (!appState.tasks || appState.tasks.length === 0) {
    board.innerHTML =
      '<div class="empty-state"><p>No tasks yet. Create a task to get started!</p></div>';
    return;
  }

  const statuses = ['todo', 'in_progress', 'in_review', 'done'];
  const statusLabels = {
    todo: '📋 To Do',
    in_progress: '🚀 In Progress',
    in_review: '👀 In Review',
    done: '✅ Done',
  };

  board.innerHTML = statuses
    .map((status) => {
      const tasksInStatus = appState.tasks.filter((t) => t.status === status);
      return `
        <div class="kanban-column" id="column-${status}">
          <div class="kanban-column-header">
            <span>${statusLabels[status]}</span>
            <span class="kanban-column-count">${tasksInStatus.length}</span>
          </div>
          <div class="kanban-tasks" id="tasks-${status}">
            ${tasksInStatus
              .map((task) => {
                const overdue =
                  task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
                return `
                  <div class="kanban-task priority-${task.priority}" draggable="true" ondragstart="dragTask(event, '${task._id || task.id}')" onclick="selectTask('${task._id || task.id}')">
                    <div class="kanban-task-title">${task.title}</div>
                    <div class="kanban-task-meta">
                      <span class="kanban-task-priority ${task.priority}">${task.priority}</span>
                      ${task.dueDate ? `<span class="kanban-task-duedate ${overdue ? 'overdue' : ''}">📅 ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                      ${task.assignee ? `<span class="kanban-task-assignee"><div class="kanban-task-avatar">${task.assignee.name?.charAt(0) || 'A'}</div>${task.assignee.name}</span>` : ''}
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');

  // Add drop event listeners
  statuses.forEach((status) => {
    const column = document.getElementById(`tasks-${status}`);
    if (column) {
      column.ondragover = (e) => e.preventDefault();
      column.ondrop = (e) => dropTask(e, status);
    }
  });
}

function dragTask(event, taskId) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('taskId', taskId);
}

async function dropTask(event, newStatus) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('taskId');

  try {
    const apiConfig = CONFIG.getApiConfig();
    const baseUrl = apiConfig.BASE_URL;
    const response = await fetch(`${baseUrl}/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      const task = appState.tasks.find((t) => (t._id || t.id) === taskId);
      if (task) {
        task.status = newStatus;
        renderKanbanBoard();
      }
    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

function renderTimeline() {
  const container = document.getElementById('timelineContainer');

  if (!appState.milestones || appState.milestones.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No milestones yet.</p></div>';
    return;
  }

  const sortedMilestones = [...appState.milestones].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  container.innerHTML = sortedMilestones
    .map((milestone) => {
      const status = milestone.status || 'not_started';
      return `
        <div class="timeline-item ${status}">
          <div class="timeline-milestone ${status}">
            <div class="timeline-milestone-title">${milestone.title}</div>
            <div class="timeline-milestone-dates">
              <span>📅 ${new Date(milestone.startDate).toLocaleDateString()} - ${new Date(milestone.dueDate).toLocaleDateString()}</span>
            </div>
            <div class="timeline-milestone-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${milestone.progress || 0}%"></div>
              </div>
              <div class="progress-label">${milestone.progress || 0}%</div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function selectTask(taskId) {
  // Task selection logic - can be expanded
  console.log('Selected task:', taskId);
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', init);
