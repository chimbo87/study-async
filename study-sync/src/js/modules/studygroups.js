import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { showAlert } from '../utils/helpers.js';

export function initStudyGroups() {
  // Load study groups if they exist
  if (!getFromStorage('studyGroups')) {
    // Initialize with some sample data
    const sampleGroups = [
      {
        id: '1',
        name: 'Advanced Calculus',
        description: 'Study group for MATH 301 students',
        courseCode: 'MATH 301',
        members: ['1', '2', '3'],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        image: '/assets/images/math-group.jpg'
      },
      {
        id: '2',
        name: 'Computer Science Fundamentals',
        description: 'Group for CS 101 students to collaborate',
        courseCode: 'CS 101',
        members: ['1', '4', '5'],
        createdBy: '4',
        createdAt: new Date().toISOString(),
        image: '/assets/images/cs-group.jpg'
      }
    ];
    
    saveToStorage('studyGroups', sampleGroups);
  }
  
  // Render recent groups on dashboard
  renderRecentStudyGroups();
  
  // Setup event listeners
  setupStudyGroupEvents();
}

function renderRecentStudyGroups() {
  const groupsContainer = document.getElementById('recent-groups-container');
  if (!groupsContainer) return;
  
  const groups = getFromStorage('studyGroups') || [];
  const recentGroups = groups.slice(0, 4); // Get first 4 groups
  
  if (recentGroups.length === 0) {
    groupsContainer.innerHTML = '<p>No study groups found. Create one to get started!</p>';
    return;
  }
  
  groupsContainer.innerHTML = recentGroups.map(group => `
    <div class="group-card">
      <img src="${group.image || '/assets/images/default-group.jpg'}" alt="${group.name}">
      <div class="group-card-content">
        <h4>${group.name}</h4>
        <p>${group.description}</p>
        <div class="group-meta">
          <span><i class="fas fa-users"></i> ${group.members.length} members</span>
          <span>${group.courseCode}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function setupStudyGroupEvents() {
  // New group button
  const newGroupBtn = document.querySelector('.new-group-btn');
  if (newGroupBtn) {
    newGroupBtn.addEventListener('click', showNewGroupModal);
  }
  
  // Join group action card
  const joinGroupCard = document.querySelector('.action-card.join-group');
  if (joinGroupCard) {
    joinGroupCard.addEventListener('click', showAllGroups);
  }
}

function showNewGroupModal() {
  // In a complete implementation, this would show a modal
  // for creating a new study group
  showAlert('New group functionality coming soon!', 'info');
}

function showAllGroups() {
  // In a complete implementation, this would navigate to
  // the study groups page
  showAlert('Browse all groups functionality coming soon!', 'info');
}