// ===== MAIN APPLICATION SCRIPT =====
class InfinityMutualFunds {
    constructor() {
        this.init();
    }

    init() {
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize modals
        this.initModals();
        
        // Initialize form validations
        this.initForms();
        
        // Initialize date pickers
        this.initDatePickers();
        
        // Initialize charts
        this.initCharts();
        
        // Load user data if logged in
        this.loadUserData();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    // ===== TOOLTIPS =====
    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.dataset.tooltip;
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'var(--dark-color)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = '1000';
                tooltip.style.whiteSpace = 'nowrap';
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';
                
                e.target._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
    }

    // ===== MODALS =====
    initModals() {
        // Open modal
        document.querySelectorAll('[data-modal-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalTarget;
                this.openModal(modalId);
            });
        });

        // Close modal
        document.querySelectorAll('.modal-close, [data-modal-close]').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // ===== FORMS =====
    initForms() {
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        // Real-time validation
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Password confirmation validation
        const password = form.querySelector('input[type="password"][name="password"]');
        const confirmPassword = form.querySelector('input[type="password"][name="confirm_password"]');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            errorMessage = 'This field is required';
            isValid = false;
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        } else if (field.type === 'password' && field.value) {
            if (field.value.length < 6) {
                errorMessage = 'Password must be at least 6 characters';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // ===== DATE PICKERS =====
    initDatePickers() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = new Date().toISOString().split('T')[0];
            }
        });
    }

    // ===== CHARTS =====
    initCharts() {
        // Initialize any charts on the page
        const chartElements = document.querySelectorAll('[data-chart]');
        chartElements.forEach(element => {
            const chartType = element.dataset.chart;
            const chartData = element.dataset.chartData ? JSON.parse(element.dataset.chartData) : null;
            
            if (chartData) {
                this.renderChart(element, chartType, chartData);
            }
        });
    }

    renderChart(canvas, type, data) {
        // Chart.js integration would go here
        // For now, we'll create a simple placeholder
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        return new Chart(canvas, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // ===== USER DATA =====
    loadUserData() {
        // Check if user is logged in
        if (document.body.classList.contains('logged-in')) {
            // Load user data from session/localStorage
            const userData = this.getUserData();
            this.updateUIWithUserData(userData);
        }
    }

    getUserData() {
        try {
            return JSON.parse(localStorage.getItem('infinity_user')) || {};
        } catch (e) {
            return {};
        }
    }

    updateUIWithUserData(userData) {
        // Update user avatar
        const avatar = document.querySelector('.user-avatar');
        if (avatar && userData.name) {
            avatar.textContent = userData.name.charAt(0).toUpperCase();
        }

        // Update username display
        const usernameElements = document.querySelectorAll('.username-display');
        usernameElements.forEach(el => {
            if (userData.username) {
                el.textContent = userData.username;
            }
        });
    }

    // ===== API CALLS =====
    async apiCall(endpoint, method = 'GET', data = null) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: method,
            headers: headers
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(endpoint, config);
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || 'API request failed');
            }
            
            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            this.showAlert(error.message, 'error');
            throw error;
        }
    }

    // ===== ALERTS =====
    showAlert(message, type = 'info', duration = 5000) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.global-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} global-alert`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="alert-close" style="margin-left: auto; background: none; border: none; cursor: pointer;">×</button>
        `;

        // Style for global alert
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.minWidth = '300px';
        alert.style.maxWidth = '500px';

        // Add close functionality
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => alert.remove());

        // Add to document
        document.body.appendChild(alert);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => alert.remove(), duration);
        }

        return alert;
    }

    // ===== UTILITIES =====
    formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    debounce(func, wait) {
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

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Logout button
        document.querySelectorAll('[data-logout]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Print buttons
        document.querySelectorAll('[data-print]').forEach(btn => {
            btn.addEventListener('click', () => window.print());
        });

        // Search functionality
        const searchInput = document.querySelector('[data-search]');
        if (searchInput) {
            const debouncedSearch = this.debounce(this.performSearch.bind(this), 300);
            searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
        }
    }

    async performSearch(query) {
        if (query.length < 2) return;
        
        // Show loading
        this.showAlert('Searching...', 'info', 2000);
        
        // Implement search logic
        // This would typically make an API call
        console.log('Searching for:', query);
    }

    logout() {
        // Clear user data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('infinity_user');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    window.app = new InfinityMutualFunds();
    
    // Add class to body based on page
    const body = document.body;
    const path = window.location.pathname;
    
    if (path.includes('dashboard')) {
        body.classList.add('dashboard-page');
    } else if (path.includes('login')) {
        body.classList.add('auth-page');
    }
    
    // Check if user is logged in
    if (localStorage.getItem('auth_token')) {
        body.classList.add('logged-in');
    }
});

// ===== GLOBAL UTILITY FUNCTIONS =====
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => window.app.showAlert('Copied to clipboard', 'success'))
        .catch(err => console.error('Copy failed:', err));
}