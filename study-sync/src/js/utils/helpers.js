export function setupNavigation() {
    // Handle navigation links
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const route = e.target.getAttribute('href').substring(1);
        navigateTo(route);
      }
    });
  }
  
  function navigateTo(route) {
    // In a complete implementation, this would handle routing
    console.log(`Navigating to: ${route}`);
  }
  
  export function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add to body
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
  
  // Add some basic styling for alerts
  const style = document.createElement('style');
  style.textContent = `
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }
    
    .alert-info {
      background-color: #1A4B84;
    }
    
    .alert-success {
      background-color: #28a745;
    }
    
    .alert-error {
      background-color: #dc3545;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);