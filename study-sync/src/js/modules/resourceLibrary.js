import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { showAlert } from '../utils/helpers.js';

export function initResourceLibrary() {
  // Load resources if they exist
  if (!getFromStorage('resources')) {
    // Initialize with some sample data
    const sampleResources = [
      {
        id: '1',
        title: 'Calculus Cheat Sheet',
        description: 'Summary of key calculus concepts and formulas',
        type: 'notes',
        course: 'MATH 301',
        uploadedBy: '1',
        createdAt: new Date().toISOString(),
        fileSize: '2.4 MB',
        downloads: 42,
        rating: 4.5
      },
      {
        id: '2',
        title: 'Data Structures Guide',
        description: 'Comprehensive guide to common data structures',
        type: 'guide',
        course: 'CS 201',
        uploadedBy: '3',
        createdAt: new Date().toISOString(),
        fileSize: '5.1 MB',
        downloads: 87,
        rating: 4.8
      }
    ];
    
    saveToStorage('resources', sampleResources);
  }
  
  // Render recent resources on dashboard
  renderRecentResources();
  
  // Setup event listeners
  setupResourceEvents();
}

function renderRecentResources() {
  const resourcesContainer = document.getElementById('recent-resources-container');
  if (!resourcesContainer) return;
  
  const resources = getFromStorage('resources') || [];
  const recentResources = resources.slice(0, 5); // Get first 5 resources
  
  if (recentResources.length === 0) {
    resourcesContainer.innerHTML = '<p>No resources found. Upload some to get started!</p>';
    return;
  }
  
  resourcesContainer.innerHTML = recentResources.map(resource => `
    <div class="resource-item">
      <div class="resource-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="resource-info">
        <h4>${resource.title}</h4>
        <p>${resource.description}</p>
        <div class="resource-meta">
          <span>${resource.course}</span>
          <span>${resource.fileSize}</span>
          <span>${resource.downloads} downloads</span>
          <span><i class="fas fa-star"></i> ${resource.rating}</span>
        </div>
      </div>
      <div class="resource-actions">
        <button class="btn btn-secondary"><i class="fas fa-download"></i></button>
        <button class="btn btn-accent"><i class="fas fa-share-alt"></i></button>
      </div>
    </div>
  `).join('');
}

function setupResourceEvents() {
  // Add resource action card
  const addResourceCard = document.querySelector('.action-card.add-resource');
  if (addResourceCard) {
    addResourceCard.addEventListener('click', showUploadResourceModal);
  }
}

function showUploadResourceModal() {
  // In a complete implementation, this would show a modal
  // for uploading new resources
  showAlert('Resource upload functionality coming soon!', 'info');
}