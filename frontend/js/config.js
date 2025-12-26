/**
 * Configuration file for AGB IT Planner
 * Handles environment-specific settings for frontend
 */

const CONFIG = {
  // API Configuration
  API: {
    // Development (local)
    dev: {
      BASE_URL: 'http://localhost:5000',
      TIMEOUT: 10000,
    },
    // Production (ngrok tunnel to local backend)
    production: {
      BASE_URL: 'https://vicenta-unnominated-randal.ngrok-free.dev', // ngrok tunnel URL
      TIMEOUT: 15000,
    },
  },

  // Get current environment
  getEnvironment() {
    // Check if localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'dev';
    }
    return 'production';
  },

  // Get current API config
  getApiConfig() {
    const env = this.getEnvironment();
    return this.API[env];
  },

  // Application Settings
  APP: {
    NAME: 'AGB IT Planner',
    VERSION: '1.0.0',
    AUTHOR: 'AGB IT Solutions',
  },

  // Feature Flags
  FEATURES: {
    OFFLINE_MODE: true,
    CACHE_DURATION: 3600000, // 1 hour
    AUTO_REFRESH: true,
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
  },

  // UI Settings
  UI: {
    ITEMS_PER_PAGE: 10,
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 5000,
  },

  // Validation Rules
  VALIDATION: {
    PROJECT_NAME_MIN_LENGTH: 3,
    PROJECT_NAME_MAX_LENGTH: 100,
    TASK_TITLE_MIN_LENGTH: 3,
    TASK_TITLE_MAX_LENGTH: 200,
    MAX_FILE_SIZE: 10485760, // 10MB
  },

  // Status Mappings
  STATUS: {
    TASK: ['todo', 'in_progress', 'in_review', 'done'],
    PROJECT: ['planning', 'active', 'paused', 'completed', 'archived'],
    MILESTONE: ['not_started', 'in_progress', 'completed', 'delayed'],
  },

  // Priority Levels
  PRIORITY: {
    COLORS: {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#FF9800',
      critical: '#F44336',
    },
    LEVELS: ['low', 'medium', 'high', 'critical'],
  },

  // Helper Functions
  isOnline() {
    return navigator.onLine;
  },

  getApiUrl(endpoint) {
    const config = this.getApiConfig();
    return `${config.BASE_URL}${endpoint}`;
  },

  isProduction() {
    return this.getEnvironment() === 'production';
  },

  isDevelopment() {
    return this.getEnvironment() === 'dev';
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
