// Global Climate Solution - Main JavaScript Functions

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceID: 'service_8vvi6bk',       // ✅ Service ID dari Gmail service
  templateID: 'template_5y8bbkk',      // Ganti dengan Template ID dari step 2
  userID: 'f3guQ1_2BbPuikway',             // Ganti dengan User ID (Public Key) dari step 3
  adminEmail: 'ugadimas@gmail.com'
};

// Initialize EmailJS when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.userID);
  }
});

// Function to send email notification
async function sendSubscriptionNotification(planType, userInfo) {
  try {
    const templateParams = {
      to_email: EMAILJS_CONFIG.adminEmail,
      from_name: 'Global Climate Solution',
      plan_type: planType.toUpperCase(),
      user_name: userInfo.username || 'Anonymous User',
      user_email: userInfo.email || 'Not provided',
      timestamp: new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      plan_price: planType === 'pro' ? '$25.00/month' : '$100.00/month',
      message: `New subscription to ${planType.toUpperCase()} plan from Global Climate Solution platform.`
    };

    if (typeof emailjs !== 'undefined') {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
      );
      
      console.log('Email notification sent successfully:', response);
      return true;
    } else {
      console.warn('EmailJS not loaded, email notification skipped');
      return false;
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Authentication Check
window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('whispLoggedIn');
  const loginTime = localStorage.getItem('whispLoginTime');
  const username = localStorage.getItem('whispUsername');
  
  if (!isLoggedIn || isLoggedIn !== 'true') {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
    return;
  }
  
  if (loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const diffHours = (now - loginDate) / (1000 * 60 * 60);
    
    // Auto logout after 24 hours
    if (diffHours >= 24) {
      localStorage.removeItem('whispLoggedIn');
      localStorage.removeItem('whispUsername');
      localStorage.removeItem('whispLoginTime');
      window.location.href = 'login.html';
      return;
    }
  }
  
  // Show welcome message
  if (username) {
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
      welcomeMsg.innerHTML = `Welcome back, <strong>${username}</strong>! 👋`;
      welcomeMsg.style.display = 'block';
    }
  }

  // Load saved compliance type on page load
  const savedCompliance = localStorage.getItem('selectedCompliance');
  if (savedCompliance) {
    selectCompliance(savedCompliance);
  }
});

// Navigation Functions
function toggleComplianceDropdown() {
  const dropdown = document.getElementById('complianceDropdown');
  dropdown.classList.toggle('show');
}

function selectCompliance(type) {
  console.log('Selected compliance type:', type);
  
  // Close dropdown first
  const dropdown = document.getElementById('complianceDropdown');
  dropdown.classList.remove('show');
  
  // Update UI to show selected compliance type
  const complianceBtn = document.querySelector('.compliance-btn');
  let icon = '';
  let title = '';
  
  switch(type) {
    case 'EUDR':
      icon = '🇪🇺';
      title = 'EUDR';
      break;
    case 'Rainforest Alliance':
      icon = '🌳';
      title = 'Rainforest Alliance';
      break;
    case 'FSC':
      icon = '🏆';
      title = 'FSC';
      break;
    default:
      icon = '🏛️';
      title = 'Climate Solution';
  }
  
  complianceBtn.innerHTML = `
    <span>${icon}</span>
    ${title}
    <span>▼</span>
  `;
  
  // Store selected compliance type
  localStorage.setItem('selectedCompliance', type);
  
  // You can add specific logic for each compliance type here
  alert(`Switched to ${type} compliance mode`);
}

// Subscription Modal Functions
function openSubscribe() {
  console.log('Opening subscription modal...');
  const modal = document.getElementById('subscriptionModal');
  modal.classList.add('show');
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeSubscribe() {
  console.log('Closing subscription modal...');
  const modal = document.getElementById('subscriptionModal');
  modal.classList.remove('show');
  
  // Restore body scroll
  document.body.style.overflow = 'auto';
}

function selectPlan(planType) {
  console.log('Selected plan:', planType);
  
  // Store selected plan
  localStorage.setItem('selectedPlan', planType);
  
  // Close modal
  closeSubscribe();
  
  // Show confirmation
  alert(`Great choice! You've selected the ${planType.toUpperCase()} plan. 🎉\n\nFeatures will be activated shortly.`);
  
  // Send email notification for Pro and Ultra plans
  if (planType === 'pro' || planType === 'ultra') {
    // Get user info
    const username = localStorage.getItem('whispUsername') || 'Anonymous User';
    const userInfo = {
      username: username,
      email: 'Not provided', // You can add email collection later
      planType: planType,
      timestamp: new Date().toISOString()
    };
    
    // Send email notification
    sendSubscriptionNotification(planType, userInfo).then(success => {
      if (success) {
        console.log('✅ Email notification sent to admin');
        
        // Show success message to user
        setTimeout(() => {
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            animation: slideIn 0.3s ease-out;
          `;
          notification.innerHTML = '📧 Admin telah diberitahu tentang subscription Anda!';
          
          document.body.appendChild(notification);
          
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 4000);
        }, 1000);
      } else {
        console.log('⚠️ Email notification failed, but subscription recorded');
      }
    });
  }
  
  // You can add plan-specific logic here
  switch(planType) {
    case 'basic':
      console.log('Activating basic plan features...');
      break;
    case 'pro':
      console.log('Activating pro plan features...');
      // Add pro plan specific features
      break;
    case 'ultra':
      console.log('Activating ultra plan features...');
      // Add ultra plan specific features
      break;
  }
}

// Tab Switching Function
function switchTab(tabType, buttonElement) {
  // Check if IDs tab is being clicked and show maintenance message
  if (tabType === 'ids') {
    // Show maintenance alert
    const maintenanceAlert = document.createElement('div');
    maintenanceAlert.className = 'maintenance-tooltip';
    maintenanceAlert.textContent = 'Submit Geo IDs feature is currently under maintenance';
    maintenanceAlert.style.position = 'fixed';
    maintenanceAlert.style.top = '20px';
    maintenanceAlert.style.right = '20px';
    maintenanceAlert.style.zIndex = '10000';
    
    document.body.appendChild(maintenanceAlert);
    
    setTimeout(() => {
      if (maintenanceAlert.parentNode) {
        maintenanceAlert.remove();
      }
    }, 3000);
    
    // Don't switch tabs, keep geometry tab active
    return;
  }
  
  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll('.tab-buttons button');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  buttonElement.classList.add('active');
  
  // Update drop zone content based on tab
  const dropZone = document.getElementById('dropZone');
  const dropZoneContent = dropZone.querySelector('.drop-zone-content');
  
  if (tabType === 'geometry') {
    dropZoneContent.innerHTML = `
      <span class="drop-zone-icon">📁</span>
      <div class="drop-zone-text">Drag or click to upload geometry files</div>
      <div class="drop-zone-subtext">Supports .txt, .json and .geojson files</div>
    `;
  } else if (tabType === 'ids') {
    dropZoneContent.innerHTML = `
      <span class="drop-zone-icon">🆔</span>
      <div class="drop-zone-text">Drag or click to upload ID files</div>
      <div class="drop-zone-subtext">Supports .txt, .csv and .json files with geo IDs</div>
    `;
  }
  
  console.log(`Switched to ${tabType} tab`);
}

// Maintenance Tooltip Function
function showMaintenanceTooltip(event) {
  // Remove any existing tooltip
  const existingTooltip = document.querySelector('.maintenance-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // Create new tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'maintenance-tooltip';
  tooltip.textContent = 'Under Maintenance - Feature temporarily unavailable';

  // Position tooltip near the cursor
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = (rect.left - 100) + 'px';
  tooltip.style.top = (rect.top - 50) + 'px';

  // Add tooltip to document
  document.body.appendChild(tooltip);

  // Remove tooltip after 3 seconds
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.remove();
    }
  }, 3000);

  // Also disable the IDs tab functionality
  console.log('Submit Geo IDs feature is under maintenance');
}

// Logout Function
function logout() {
  // Clear authentication data
  localStorage.removeItem('whispLoggedIn');
  localStorage.removeItem('whispLoginTime');
  localStorage.removeItem('whispUsername');
  
  // Also clear old keys if they exist
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('username');
  
  // Redirect to login page
  window.location.href = 'login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Enhanced Drop Zone Interactions
  const dropZone = document.getElementById('dropZone');
  
  if (dropZone) {
    // Add drag and drop visual feedback
    dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('dragover');
      }
    });
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      // File handling would be done by submit-page.js
    });
  }
});

// Global Click Handler
document.addEventListener('click', (event) => {
  const modal = document.getElementById('subscriptionModal');
  if (event.target === modal) {
    closeSubscribe();
  }
  
  // Close compliance dropdown when clicking outside
  const complianceDropdown = document.querySelector('.compliance-dropdown');
  const dropdown = document.getElementById('complianceDropdown');
  if (complianceDropdown && dropdown && !complianceDropdown.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

// Escape Key Handler
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSubscribe();
  }
});
