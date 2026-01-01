// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initComponents();
    
    // Set current year in footer if exists
    setCurrentYear();
    
    // Setup logout functionality
    setupLogout();
});

function initComponents() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
    
    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', toggleDropdown);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.dataset.tooltip;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function toggleDropdown(e) {
    e.stopPropagation();
    const dropdown = e.target.closest('.dropdown');
    dropdown.classList.toggle('active');
}

function setCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

function setupLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would call your logout API
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            }
        });
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R to refresh portfolio
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (window.portfolioManager) {
            window.portfolioManager.manualRefresh();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal && window.themeManager) {
            window.themeManager.closeThemeModal();
        }
    }
});