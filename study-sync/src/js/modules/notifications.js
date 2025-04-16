import { getFromStorage, saveToStorage } from '../utils/storage.js';

export function initNotifications() {
  // Check if notifications exist
  if (!getFromStorage('notifications')) {
    // Initialize with some sample data
    const sampleNotifications = [
      {
        id: '1',
        type: 'group',
        message: 'You have been added to the Advanced Calculus study group',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'resource',
        message: 'New resource shared in Computer Science Fundamentals group',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    saveToStorage('notifications', sampleNotifications);
  }
  
  // Update notification count in header
  updateNotificationCount();
  
  // Setup event listeners
  setupNotificationEvents();
}

function updateNotificationCount() {
  const notifications = getFromStorage('notifications') || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const countElement = document.querySelector('.notification-count');
  if (countElement) {
    countElement.textContent = unreadCount;
    countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

function setupNotificationEvents() {
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', showNotifications);
  }
}

function showNotifications() {
  // In a complete implementation, this would show a dropdown
  // or modal with all notifications
  alert('Notifications panel would open here');
  
  // Mark notifications as read
  const notifications = getFromStorage('notifications') || [];
  const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
  saveToStorage('notifications', updatedNotifications);
  
  // Update count
  updateNotificationCount();
}