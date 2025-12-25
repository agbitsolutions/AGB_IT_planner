/**
 * Milestones & Timeline Module
 * Timeline visualization and milestone management
 */

async function initMilestones() {
  // Load milestones for current team
  if (!appState.currentTeamId) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/milestones?teamId=${appState.currentTeamId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      appState.milestones = data.data || [];
      renderTimeline();
    }
  } catch (error) {
    console.error('Error loading milestones:', error);
  }
}

function renderTimeline() {
  const container = document.getElementById('timelineContainer');

  if (!appState.milestones || appState.milestones.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No milestones yet. Create one to track your project progress!</p></div>';
    return;
  }

  // Sort milestones by start date
  const sortedMilestones = [...appState.milestones].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const timelineHTML = sortedMilestones
    .map((milestone) => {
      const status = milestone.status || 'not_started';
      const statusClass = status === 'completed' ? 'completed' : status === 'at_risk' ? 'at-risk' : '';
      const daysUntilDue = Math.floor(
        (new Date(milestone.dueDate) - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const isAtRisk = daysUntilDue <= 7 && status !== 'completed';

      return `
        <div class="timeline-item ${isAtRisk ? 'at-risk' : statusClass}">
          <div class="timeline-milestone ${isAtRisk ? 'at-risk' : statusClass}">
            <div class="timeline-milestone-title">
              ${milestone.title}
              <small style="font-size: 12px; color: var(--color-text-secondary); font-weight: normal;">
                ${status.replace('_', ' ').toUpperCase()}
              </small>
            </div>
            <div class="timeline-milestone-dates">
              <span>Start: ${new Date(milestone.startDate).toLocaleDateString()}</span>
              <span>Due: ${new Date(milestone.dueDate).toLocaleDateString()}</span>
              ${daysUntilDue >= 0 ? `<span style="color: ${isAtRisk ? 'var(--color-danger)' : 'var(--color-text-secondary)'};">${daysUntilDue} days left</span>` : ''}
            </div>
            <div class="timeline-milestone-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${milestone.progress || 0}%; background-color: ${getProgressColor(milestone.progress || 0)};"></div>
              </div>
              <div class="progress-label">${milestone.progress || 0}%</div>
            </div>
            ${milestone.description ? `<div style="margin-top: 8px; font-size: 13px; color: var(--color-text-secondary);">${milestone.description}</div>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = timelineHTML;
}

function getProgressColor(progress) {
  if (progress >= 75) return 'var(--color-success)';
  if (progress >= 50) return 'var(--color-primary)';
  if (progress >= 25) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

async function createMilestone(event) {
  event.preventDefault();

  if (!appState.currentProjectId) {
    alert('Please select a project first');
    return;
  }

  const title = document.getElementById('milestoneTitle')?.value;
  const description = document.getElementById('milestoneDescription')?.value;
  const startDate = document.getElementById('milestoneStartDate')?.value;
  const dueDate = document.getElementById('milestoneDueDate')?.value;

  try {
    const response = await fetch('http://localhost:5000/api/milestones', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        startDate,
        dueDate,
        project: appState.currentProjectId,
        team: appState.currentTeamId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      appState.milestones.push(data.data);
      renderTimeline();
    }
  } catch (error) {
    console.error('Error creating milestone:', error);
  }
}

// Initialize milestones on DOM ready
document.addEventListener('DOMContentLoaded', initMilestones);
