/**
 * API Service Module
 * Handles all communication with the backend API with offline support
 * This file uses standard JavaScript (no ES6 modules) for browser compatibility
 */

// Use CONFIG from config.js or fallback
const getApiBaseUrl = () => {
  if (typeof CONFIG !== 'undefined') {
    return `${CONFIG.getApiUrl('/api')}`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

let token = localStorage.getItem('token');

const setToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

const getAuthHeader = () => {
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Wrapper for fetch with offline support
 * Caches successful responses and returns them when offline
 */
const fetchWithCache = async (url, options = {}) => {
  const cacheKey = `api_cache_${url}`;
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache successful response
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now(),
        status: response.status
      }));
    } catch (e) {
      console.warn('Failed to cache response:', e);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Try to return cached data
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        console.warn(`Using cached data from ${new Date(cacheData.timestamp).toLocaleString()}`);
        return cacheData.data;
      }
    } catch (e) {
      console.error('Failed to retrieve cached data:', e);
    }
    
    // If we have no cache and offline, throw a user-friendly error
    if (!navigator.onLine) {
      throw new Error('Offline: Unable to reach backend. Showing cached data.');
    }
    
    throw error;
  }
};

// Projects API
// Projects API
const projectsAPI = {
  async createProject(data) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getProjects(teamId) {
    const url = new URL(`${API_BASE_URL}/projects`);
    if (teamId) url.searchParams.append('teamId', teamId);
    
    return fetchWithCache(url.toString(), {
      headers: getAuthHeader(),
    });
  },

  async getProject(id) {
    return fetchWithCache(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async updateProject(id, data) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteProject(id) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getStats(id) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/stats`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

// Tasks API
// Tasks API
const tasksAPI = {
  async createTask(data) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getTasks(filters = {}) {
    const url = new URL(`${API_BASE_URL}/tasks`);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async updateTask(id, data) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateTaskStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  async completeTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async addAttachment(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },

  async addComment(taskId, content) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ content }),
    });
    return response.json();
  },
};

// Milestones API
// Milestones API
const milestonesAPI = {
  async createMilestone(data) {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getMilestones(filters = {}) {
    const url = new URL(`${API_BASE_URL}/milestones`);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getMilestone(id) {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async updateMilestone(id, data) {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteMilestone(id) {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getTimeline(teamId) {
    const response = await fetch(`${API_BASE_URL}/milestones/timeline?teamId=${teamId}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getProgress(id) {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}/progress`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

// Teams API
// Teams API
const teamsAPI = {
  async createTeam(data) {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getTeams() {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getPublicTeams() {
    const response = await fetch(`${API_BASE_URL}/teams/public`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getTeam(id) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async updateTeam(id, data) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteTeam(id) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async addMember(teamId, userId, role = 'member') {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ userId, role }),
    });
    return response.json();
  },

  async removeMember(teamId, userId) {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
      method: 'DELETE',
      headers: getAuthHeader(),
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },
};

// Make APIs available globally for browser usage
window.projectsAPI = projectsAPI;
window.tasksAPI = tasksAPI;
window.milestonesAPI = milestonesAPI;
window.teamsAPI = teamsAPI;
