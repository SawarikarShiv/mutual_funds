/**
 * Infinity Mutual Funds - Main Application File
 * Handles global functions, authentication, and common utilities
 */

// Global variables
const API_BASE_URL = 'http://localhost/infinity-mutual-funds/api';
const APP_NAME = 'Infinity Mutual Funds';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
        window.location.href = 'login.html';
        return null;
    }
    
    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
        window.location.href = 'login.html';
        return null;
    }
}

// Show/hide loading spinner
function showLoading(show = true) {
    const loader = document.getElementById('loading-spinner') || createLoader();
    loader.style.display = show ? 'flex' : 'none';
}

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loading-spinner';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        display: none;
    `;
    loader.innerHTML = `
        <div class="spinner">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </div>
    `;
    document.body.appendChild(loader);
    return loader;
}

// API request handler
async function makeRequest(endpoint, method = 'GET', data = null) {
    showLoading(true);
    
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (response.status === 401) {
            // Unauthorized - logout user
            localStorage.clear();
            window.location.href = 'login.html?session=expired';
            return null;
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
        color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
        border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: 15px; background: none; border: none; cursor: pointer; font-size: 16px;">×</button>
        <style>
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Format currency
function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString, format = 'dd-mm-yyyy') {
    const date = new Date(dateString);
    
    if (format === 'dd-mm-yyyy') {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    return date.toLocaleDateString();
}

// Debounce function for search inputs
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

// Export functions
window.InfinityMF = {
    checkAuth,
    makeRequest,
    showNotification,
    formatCurrency,
    formatDate,
    debounce
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check auth on all pages except login/register
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        const user = checkAuth();
        if (user) {
            console.log('User authenticated:', user.username);
        }
    }
    
    // Initialize all tooltips
    initializeTooltips();
});

function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        white-space: nowrap;
    `;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
    tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    
    e.target.dataset.tooltipId = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target.dataset.tooltipId;
    if (tooltip && tooltip.parentElement) {
        tooltip.parentElement.removeChild(tooltip);
    }
}