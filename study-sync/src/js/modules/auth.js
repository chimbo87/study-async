import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { showAlert } from '../utils/helpers.js';

export function renderApp() {
    const currentUser = getFromStorage('currentUser');
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      console.error('App container not found!');
      return;
    }
  
    // Check the current route
    const path = window.location.pathname;
    
    if (currentUser) {
      if (path.includes('/dashboard')) {
        appContainer.innerHTML = renderDashboard();
      } else {
        // Handle other authenticated routes
        appContainer.innerHTML = renderDashboard(); // Default to dashboard
        window.history.pushState({}, '', '/dashboard');
      }
      setupAuthEvents();
    } else {
      // If not logged in, show auth view regardless of path
      appContainer.innerHTML = renderAuthView();
      setupAuthEvents();
      window.history.pushState({}, '', '/login');
    }
  }

function renderDashboard() {
  return `
    <div class="app-container">
      ${renderHeader()}
      ${renderSidebar()}
      ${renderMainContent()}
    </div>
  `;
}

function renderAuthView() {
  return `
    <div class="auth-container">
      ${renderAuthForms()}
    </div>
  `;
}

function renderAuthForms() {
  return `
    <div class="auth-forms">
      <div class="auth-tabs">
        <button class="tab-btn active" data-tab="login">Login</button>
        <button class="tab-btn" data-tab="register">Register</button>
      </div>
      
      <div class="tab-content active" id="login-tab">
        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div class="auth-footer">
          <p>Forgot password? <a href="#reset-password">Reset here</a></p>
        </div>
      </div>
      
      <div class="tab-content" id="register-tab">
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input type="text" id="register-name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" required minlength="6">
          </div>
          <div class="form-group">
            <label for="register-confirm">Confirm Password</label>
            <input type="password" id="register-confirm" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" id="register-submit-btn">Register</button>
        </form>
      </div>
    </div>
  `;
}

export function setupAuthEvents() {
  // Tab switching - fixed with proper event delegation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      e.preventDefault();
      const tabId = e.target.getAttribute('data-tab');
      switchAuthTab(tabId);
    }
  });

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin(e).catch(error => {
        showAlert(error.message, 'error');
      });
    });
  }

  // Register form - completely fixed version
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegister(e)
        .then(() => {
          showAlert('Registration successful! Redirecting to dashboard...', 'success');
          // Important: Directly render app after successful registration
          renderApp();
        })
        .catch(error => {
          showAlert(error.message, 'error');
        });
    });
  }

  // Mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
}

function switchAuthTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Deactivate all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Activate selected tab
  const activeTab = document.getElementById(`${tabId}-tab`);
  if (activeTab) activeTab.classList.add('active');
  
  // Activate selected button
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }
    
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    saveToStorage('currentUser', user);
    showAlert('Login successful! Redirecting to dashboard...', 'success');
    
    // Trigger a re-render to show dashboard
    renderApp();
}

async function handleRegister(e) {
  const name = document.getElementById('register-name')?.value;
  const email = document.getElementById('register-email')?.value;
  const password = document.getElementById('register-password')?.value;
  const confirmPassword = document.getElementById('register-confirm')?.value;
  
  // Validate all fields
  if (!name || !email || !password || !confirmPassword) {
    throw new Error('Please fill in all fields');
  }
  
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const users = getFromStorage('users') || [];
  if (users.some(u => u.email === email)) {
    throw new Error('User with this email already exists');
  }
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveToStorage('users', users);
  saveToStorage('currentUser', newUser);
}

function toggleMobileMenu() {
  document.querySelector('.app-sidebar')?.classList.toggle('active');
}

// Header rendering function
function renderHeader() {
  const currentUser = getFromStorage('currentUser');
  return `
    <header class="app-header">
      <div class="header-left">
        <h1 class="logo">StudySync</h1>
        <button class="mobile-menu-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div class="header-right">
        <div class="search-bar">
          <input type="text" placeholder="Search resources, groups...">
          <button><i class="fas fa-search"></i></button>
        </div>
        <div class="user-actions">
          <button class="notification-btn">
            <i class="fas fa-bell"></i>
            <span class="notification-count">0</span>
          </button>
          <div class="user-profile">
            <img src="/assets/images/default-profile.png" alt="${currentUser?.name || 'User'}">
            <span>${currentUser?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderSidebar() {
  return `
    <aside class="app-sidebar">
      <nav class="main-nav">
        <ul>
          <li class="active"><a href="#dashboard"><i class="fas fa-home"></i> Dashboard</a></li>
          <li><a href="#study-groups"><i class="fas fa-users"></i> Study Groups</a></li>
          <li><a href="#resource-library"><i class="fas fa-book"></i> Resource Library</a></li>
          <li><a href="#virtual-study"><i class="fas fa-video"></i> Virtual Study</a></li>
          <li><a href="#projects"><i class="fas fa-tasks"></i> Projects</a></li>
          <li><a href="#analytics"><i class="fas fa-chart-line"></i> Analytics</a></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button class="btn btn-primary new-group-btn">
          <i class="fas fa-plus"></i> New Group
        </button>
      </div>
    </aside>
  `;
}

function renderMainContent() {
  const currentUser = getFromStorage('currentUser');
  return `
    <main class="app-main">
      <div class="dashboard-container">
        <section class="welcome-section">
          <h2>Welcome back, <span class="user-name">${currentUser?.name || 'User'}</span>!</h2>
          <p>Ready to continue your learning journey?</p>
        </section>
        
        <section class="quick-actions">
          <div class="action-card join-group">
            <i class="fas fa-users"></i>
            <h3>Join a Study Group</h3>
            <p>Connect with peers studying the same subjects</p>
          </div>
          <div class="action-card add-resource">
            <i class="fas fa-book"></i>
            <h3>Add Resources</h3>
            <p>Share your notes and study materials</p>
          </div>
          <div class="action-card schedule-study">
            <i class="fas fa-calendar"></i>
            <h3>Schedule Study</h3>
            <p>Plan your next study session</p>
          </div>
        </section>
        
        <section class="recent-groups">
          <div class="section-header">
            <h3>Recent Study Groups</h3>
            <a href="#all-groups" class="view-all">View All</a>
          </div>
          <div class="groups-grid" id="recent-groups-container">
            <!-- Groups will be loaded here -->
          </div>
        </section>
        
        <section class="recent-resources">
          <div class="section-header">
            <h3>Recent Resources</h3>
            <a href="#all-resources" class="view-all">View All</a>
          </div>
          <div class="resources-list" id="recent-resources-container">
            <!-- Resources will be loaded here -->
          </div>
        </section>
      </div>
    </main>
  `;
}