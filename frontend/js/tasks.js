/**
 * Task Management UI with WhatsApp Notifications
 * Handles task creation, updates, and team member mentions
 */

// Task Management State
const taskState = {
  currentTask: null,
  mentionedMembers: [],
  whatsappLinks: []
};

/**
 * Initialize task management
 */
function initTaskManagement() {
  setupTaskEventListeners();
  loadTasks();
}

/**
 * Setup event listeners for task management
 */
function setupTaskEventListeners() {
  // Task creation form submit
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskSubmit);
  }

  // Team member mention selector
  const mentionSelector = document.getElementById('mention-members');
  if (mentionSelector) {
    mentionSelector.addEventListener('change', handleMemberMention);
  }

  // WhatsApp notification button
  const whatsappBtn = document.getElementById('send-whatsapp-notifications');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', sendWhatsAppNotifications);
  }
}

/**
 * Load tasks for current project
 */
async function loadTasks(projectId) {
  try {
    const url = projectId 
      ? `${window.tasksAPI.getAll}?projectId=${projectId}`
      : window.tasksAPI.getAll;
    
    const response = await fetch(url, {
      headers: window.tasksAPI.headers()
    });

    if (!response.ok) throw new Error('Failed to load tasks');

    const data = await response.json();
    renderTasks(data.data);
  } catch (error) {
    console.error('Error loading tasks:', error);
    showNotification('Failed to load tasks', 'error');
  }
}

/**
 * Handle task form submission
 */
async function handleTaskSubmit(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    project: document.getElementById('task-project').value,
    priority: document.getElementById('task-priority').value,
    dueDate: document.getElementById('task-due-date').value,
    estimatedHours: document.getElementById('task-estimated-hours').value,
    tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    mentionedMembers: taskState.mentionedMembers
  };

  if (!formData.title) {
    showNotification('Task title is required', 'error');
    return;
  }

  if (!formData.project) {
    showNotification('Please select a project', 'error');
    return;
  }

  try {
    const response = await fetch(window.tasksAPI.create, {
      method: 'POST',
      headers: window.tasksAPI.headers(),
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }

    const data = await response.json();
    
    console.log('✅ Task created:', data);
    showNotification(data.message || 'Task created successfully', 'success');

    // Store WhatsApp links for notifications
    if (data.notifications && data.notifications.length > 0) {
      taskState.whatsappLinks = data.notifications;
      showWhatsAppNotificationPanel(data.notifications);
    }

    // Reset form
    e.target.reset();
    taskState.mentionedMembers = [];
    updateMentionedMembersDisplay();

    // Reload tasks
    const projectId = formData.project;
    loadTasks(projectId);

  } catch (error) {
    console.error('❌ Error creating task:', error);
    showNotification(error.message, 'error');
  }
}

/**
 * Handle team member mention selection
 */
function handleMemberMention(e) {
  const selectedOptions = Array.from(e.target.selectedOptions);
  
  taskState.mentionedMembers = selectedOptions.map(option => ({
    userId: option.value,
    name: option.dataset.name,
    whatsappNumber: option.dataset.whatsapp
  })).filter(m => m.whatsappNumber); // Only include members with WhatsApp

  updateMentionedMembersDisplay();
}

/**
 * Update mentioned members display
 */
function updateMentionedMembersDisplay() {
  const container = document.getElementById('mentioned-members-display');
  if (!container) return;

  if (taskState.mentionedMembers.length === 0) {
    container.innerHTML = '<p class="text-muted">No members mentioned</p>';
    return;
  }

  const html = `
    <div class="mentioned-members-list">
      <h6>📱 Will notify via WhatsApp:</h6>
      ${taskState.mentionedMembers.map(member => `
        <div class="mention-badge">
          <span class="member-name">@${member.name}</span>
          <span class="member-whatsapp">${member.whatsappNumber}</span>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Show WhatsApp notification panel
 */
function showWhatsAppNotificationPanel(notifications) {
  const panel = document.getElementById('whatsapp-notification-panel');
  if (!panel) {
    createWhatsAppNotificationPanel();
    return;
  }

  const html = `
    <div class="notification-panel-content">
      <h5>📱 WhatsApp Notifications Ready</h5>
      <p>${notifications.length} team member(s) will be notified</p>
      <div class="notification-links">
        ${notifications.map((notif, index) => `
          <div class="notification-item">
            <strong>${notif.name}</strong>
            <button 
              class="btn btn-success btn-sm whatsapp-send-btn" 
              data-index="${index}"
              onclick="openWhatsAppLink(${index})">
              <i class="fab fa-whatsapp"></i> Send to ${notif.name}
            </button>
          </div>
        `).join('')}
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" onclick="openAllWhatsAppLinks()">
          <i class="fab fa-whatsapp"></i> Open All (${notifications.length})
        </button>
        <button class="btn btn-secondary" onclick="closeWhatsAppPanel()">
          Close
        </button>
      </div>
    </div>
  `;

  panel.innerHTML = html;
  panel.style.display = 'block';
}

/**
 * Create WhatsApp notification panel
 */
function createWhatsAppNotificationPanel() {
  const panel = document.createElement('div');
  panel.id = 'whatsapp-notification-panel';
  panel.className = 'whatsapp-panel';
  document.body.appendChild(panel);
}

/**
 * Open single WhatsApp link
 */
function openWhatsAppLink(index) {
  if (!taskState.whatsappLinks[index]) {
    console.error('Invalid notification index:', index);
    return;
  }

  const notification = taskState.whatsappLinks[index];
  window.open(notification.whatsappLink, '_blank');
  
  // Mark as sent
  const btn = document.querySelector(`[data-index="${index}"]`);
  if (btn) {
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');
    btn.innerHTML = '<i class="fas fa-check"></i> Sent';
    btn.disabled = true;
  }
}

/**
 * Open all WhatsApp links
 */
function openAllWhatsAppLinks() {
  if (taskState.whatsappLinks.length === 0) {
    showNotification('No notifications to send', 'info');
    return;
  }

  // Open each link with a delay to avoid popup blocker
  taskState.whatsappLinks.forEach((notif, index) => {
    setTimeout(() => {
      window.open(notif.whatsappLink, '_blank');
    }, index * 500); // 500ms delay between each
  });

  showNotification(`Opening ${taskState.whatsappLinks.length} WhatsApp conversations...`, 'success');
  
  // Close panel after delay
  setTimeout(() => {
    closeWhatsAppPanel();
  }, taskState.whatsappLinks.length * 500 + 1000);
}

/**
 * Close WhatsApp panel
 */
function closeWhatsAppPanel() {
  const panel = document.getElementById('whatsapp-notification-panel');
  if (panel) {
    panel.style.display = 'none';
  }
  taskState.whatsappLinks = [];
}

/**
 * Send WhatsApp notifications manually
 */
async function sendWhatsAppNotifications() {
  if (taskState.whatsappLinks.length === 0) {
    showNotification('No pending notifications', 'info');
    return;
  }

  openAllWhatsAppLinks();
}

/**
 * Render tasks list
 */
function renderTasks(tasks) {
  const container = document.getElementById('tasks-container');
  if (!container) return;

  if (!tasks || tasks.length === 0) {
    container.innerHTML = '<p class="text-muted">No tasks found</p>';
    return;
  }

  // Group tasks by status
  const grouped = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    in_review: tasks.filter(t => t.status === 'in_review'),
    done: tasks.filter(t => t.status === 'done')
  };

  const html = `
    <div class="tasks-kanban">
      ${renderTaskColumn('To Do', 'todo', grouped.todo)}
      ${renderTaskColumn('In Progress', 'in_progress', grouped.in_progress)}
      ${renderTaskColumn('In Review', 'in_review', grouped.in_review)}
      ${renderTaskColumn('Done', 'done', grouped.done)}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Render task column
 */
function renderTaskColumn(title, status, tasks) {
  return `
    <div class="task-column" data-status="${status}">
      <h5>${title} <span class="badge">${tasks.length}</span></h5>
      <div class="task-list">
        ${tasks.map(task => renderTaskCard(task)).join('')}
      </div>
    </div>
  `;
}

/**
 * Render task card
 */
function renderTaskCard(task) {
  const priorityColors = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#fd7e14',
    critical: '#dc3545'
  };

  return `
    <div class="task-card" data-task-id="${task.id}">
      <div class="task-header">
        <h6>${task.title}</h6>
        <span class="priority-badge" style="background: ${priorityColors[task.priority]}">
          ${task.priority}
        </span>
      </div>
      ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
      <div class="task-footer">
        ${task.dueDate ? `<span class="due-date">📅 ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
        ${task.mentionedMembers?.length ? `<span class="mentions">👥 ${task.mentionedMembers.length}</span>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn-icon" onclick="viewTask(${task.id})" title="View">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon" onclick="editTask(${task.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </div>
  `;
}

/**
 * Load team members for mention dropdown
 */
async function loadTeamMembers(teamId) {
  try {
    const response = await fetch(`${window.teamsAPI.getById}/${teamId}`, {
      headers: window.teamsAPI.headers()
    });

    if (!response.ok) throw new Error('Failed to load team');

    const data = await response.json();
    const team = data.data;

    // Populate mention selector
    const mentionSelector = document.getElementById('mention-members');
    if (mentionSelector && team.members) {
      mentionSelector.innerHTML = team.members
        .filter(m => m.whatsappNumber) // Only show members with WhatsApp
        .map(member => `
          <option 
            value="${member.userId}" 
            data-name="${member.name}"
            data-whatsapp="${member.whatsappNumber}">
            ${member.name} (${member.whatsappNumber})
          </option>
        `).join('');
    }
  } catch (error) {
    console.error('Error loading team members:', error);
  }
}

// Expose functions globally
window.initTaskManagement = initTaskManagement;
window.loadTasks = loadTasks;
window.loadTeamMembers = loadTeamMembers;
window.openWhatsAppLink = openWhatsAppLink;
window.openAllWhatsAppLinks = openAllWhatsAppLinks;
window.closeWhatsAppPanel = closeWhatsAppPanel;
