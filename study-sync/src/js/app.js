import { renderApp } from './modules/auth.js';
import { setupNavigation } from './utils/helpers.js';
import { initStudyGroups } from './modules/studygroups.js';
import { initResourceLibrary } from './modules/resourcelibrary.js';
import { initAnalytics } from './modules/analytics.js';
import { initNotifications } from './modules/notifications.js';
import { initAPI } from './modules/api-integrations.js';

export function initApp() {
  // Initialize the app by rendering the appropriate view based on authentication
  renderApp();
  
  // Setup other modules and components
  setupNavigation();
  
  // Initialize all feature modules
  try {
    initStudyGroups();
    initResourceLibrary();
    initAnalytics();
    initNotifications();
    initAPI();
  } catch (error) {
    console.error('Error initializing modules:', error);
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});