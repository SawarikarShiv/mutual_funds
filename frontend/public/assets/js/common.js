// Common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth and user info
    initializeUserInfo();
    setupLogout();
    checkAuth();
});

// Initialize user info in navigation
function initializeUserInfo() {
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.textContent = currentUser.avatar || 'U';
        }
        
        // Update user name if element exists
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = currentUser.name || 'User';
        }
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            Auth.logout();
            localStorage.removeItem('infinity_auth');
            localStorage.removeItem('infinity_user');
            window.location.href = 'index.html';
        });
    });
}

// Check authentication
function checkAuth() {
    // Skip auth check for login/register pages
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html') || currentPage.includes('register.html')) {
        return;
    }
    
    // For all other pages, check if user is authenticated
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// Format currency
function formatCurrency(amount) {
    if (amount >= 10000000) {
        return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    } else {
        return '₹' + amount.toLocaleString('en-IN');
    }
}

// Format percentage
function formatPercentage(value) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}