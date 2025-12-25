/**
 * Kanban Board Module
 * Drag-and-drop task management
 */

function initKanbanBoard() {
  const board = document.getElementById('kanbanBoard');
  if (!board) return;

  // Initialize drag and drop for all tasks
  const tasks = board.querySelectorAll('.kanban-task');
  const columns = board.querySelectorAll('.kanban-tasks');

  tasks.forEach((task) => {
    task.addEventListener('dragstart', handleTaskDragStart);
    task.addEventListener('dragend', handleTaskDragEnd);
  });

  columns.forEach((column) => {
    column.addEventListener('dragover', handleColumnDragOver);
    column.addEventListener('drop', handleColumnDrop);
    column.addEventListener('dragleave', handleColumnDragLeave);
  });
}

function handleTaskDragStart(event) {
  event.currentTarget.style.opacity = '0.5';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('taskId', event.currentTarget.dataset.taskId || event.currentTarget.textContent);
}

function handleTaskDragEnd(event) {
  event.currentTarget.style.opacity = '1';
}

function handleColumnDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.style.backgroundColor = 'rgba(32, 128, 192, 0.1)';
}

function handleColumnDragLeave(event) {
  if (event.currentTarget === event.target) {
    event.currentTarget.style.backgroundColor = '';
  }
}

async function handleColumnDrop(event) {
  event.preventDefault();
  event.currentTarget.style.backgroundColor = '';

  const taskId = event.dataTransfer.getData('taskId');
  const newStatus = event.currentTarget.parentElement.id.replace('column-', '');

  // Update task status in backend
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      renderKanbanBoard();
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

// Initialize kanban on DOM ready
document.addEventListener('DOMContentLoaded', initKanbanBoard);
