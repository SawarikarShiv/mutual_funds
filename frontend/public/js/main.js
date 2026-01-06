// js/main.js - Common JavaScript Functions for Infinity MF System

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set current date and time
    updateDateTime();
    
    // Initialize theme (dark/light mode)
    initializeTheme();
    
    // Initialize notifications
    initializeNotifications();
    
    // Initialize sidebar menu
    initializeSidebar();
    
    // Initialize modal system
    initializeModals();
    
    // Check user authentication
    checkAuthStatus();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize data tables
    initializeDataTables();
    
    // Load user preferences
    loadUserPreferences();
}

// Date and Time Functions
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-IN', options);
    }
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-IN');
    }
    
    // Update every minute
    setTimeout(updateDateTime, 60000);
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            document.body.classList.toggle('dark-theme', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Notification System
function initializeNotifications() {
    // Sample notifications
    window.notifications = [
        {
            id: 1,
            title: 'SIP Payment Due',
            message: 'Your monthly SIP of ₹10,000 for SBI Bluechip Fund is due tomorrow',
            type: 'warning',
            time: '10:30 AM',
            read: false
        },
        {
            id: 2,
            title: 'NAV Updated',
            message: 'NAV for all funds have been updated for today',
            type: 'info',
            time: '9:15 AM',
            read: true
        },
        {
            id: 3,
            title: 'Welcome to Infinity MF',
            message: 'Your account has been successfully activated',
            type: 'success',
            time: 'Yesterday',
            read: true
        }
    ];
    
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification .badge');
    if (badge) {
        const unreadCount = window.notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
    
    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Sidebar Management
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Highlight active menu item
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
            item.closest('.sidebar-item')?.classList.add('active');
        }
    });
}

// Modal System
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Authentication Functions
function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
        window.currentUser = JSON.parse(userData);
        updateUserProfile();
    } else if (!window.location.pathname.includes('index.html')) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    }
}

function updateUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile && window.currentUser) {
        const nameElement = userProfile.querySelector('span');
        const avatarElement = userProfile.querySelector('img');
        
        if (nameElement) {
            nameElement.textContent = window.currentUser.name || 'User';
        }
        
        if (avatarElement && window.currentUser.avatar) {
            avatarElement.src = window.currentUser.avatar;
        }
    }
}

// Tooltip System
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipText = this.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
    }
}

// Data Table Functions
function initializeDataTables() {
    const tables = document.querySelectorAll('table[data-sortable]');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th[data-sortable]');
        
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    });
}

function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = table.getAttribute('data-sort-direction') === 'asc';
    
    rows.sort((a, b) => {
        const aValue = a.children[column].textContent.trim();
        const bValue = b.children[column].textContent.trim();
        
        // Try to parse as number
        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
        }
        
        // Otherwise sort as string
        return isAsc 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });
    
    // Update sort direction
    table.setAttribute('data-sort-direction', isAsc ? 'desc' : 'asc');
    
    // Clear and re-append rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// User Preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Apply preferences
    if (preferences.defaultView) {
        // Apply default view preference
    }
    
    if (preferences.notificationSound !== undefined) {
        // Set notification sound preference
    }
}

function saveUserPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return ((part / total) * 100).toFixed(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// API Functions (Simulated)
async function fetchData(endpoint, method = 'GET', data = null) {
    const baseURL = 'http://localhost:3000/api'; // Change this to your API URL
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Failed to fetch data. Please try again.', 'error');
        throw error;
    }
}

// Export functions for use in other modules
window.InfinityMF = {
    showNotification,
    formatCurrency,
    formatNumber,
    formatDate,
    fetchData,
    calculatePercentage
};

// Auto-update every 5 minutes for real-time data
setInterval(() => {
    if (document.visibilityState === 'visible') {
        // Refresh data if page is visible
        const event = new CustomEvent('dataRefresh');
        document.dispatchEvent(event);
    }
}, 300000); // 5 minutes