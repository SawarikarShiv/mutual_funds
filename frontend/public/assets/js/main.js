// Main Infinity Mutual Funds JavaScript
console.log('Infinity Mutual Funds loaded');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('infinity_auth') === 'true';
    const currentPage = window.location.pathname;
    
    // Redirect if not authenticated but on protected page
    if (!isAuthenticated && currentPage.includes('dashboard')) {
        window.location.href = 'login.html';
    }
    
    // Redirect if authenticated but on login page
    if (isAuthenticated && currentPage.includes('login')) {
        window.location.href = 'dashboard.html';
    }
});